import Router from '@koa/router';
import multer from '@koa/multer';
import { requireAdmin } from '../middleware/require-admin.js';
import * as cloudinaryLib from '../lib/cloudinary.js';

const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      const err = new Error('Unsupported file type') as Error & { status?: number };
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

const router = new Router();

router.post('/api/admin/uploads', requireAdmin, upload.single('file'), async (ctx) => {
  const file = (ctx.request as unknown as { file?: { buffer: Buffer } }).file;
  if (!file) {
    ctx.status = 400;
    ctx.body = { message: 'No file provided' };
    return;
  }
  const result = await cloudinaryLib.uploadBuffer(file.buffer);
  ctx.body = result;
});

export default router;