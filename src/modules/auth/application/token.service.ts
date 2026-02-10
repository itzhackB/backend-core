import jwt from 'jsonwebtoken';

import { env } from '../../../config/env.js';
import type { AuthenticatedUser } from '../../../shared/types/express.js';

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export class TokenService {
  generateTokenPair(payload: AuthenticatedUser): TokenPair {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      subject: payload.userId,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      subject: payload.userId,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthenticatedUser;
  }

  verifyRefreshToken(token: string): AuthenticatedUser {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthenticatedUser;
  }
}
