import bcrypt from 'bcrypt';

import { env } from '../../../config/env.js';

export class PasswordService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
