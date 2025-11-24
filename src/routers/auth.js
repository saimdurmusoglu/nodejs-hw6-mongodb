import { Router } from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPwd } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, sendResetEmailSchema, resetPasswordSchema } from '../validation/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/refresh', refresh);

router.post('/logout', logout);

router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmail
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPwd
);

export default router;