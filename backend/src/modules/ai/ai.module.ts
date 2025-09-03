import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { PrismaService } from '../../shared/prisma.service';

@Module({
  controllers: [AiController],
  providers: [PrismaService],
})
export class AiModule {}
