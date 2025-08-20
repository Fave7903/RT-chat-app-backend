import { Router } from 'express';
import {
  login,
  register,
  LoginValidator,
  RegisterValidator,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/apiRateLimit';

const router = Router();
router.post('/register', authLimiter, validate(RegisterValidator), register);
router.post('/login', authLimiter, validate(LoginValidator), login);
export default router;
