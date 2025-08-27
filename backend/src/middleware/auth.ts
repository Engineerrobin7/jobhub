import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config';
import { AuthenticationError } from '@/utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const requireAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtConfig.secret) as any;
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    next(new AuthenticationError('Invalid token'));
  }
};

export const requireAdmin = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AuthenticationError('Admin access required'));
  }
  next();
};

export default {
  requireAuth,
  requireAdmin,
};


