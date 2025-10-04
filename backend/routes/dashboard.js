const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Protected
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Get total proposals
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM proposals');
    const totalProposals = parseInt(totalResult.rows[0].count);

    // Get completed work
    const completedResult = await pool.query(
      "SELECT COUNT(*) as count FROM proposals WHERE status = 'Completed'"
    );
    const completedWork = parseInt(completedResult.rows[0].count);

    // Get pending work
    const pendingResult = await pool.query(
      "SELECT COUNT(*) as count FROM proposals WHERE status IN ('Pending', 'Overdue')"
    );
    const pendingWork = parseInt(pendingResult.rows[0].count);

    // Get average days
    const avgDaysResult = await pool.query(
      'SELECT AVG(days_pending) as avg FROM proposals WHERE days_pending > 0'
    );
    const avgDays = Math.round(parseFloat(avgDaysResult.rows[0].avg) || 0);

    // Get status breakdown
    const statusResult = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM proposals 
       GROUP BY status`
    );

    // Get tasks over time (by month)
    const tasksOverTimeResult = await pool.query(
      `SELECT 
        TO_CHAR(application_received_date, 'Mon') as month,
        status,
        COUNT(*) as count
       FROM proposals 
       WHERE application_received_date IS NOT NULL
       GROUP BY TO_CHAR(application_received_date, 'Mon'), TO_CHAR(application_received_date, 'MM'), status
       ORDER BY TO_CHAR(application_received_date, 'MM')`
    );

    // Get pending by person
    const pendingByPersonResult = await pool.query(
      `SELECT pending_by, COUNT(*) as count, AVG(days_pending) as avg_days
       FROM proposals 
       WHERE status IN ('Pending', 'Overdue') AND pending_by IS NOT NULL AND pending_by != ''
       GROUP BY pending_by
       ORDER BY count DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        totalProposals,
        completedWork,
        pendingWork,
        avgDays,
        statusBreakdown: statusResult.rows,
        tasksOverTime: tasksOverTimeResult.rows,
        pendingByPerson: pendingByPersonResult.rows
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/dashboard/recent
// @desc    Get recent proposals
// @access  Protected
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    const result = await pool.query(
      'SELECT * FROM proposals ORDER BY id DESC LIMIT $1',
      [limit]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
