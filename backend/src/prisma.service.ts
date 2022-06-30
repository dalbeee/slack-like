import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async clearDatabase() {
    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) =>
        this.$executeRawUnsafe(
          `TRUNCATE TABLE "${modelKey
            .toString()
            .charAt(0)
            .toUpperCase()}${modelKey
            .toString()
            .slice(1)}" RESTART IDENTITY CASCADE;`,
        ),
      ),
    );
  }
}
