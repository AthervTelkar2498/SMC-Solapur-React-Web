const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get overall statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_proposals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_work,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_work,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_work,
        ROUND(AVG(days_pending)) as average_days
      FROM proposals
    `);

    const stats = statsResult.rows[0];

    // Get status distribution for pie chart
    const statusDistribution = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM proposals)), 2) as percentage
      FROM proposals
      GROUP BY status
    `);

    // Get monthly trends for line chart
    const monthlyTrends = await pool.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as total_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
      FROM proposals
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `);

    // Get recent uploads
    const recentUploads = await pool.query(`
      SELECT 
        batch_id,
        COUNT(*) as record_count,
        MIN(upload_date) as upload_date,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
      FROM proposals 
      GROUP BY batch_id
      ORDER BY MIN(upload_date) DESC
      LIMIT 5
    `);

    // Get top pending authorities
    const topPendingAuthorities = await pool.query(`
      SELECT 
        pending_by,
        designation,
        COUNT(*) as pending_count,
        ROUND(AVG(days_pending)) as avg_days_pending
      FROM proposals 
      WHERE status IN ('pending', 'overdue') AND pending_by IS NOT NULL
      GROUP BY pending_by, designation
      ORDER BY pending_count DESC
      LIMIT 10
    `);

    res.json({
      summary: {
        totalProposals: parseInt(stats.total_proposals),
        completedWork: parseInt(stats.completed_work),
        pendingWork: parseInt(stats.pending_work),
        overdueWork: parseInt(stats.overdue_work),
        averageDays: parseInt(stats.average_days) || 0
      },
      statusDistribution: statusDistribution.rows,
      monthlyTrends: monthlyTrends.rows,
      recentUploads: recentUploads.rows,
      topPendingAuthorities: topPendingAuthorities.rows
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get performance metrics
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    // Performance over time
    const performanceData = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_created,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        ROUND(AVG(days_pending)) as avg_processing_days
      FROM proposals 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    // Department-wise performance
    const departmentPerformance = await pool.query(`
      SELECT 
        designation as department,
        COUNT(*) as total_cases,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_cases,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_cases,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_cases,
        ROUND(AVG(days_pending)) as avg_processing_days,
        ROUND((COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)), 2) as completion_rate
      FROM proposals 
      WHERE designation IS NOT NULL
        AND created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY designation
      ORDER BY total_cases DESC
    `);

    res.json({
      performanceData: performanceData.rows,
      departmentPerformance: departmentPerformance.rows
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ message: 'Failed to fetch performance metrics' });
  }
});

// Get alerts and notifications
router.get('/alerts', authenticateToken, async (req, res) => {
  try {
    // Overdue items
    const overdueItems = await pool.query(`
      SELECT COUNT(*) as count FROM proposals WHERE status = 'overdue'
    `);

    // Items approaching deadline (> 50 days)
    const approachingDeadline = await pool.query(`
      SELECT COUNT(*) as count FROM proposals 
      WHERE status = 'pending' AND days_pending > 50
    `);

    // Recent uploads needing attention
    const recentUploadsNeedingAttention = await pool.query(`
      SELECT 
        batch_id,
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
        MIN(upload_date) as upload_date
      FROM proposals 
      WHERE upload_date >= NOW() - INTERVAL '7 days'
      GROUP BY batch_id
      HAVING COUNT(CASE WHEN status = 'overdue' THEN 1 END) > 0
      ORDER BY upload_date DESC
    `);

    res.json({
      overdueCount: parseInt(overdueItems.rows[0].count),
      approachingDeadlineCount: parseInt(approachingDeadline.rows[0].count),
      recentUploadsNeedingAttention: recentUploadsNeedingAttention.rows
    });

  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

module.exports = router;