import Router from '@koa/router';
import { AuthController } from '../controllers/auth.controller.js';

const router = new Router({ prefix: '/api/auth' });

router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
