import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import * as bcrypt from 'bcryptjs';


type Role = 'USER' | 'ADVERTISER' | 'ADMIN';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, password: string, role: Role = 'USER') {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new ConflictException('Email already used');
    }

    const hash = await bcrypt.hash(password, 12);

    return this.prisma.user.create({
      data: {
        email,
        password: hash,
        role, // <- 'USER' | 'ADVERTISER' | 'ADMIN'
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    return ok ? user : null;
  }
}
