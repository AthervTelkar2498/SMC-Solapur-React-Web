const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/proposals
// @desc    Get all proposals with filters
// @access  Protected
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, pending_by, search, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM proposals WHERE 1=1';
    const params = [];
    let paramCounter = 1;

    if (status) {
      query += ` AND status = $${paramCounter}`;
      params.push(status);
      paramCounter++;
    }

    if (pending_by) {
      query += ` AND pending_by ILIKE $${paramCounter}`;
      params.push(`%${pending_by}%`);
      paramCounter++;
    }

    if (search) {
      query += ` AND (proposal_number ILIKE $${paramCounter} OR owner_name ILIKE $${paramCounter} OR site_address ILIKE $${paramCounter})`;
      params.push(`%${search}%`);
      paramCounter++;
    }

    query += ' ORDER BY id DESC';
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM proposals WHERE 1=1';
    const countParams = [];
    let countParamCounter = 1;

    if (status) {
      countQuery += ` AND status = $${countParamCounter}`;
      countParams.push(status);
      countParamCounter++;
    }

    if (pending_by) {
      countQuery += ` AND pending_by ILIKE $${countParamCounter}`;
      countParams.push(`%${pending_by}%`);
      countParamCounter++;
    }

    if (search) {
      countQuery += ` AND (proposal_number ILIKE $${countParamCounter} OR owner_name ILIKE $${countParamCounter} OR site_address ILIKE $${countParamCounter})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/proposals/:id
// @desc    Get single proposal
// @access  Protected
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proposals WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/proposals/:id
// @desc    Update proposal status
// @access  Protected
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await pool.query(
      'UPDATE proposals SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    res.json({
      success: true,
      message: 'Proposal updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
