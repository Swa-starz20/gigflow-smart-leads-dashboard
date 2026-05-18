import type { Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendSuccess(res, 201, MESSAGES.AUTH.REGISTER_SUCCESS, result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendSuccess(res, 200, MESSAGES.AUTH.LOGIN_SUCCESS, result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, 200, 'Profile fetched successfully', { user });
});
