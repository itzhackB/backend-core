import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import pinoHttp from 'pino-http';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { authRoutes } from './modules/auth/presentation/auth.routes.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFoundHandler } from './shared/middlewares/not-found.js';

const app = express();

app.disable('x-powered-by');
app.use(pinoHttp({ logger }));
app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/health', (_request, response) => {
  response.json({
    data: {
      status: 'ok',
    },
  });
});

app.use('/api/v1/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
