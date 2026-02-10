import mongoose, { Schema } from 'mongoose';

import type { UserRole } from '../domain/user.js';

type UserDocument = {
  email: string;
  passwordHash: string;
  role: UserRole;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
    refreshTokenHash: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
