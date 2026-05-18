import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { MESSAGES } from '../constants/messages';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import type { AuthUserPayload } from '../types/express';
import type { UserRole } from '../constants/enums';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: AuthUserPayload;
  token: string;
}

const toAuthUser = (user: { _id: { toString: () => string }; email: string; role: UserRole; name: string }): AuthUserPayload => ({
  id: user._id.toString(),
  email: user.email,
  role: user.role,
  name: user.name,
});

export const authService = {
  register: async (input: RegisterInput): Promise<AuthResult> => {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(409, MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const user = await userRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      role: 'sales',
    });

    const authUser = toAuthUser(user);
    return { user: authUser, token: signToken(authUser) };
  },

  login: async (input: LoginInput): Promise<AuthResult> => {
    const user = await userRepository.findByEmail(input.email, true);
    if (!user) {
      throw new ApiError(401, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new ApiError(401, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const authUser = toAuthUser(user);
    return { user: authUser, token: signToken(authUser) };
  },

  getMe: async (userId: string): Promise<AuthUserPayload> => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, MESSAGES.AUTH.USER_NOT_FOUND);
    }
    return toAuthUser(user);
  },
};
