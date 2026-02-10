import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`API running on port ${env.PORT}`);
  });
};

void bootstrap();
