import type { CreateUserInput, UserRepository } from '../domain/user-repository.js';
import type { User } from '../domain/user.js';
import { UserModel } from './user.model.js';

const mapUser = (dbUser: Awaited<ReturnType<typeof UserModel.findById>>): User | null => {
  if (!dbUser) {
    return null;
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    passwordHash: dbUser.passwordHash,
    role: dbUser.role,
    refreshTokenHash: dbUser.refreshTokenHash,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
};

export class MongoUserRepository implements UserRepository {
  async create(input: CreateUserInput): Promise<User> {
    const user = await UserModel.create(input);
    return mapUser(user)!;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).exec();
    return mapUser(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).exec();
    return mapUser(user);
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshTokenHash }).exec();
  }
}
