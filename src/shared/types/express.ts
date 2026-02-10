import type { Request } from 'express';

export type AuthenticatedUser = {
  userId: string;
  role: 'admin' | 'user';
};

export type AuthenticatedRequest = Request & {
  auth?: AuthenticatedUser;
};
