import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '../../config/logger.js';
import { AppError } from '../errors/app-error.js';

export const errorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  logger.error({ error }, 'Unhandled server error');

  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong.',
    },
  });
};
