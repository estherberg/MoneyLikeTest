// Purpose: Create user on register, verify password on login, sign JWT

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // Register new user : return access token
  async register(email: string, password: string, role?: 'USER' | 'ADVERTISER' | 'ADMIN') {
    const user = await this.users.create(email, password, role ?? 'USER');
    return this.sign(user.id, user.email, user.role);
  }

  // Login by email/password : return access token
  async login(email: string, password: string) {
    const user = await this.users.validateCredentials(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.sign(user.id, user.email, user.role);
  }

  // Issue a short payload JWT
  private sign(sub: string, email: string, role: string) {
    const payload = { sub, email, role };
    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
    return { accessToken, user: { id: sub, email, role } }; 
  }
}
