import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/messages';
import type { ApiErrorResponse } from '../types/api.types';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message: string = MESSAGES.SERVER_ERROR;
  let errors: ApiErrorResponse['errors'];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = MESSAGES.VALIDATION;
    errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = MESSAGES.VALIDATION;
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if ((err as { code?: number }).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err);
  }

  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(body);
};
