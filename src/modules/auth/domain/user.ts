export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicUser = Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>;
