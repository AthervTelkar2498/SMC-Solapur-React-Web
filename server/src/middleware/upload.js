import multer from 'multer';

const maxUploadMb = Number(process.env.MAX_UPLOAD_MB || '10');

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: maxUploadMb * 1024 * 1024 },
});
