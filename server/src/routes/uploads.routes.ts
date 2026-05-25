import Router from '@koa/router';
import { UploadsController } from '../controllers/uploads.controller.js';
import { requireAdmin } from '../middleware/require-admin.js';
import { uploadImage } from '../middleware/upload.js';

const router = new Router();

router.post(
  '/api/admin/uploads',
  requireAdmin,
  uploadImage.single('file'),
  UploadsController.uploadImage
);

export default router;
