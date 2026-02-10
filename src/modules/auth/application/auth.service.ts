import { StatusCodes } from 'http-status-codes';

import { AppError } from '../../../shared/errors/app-error.js';
import type { UserRepository } from '../domain/user-repository.js';
import type { PublicUser, User } from '../domain/user.js';
import { PasswordService } from './password.service.js';
import { TokenService, type TokenPair } from './token.service.js';

type AuthResult = {
  user: PublicUser;
  tokens: TokenPair;
};

const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService = new PasswordService(),
    private readonly tokenService = new TokenService(),
  ) {}

  async register(email: string, password: string): Promise<AuthResult> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new AppError('Email already in use.', StatusCodes.CONFLICT, 'EMAIL_TAKEN');
    }

    const passwordHash = await this.passwordService.hash(password);
    const user = await this.userRepository.create({ email, passwordHash });

    return this.login(user.email, password);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await this.passwordService.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    const tokens = this.tokenService.generateTokenPair({
      userId: user.id,
      role: user.role,
    });

    const refreshTokenHash = await this.passwordService.hash(tokens.refreshToken);
    await this.userRepository.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: toPublicUser(user),
      tokens,
    };
  }

  async refresh(userId: string, refreshToken: string): Promise<TokenPair> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new AppError('Invalid session.', StatusCodes.UNAUTHORIZED, 'INVALID_SESSION');
    }

    const isRefreshTokenValid = await this.passwordService.compare(refreshToken, user.refreshTokenHash);

    if (!isRefreshTokenValid) {
      throw new AppError('Invalid session.', StatusCodes.UNAUTHORIZED, 'INVALID_SESSION');
    }

    const newTokens = this.tokenService.generateTokenPair({
      userId: user.id,
      role: user.role,
    });

    const newRefreshTokenHash = await this.passwordService.hash(newTokens.refreshToken);
    await this.userRepository.updateRefreshTokenHash(user.id, newRefreshTokenHash);

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshTokenHash(userId, null);
  }

  parseAccessToken(token: string) {
    return this.tokenService.verifyAccessToken(token);
  }

  parseRefreshToken(token: string) {
    return this.tokenService.verifyRefreshToken(token);
  }
}
