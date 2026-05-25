import Router from '@koa/router';
import { ContactController } from '../controllers/contact.controller.js';
import { requireAdmin } from '../middleware/require-admin.js';

const router = new Router();

router.post('/api/contact', ContactController.submit);
router.get('/api/admin/contact-submissions', requireAdmin, ContactController.listAdmin);

export default router;
