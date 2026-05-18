import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { AuthUserPayload } from '../types/express';

interface JwtPayload {
  sub: string;
  email: string;
  role: AuthUserPayload['role'];
  name: string;
}

export const signToken = (user: AuthUserPayload): string => {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): AuthUserPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  return {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
    name: decoded.name,
  };
};
