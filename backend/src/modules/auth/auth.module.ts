import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  controllers: [AuthController],           
  providers: [
    AuthService,                          
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard }, // JWT 
    { provide: APP_GUARD, useClass: RolesGuard },   // RBAC 
  ],
  exports: [AuthService],
})
export class AuthModule {}
