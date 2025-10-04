const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  }
});

// Helper function to parse Excel data
const parseExcelData = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      throw new Error('Excel file must contain headers and at least one data row');
    }

    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);

    return { headers, dataRows };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

// Helper function to calculate days pending
const calculateDaysPending = (applicationDate, currentDate = new Date()) => {
  if (!applicationDate) return 0;
  
  const appDate = new Date(applicationDate);
  const diffTime = Math.abs(currentDate - appDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to determine status
const determineStatus = (daysPending) => {
  if (daysPending > 60) return 'overdue';
  if (daysPending > 30) return 'pending';
  return 'completed';
};

// Upload Excel file endpoint
router.post('/excel', authenticateToken, upload.single('excelFile'), async (req, res) => {
  const client = await pool.connect();
  
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { headers, dataRows } = parseExcelData(req.file.path);
    const batchId = `batch_${Date.now()}`;
    
    await client.query('BEGIN');

    let processedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const row = dataRows[i];
        
        // Skip empty rows
        if (!row || row.every(cell => !cell || cell.toString().trim() === '')) {
          continue;
        }

        // Map Excel columns to database fields
        // Assuming the Excel structure from the image
        const proposalData = {
          sr_no: parseInt(row[0]) || i + 1,
          proposal_number: row[1] ? row[1].toString() : null,
          proposal_code: row[2] ? row[2].toString() : null,
          transaction_date: row[3] ? new Date(row[3]) : null,
          service_name: row[4] ? row[4].toString() : null,
          owner_name: row[5] ? row[5].toString() : null,
          site_address: row[6] ? row[6].toString() : null,
          pending_by: row[7] ? row[7].toString() : null,
          designation: row[8] ? row[8].toString() : null,
          application_received_date: row[9] ? new Date(row[9]) : null
        };

        // Calculate days pending and status
        proposalData.days_pending = calculateDaysPending(proposalData.application_received_date);
        proposalData.status = determineStatus(proposalData.days_pending);
        proposalData.batch_id = batchId;

        // Insert into database
        await client.query(`
          INSERT INTO proposals (
            sr_no, proposal_number, proposal_code, transaction_date, 
            service_name, owner_name, site_address, pending_by, 
            designation, application_received_date, days_pending, 
            status, batch_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          proposalData.sr_no,
          proposalData.proposal_number,
          proposalData.proposal_code,
          proposalData.transaction_date,
          proposalData.service_name,
          proposalData.owner_name,
          proposalData.site_address,
          proposalData.pending_by,
          proposalData.designation,
          proposalData.application_received_date,
          proposalData.days_pending,
          proposalData.status,
          proposalData.batch_id
        ]);

        processedCount++;

      } catch (rowError) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${rowError.message}`);
        console.error(`Error processing row ${i + 1}:`, rowError);
      }
    }

    await client.query('COMMIT');

    // Clean up uploaded file (optional)
    // fs.unlinkSync(req.file.path);

    res.json({
      message: 'Excel file processed successfully',
      batchId,
      summary: {
        totalRows: dataRows.length,
        processedCount,
        errorCount,
        errors: errors.slice(0, 10) // Return first 10 errors only
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Upload error:', error);
    
    res.status(500).json({
      message: 'Failed to process Excel file',
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Get upload history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        batch_id,
        COUNT(*) as total_records,
        MIN(upload_date) as upload_date,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
      FROM proposals 
      GROUP BY batch_id, DATE(upload_date)
      ORDER BY upload_date DESC
      LIMIT 20
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Upload history error:', error);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
});

module.exports = router;