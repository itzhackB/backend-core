import { Router } from 'express';

import type { AuthenticatedRequest } from '../../../shared/types/express.js';

import { asyncHandler } from '../../../shared/utils/async-handler.js';
import { validate } from '../../../shared/middlewares/validate.js';
import { AuthService } from '../application/auth.service.js';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository.js';
import { AuthController } from './auth.controller.js';
import { authenticate, authorize } from './auth.middleware.js';
import { loginSchema, registerSchema } from './auth.schema.js';

const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), asyncHandler(authController.register));
authRoutes.post('/login', validate(loginSchema), asyncHandler(authController.login));
authRoutes.post('/refresh', asyncHandler(authController.refresh));
authRoutes.post('/logout', authenticate(authService), asyncHandler(authController.logout));

authRoutes.get(
  '/me',
  authenticate(authService),
  asyncHandler(async (request, response) => {
    response.json({
      data: {
        user: (request as AuthenticatedRequest).auth,
      },
    });
  }),
);

authRoutes.get(
  '/admin',
  authenticate(authService),
  authorize('admin'),
  asyncHandler(async (_request, response) => {
    response.json({
      data: {
        message: 'Admin-only resource.',
      },
    });
  }),
);
