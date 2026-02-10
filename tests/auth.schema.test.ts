import { describe, expect, it } from 'vitest';

import { registerSchema } from '../src/modules/auth/presentation/auth.schema.js';

describe('registerSchema', () => {
  it('accepts a strong password', () => {
    const input = {
      body: {
        email: 'Test@Email.com',
        password: 'StrongPass#123',
      },
      params: {},
      query: {},
    };

    const result = registerSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it('rejects weak password', () => {
    const input = {
      body: {
        email: 'test@email.com',
        password: 'weak',
      },
      params: {},
      query: {},
    };

    const result = registerSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});
