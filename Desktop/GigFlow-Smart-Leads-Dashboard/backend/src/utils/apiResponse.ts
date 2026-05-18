import type { Response } from 'express';
import type { ApiSuccessResponse, PaginationMeta } from '../types/api.types';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: PaginationMeta
): void => {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta && { meta }),
  };
  res.status(statusCode).json(body);
};
