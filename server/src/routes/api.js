import express from 'express';
import { uploadExcelHandler } from '../controllers/uploadController.js';
import { listApplicationsHandler, statsHandler } from '../controllers/applicationsController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const router = express.Router();

router.get('/', (_req, res) => res.json({ ok: true }));

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  // Simple demo auth for now; replace with DB-backed admins
  if (username === 'admin' && password === 'admin') {
    return res.json({ token: 'demo-token' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

router.post('/upload', authMiddleware, upload.single('file'), uploadExcelHandler);
router.get('/applications', authMiddleware, listApplicationsHandler);
router.get('/stats', authMiddleware, statsHandler);
