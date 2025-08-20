import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  '7d') as jwt.SignOptions['expiresIn'];

export interface JwtUser {
  id: string;
  email: string;
  username: string;
}

export function signToken(user: JwtUser): string {
  const payload = { ...user }; // ensure it's a plain object
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
