import Router from '@koa/router';
import { PostsController } from '../controllers/posts.controller.js';
import { requireAdmin } from '../middleware/require-admin.js';

const router = new Router();

router.get('/api/posts', PostsController.listPublic);
router.get('/api/posts/:slug', PostsController.getPublicBySlug);

router.get('/api/admin/posts', requireAdmin, PostsController.listAdmin);
router.get('/api/admin/posts/:slug', requireAdmin, PostsController.getAdminBySlug);
router.post('/api/admin/posts', requireAdmin, PostsController.create);
router.put('/api/admin/posts/:slug', requireAdmin, PostsController.update);
router.delete('/api/admin/posts/:slug', requireAdmin, PostsController.remove);

export default router;
