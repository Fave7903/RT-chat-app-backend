import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { signToken } from '../services/token.service';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string().min(6),
  }),
});
const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});
export const RegisterValidator = registerSchema;
export const LoginValidator = loginSchema;

export const register = async (req: Request, res: Response) => {
  const {
    body: { email, username, password },
  } = registerSchema.parse({ body: req.body });

  const exists = await User.findOne({
    where: { email },
  });
  if (exists) {
    return res.status(409).json({ message: 'Email already used' });
  }

  const userNameExists = await User.findOne({ where: { username } });
  if (userNameExists) {
    return res.status(409).json({ message: 'Username already used' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash });
  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const {
    body: { email, password },
  } = loginSchema.parse({ body: req.body });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
};
