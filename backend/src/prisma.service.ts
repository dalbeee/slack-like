import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async clearDatabase() {
    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`
      .then((r) => r.filter((r) => r.tablename !== '_prisma_migrations'))
      .then((r) => r.map((r) => r.tablename));

    // method1
    for (const tablename of tablenames) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }
    return;

    // method2
    // return await Promise.all(
    //   tablenames.map((tablename) =>
    //     this.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`),
    //   ),
    // );
  }
}
