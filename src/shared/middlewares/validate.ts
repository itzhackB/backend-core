import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ZodTypeAny } from 'zod';

export const validate = (schema: ZodTypeAny) => {
  return (request: Request, response: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request payload.',
          details: result.error.flatten(),
        },
      });
      return;
    }

    request.body = result.data.body;
    request.params = result.data.params;
    request.query = result.data.query;

    next();
  };
};
