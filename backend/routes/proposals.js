const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all proposals with filtering and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    // Add filters
    if (status && status !== 'all') {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      queryParams.push(status);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (
        proposal_number ILIKE $${paramCount} OR
        owner_name ILIKE $${paramCount} OR
        service_name ILIKE $${paramCount} OR
        pending_by ILIKE $${paramCount}
      )`;
      queryParams.push(`%${search}%`);
    }

    // Valid sort columns
    const validSortColumns = [
      'created_at', 'sr_no', 'proposal_number', 'transaction_date',
      'owner_name', 'status', 'days_pending'
    ];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM proposals ${whereClause}`,
      queryParams
    );
    const totalRecords = parseInt(countResult.rows[0].count);

    // Get paginated data
    paramCount++;
    queryParams.push(limit);
    paramCount++;
    queryParams.push(offset);

    const dataResult = await pool.query(`
      SELECT 
        id, sr_no, proposal_number, proposal_code, transaction_date,
        service_name, owner_name, site_address, pending_by, designation,
        application_received_date, days_pending, status, batch_id,
        created_at, updated_at
      FROM proposals 
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramCount - 1} OFFSET $${paramCount}
    `, queryParams);

    res.json({
      data: dataResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        recordsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ message: 'Failed to fetch proposals' });
  }
});

// Get proposal by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM proposals WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get proposal error:', error);
    res.status(500).json({ message: 'Failed to fetch proposal' });
  }
});

// Update proposal status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      'UPDATE proposals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json({
      message: 'Proposal status updated successfully',
      proposal: result.rows[0]
    });

  } catch (error) {
    console.error('Update proposal status error:', error);
    res.status(500).json({ message: 'Failed to update proposal status' });
  }
});

// Delete proposal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM proposals WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Delete proposal error:', error);
    res.status(500).json({ message: 'Failed to delete proposal' });
  }
});

// Bulk status update
router.patch('/bulk/status', authenticateToken, async (req, res) => {
  try {
    const { proposalIds, status } = req.body;

    if (!Array.isArray(proposalIds) || proposalIds.length === 0) {
      return res.status(400).json({ message: 'Invalid proposal IDs' });
    }

    const validStatuses = ['pending', 'completed', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const placeholders = proposalIds.map((_, index) => `$${index + 2}`).join(',');
    
    const result = await pool.query(
      `UPDATE proposals SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id IN (${placeholders}) RETURNING id`,
      [status, ...proposalIds]
    );

    res.json({
      message: 'Proposals updated successfully',
      updatedCount: result.rows.length
    });

  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Failed to update proposals' });
  }
});

module.exports = router;