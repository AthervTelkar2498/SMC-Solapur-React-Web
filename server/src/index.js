import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { router as apiRouter } from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(helmet());
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Avoid leaking stack traces in production
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', err);
  }
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${port}`);
});
