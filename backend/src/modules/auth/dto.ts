import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  // Email format validation
  @IsEmail()
  email!: string;

  // Minimum length for a stronger password
  @MinLength(6)
  password!: string;

  // Optional role; by default backend will set USER
  @IsOptional()
  @IsIn(['USER', 'ADVERTISER', 'ADMIN'])
  role?: 'USER' | 'ADVERTISER' | 'ADMIN';
}

export class LoginDto {
  // Email required
  @IsEmail()
  email!: string;

  // Password required
  @IsNotEmpty()
  password!: string;
}
