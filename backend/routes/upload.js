const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'excel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// @route   POST /api/upload/excel
// @desc    Upload Excel file and parse data
// @access  Protected
router.post('/excel', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    
    // Process all sheets (Municipal Commissioner and Deputy Director)
    const allData = [];
    
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
      
      // Add sheet name as designation context
      jsonData.forEach(row => {
        row.sheet_name = sheetName;
      });
      
      allData.push(...jsonData);
    });

    if (allData.length === 0) {
      fs.unlinkSync(filePath); // Delete uploaded file
      return res.status(400).json({ error: 'No data found in Excel file' });
    }

    // Generate batch ID for this upload
    const batchId = `BATCH-${Date.now()}`;

    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert upload batch record
      await client.query(
        'INSERT INTO upload_batches (batch_id, filename, total_records) VALUES ($1, $2, $3)',
        [batchId, req.file.originalname, allData.length]
      );

      // Parse and insert each row
      let insertedCount = 0;
      
      for (const row of allData) {
        // Map Excel columns to database fields
        const proposalNumber = row['Proposal Number'] || row['Proposal  Number'] || '';
        const proposalCode = row['Proposal Code'] || row['Proposal  Code'] || '';
        const transactionDate = parseDate(row['Transaction Date'] || row['Transactio n Date']);
        const serviceName = row['Service Name'] || '';
        const ownerName = row['Owner Name'] || '';
        const siteAddress = row['Site Address'] || '';
        const pendingBy = row['Pending By'] || row['Pending  By'] || '';
        const designation = row['Designation'] || row['Designati on'] || '';
        const applicationReceivedDate = parseDate(row['Application Received Date']);
        const daysPending = parseInt(row['Days']) || 0;

        // Determine status based on days pending
        let status = 'Pending';
        if (daysPending === 0 || row['Status'] === 'Completed') {
          status = 'Completed';
        } else if (daysPending > 30) {
          status = 'Overdue';
        } else if (daysPending > 0) {
          status = 'Pending';
        }

        await client.query(
          `INSERT INTO proposals 
          (sr_no, proposal_number, proposal_code, transaction_date, service_name, 
           owner_name, site_address, pending_by, designation, application_received_date, 
           days_pending, status, upload_batch_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            insertedCount + 1,
            proposalNumber,
            proposalCode,
            transactionDate,
            serviceName,
            ownerName,
            siteAddress,
            pendingBy,
            designation,
            applicationReceivedDate,
            daysPending,
            status,
            batchId
          ]
        );

        insertedCount++;
      }

      await client.query('COMMIT');

      // Delete uploaded file after processing
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        message: 'Excel file uploaded and processed successfully',
        batchId,
        recordsProcessed: insertedCount
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('Upload error:', err.message);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Error processing Excel file', 
      message: err.message 
    });
  }
});

// Helper function to parse dates
function parseDate(dateString) {
  if (!dateString) return null;
  
  try {
    // Handle DD-MM-YYYY format
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        // Check if it's DD-MM-YYYY or YYYY-MM-DD
        if (parts[0].length === 4) {
          // YYYY-MM-DD
          return dateString;
        } else {
          // DD-MM-YYYY
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
    }
    
    return dateString;
  } catch (err) {
    console.error('Date parse error:', err);
    return null;
  }
}

module.exports = router;
