import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '../../../config/env.js';
import { AppError } from '../../../shared/errors/app-error.js';
import type { AuthenticatedRequest } from '../../../shared/types/express.js';
import type { AuthService } from '../application/auth.service.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  register = async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body as { email: string; password: string };

    const result = await this.authService.register(email, password);
    this.setRefreshCookie(response, result.tokens.refreshToken);

    response.status(StatusCodes.CREATED).json({
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  };

  login = async (request: Request, response: Response): Promise<void> => {
    const { email, password } = request.body as { email: string; password: string };

    const result = await this.authService.login(email, password);
    this.setRefreshCookie(response, result.tokens.refreshToken);

    response.status(StatusCodes.OK).json({
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  };

  refresh = async (request: Request, response: Response): Promise<void> => {
    const refreshToken = request.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new AppError('Missing refresh token cookie.', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    const payload = this.authService.parseRefreshToken(refreshToken);
    const tokens = await this.authService.refresh(payload.userId, refreshToken);

    this.setRefreshCookie(response, tokens.refreshToken);

    response.status(StatusCodes.OK).json({
      data: {
        accessToken: tokens.accessToken,
      },
    });
  };

  logout = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
    if (!request.auth) {
      throw new AppError('Unauthorized.', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    await this.authService.logout(request.auth.userId);
    response.clearCookie('refreshToken', {
      path: '/api/v1/auth/refresh',
      httpOnly: true,
      sameSite: 'strict',
      secure: env.NODE_ENV === 'production',
    });

    response.status(StatusCodes.NO_CONTENT).send();
  };
}
