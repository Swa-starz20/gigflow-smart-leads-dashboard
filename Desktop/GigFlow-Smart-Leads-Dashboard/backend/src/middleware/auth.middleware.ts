import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { MESSAGES } from '../constants/messages';
import type { UserRole } from '../constants/enums';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(new ApiError(401, MESSAGES.AUTH.UNAUTHORIZED));
    return;
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, MESSAGES.AUTH.UNAUTHORIZED));
  }
};

export const authorizeRoles =
  (...roles: UserRole[]): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, MESSAGES.AUTH.UNAUTHORIZED));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, MESSAGES.AUTH.FORBIDDEN));
      return;
    }
    next();
  };
