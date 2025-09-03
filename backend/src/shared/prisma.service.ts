
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() { await this.$connect(); }
  async enableShutdownHooks(app: INestApplication) {
    (this as unknown as { $on: (e: 'beforeExit', cb: (args?: any) => any) => void })
    .$on('beforeExit', async () => { await app.close(); });
  }
}
