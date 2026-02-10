import type { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error.js';
import type { AuthenticatedRequest } from '../../../shared/types/express.js';
import type { AuthService } from '../application/auth.service.js';
import type { UserRole } from '../domain/user.js';

export const authenticate = (authService: AuthService) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new AppError('Unauthorized.', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED'));
      return;
    }

    const token = authorization.replace('Bearer ', '');

    try {
      request.auth = authService.parseAccessToken(token);
      next();
    } catch {
      next(new AppError('Unauthorized.', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED'));
    }
  };
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction): void => {
    if (!request.auth) {
      next(new AppError('Unauthorized.', StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED'));
      return;
    }

    if (!allowedRoles.includes(request.auth.role)) {
      next(new AppError('Forbidden.', StatusCodes.FORBIDDEN, 'FORBIDDEN'));
      return;
    }

    next();
  };
};
