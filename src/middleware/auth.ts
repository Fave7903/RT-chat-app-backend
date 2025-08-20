import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token.service';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; username: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing token' });
  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token) as any;
    req.user = {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
