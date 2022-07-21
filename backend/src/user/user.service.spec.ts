import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { PrismaService } from '@src/prisma.service';
import { UserCreateDto } from '@src/user/dto/user-create.dto';
import { UserService } from '@src/user/user.service';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserModule } from './user.module';

let userService: UserService;
let prisma: PrismaService;
let app: TestingModule;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [UserModule],
  }).compile();
  app = await moduleRef.init();
  userService = moduleRef.get(UserService);
  prisma = moduleRef.get(PrismaService);
});
afterEach(async () => {
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

const createUser = async () => {
  const dto: UserCreateDto = {
    email: faker.internet.email(),
    name: faker.datatype.string(20),
    password: faker.datatype.string(20),
  };
  return await prisma.user.create({
    data: dto,
  });
};

describe('createUser', () => {
  it('return user if success', async () => {
    const userDto: UserCreateDto = {
      email: faker.internet.email(),
      name: faker.datatype.string(20),
      password: faker.datatype.string(20),
    };

    const result = await userService.createUser(userDto);

    expect(result).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        name: expect.any(String),
      }),
    );
  });
  const userCreateErrorTable = [
    {
      type: 'email',
      dto1: {
        email: 'test@email.com',
        name: faker.datatype.string(20),
        password: faker.datatype.string(20),
      },
      dto2: {
        email: 'test@email.com',
        name: faker.datatype.string(20),
        password: faker.datatype.string(20),
      },
      expectedMessage: 'unavailable this email',
    },
    {
      type: 'name',
      dto1: {
        email: faker.internet.email(),
        name: 'uniquename',
        password: faker.datatype.string(20),
      },
      dto2: {
        email: faker.internet.email(),
        name: 'uniquename',
        password: faker.datatype.string(20),
      },
      expectedMessage: 'unavailable this name',
    },
  ];
  it.each(userCreateErrorTable)(
    'throw error if already exist $type',
    async ({ dto1, dto2, expectedMessage }) => {
      await userService.createUser(dto1);

      const result = () => userService.createUser(dto2);

      await expect(result).rejects.toThrowError(expectedMessage);
    },
  );
});

describe('userUpdate', () => {
  const userUpdateTable = [
    { key: 'name', value: 'name' },
    { key: 'password', value: 'password' },
    { key: 'status', value: 'status' },
    { key: 'pictureSrc', value: 'pictureSrc' },
  ];
  it.each(userUpdateTable)(
    'return user if successfully update $key',
    async ({ key, value }) => {
      const dto: UserUpdateDto = {
        [key]: value,
      };
      const user = await createUser();

      const result = await userService.updateUser(user.id, dto);

      expect(result[key]).toBeDefined();
    },
  );

  it('throw error if already exist name', async () => {
    const user = await createUser();
    const dto: UserUpdateDto = {
      name: user.name,
    };

    const result = () => userService.updateUser(user.id, dto);

    await expect(result).rejects.toThrowError();
  });
});
