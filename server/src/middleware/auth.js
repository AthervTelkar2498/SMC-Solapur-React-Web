export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // For MVP we accept demo token; replace with JWT verification later
  if (token !== 'demo-token') return res.status(401).json({ error: 'Unauthorized' });
  next();
}
