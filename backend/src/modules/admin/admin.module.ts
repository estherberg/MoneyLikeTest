import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../shared/prisma.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService],
})
export class AdminModule {}
