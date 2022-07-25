import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@src/prisma.service';
import { AuthService } from '@src/auth/auth.service';
import { UserService } from '@src/user/user.service';
import { createUser } from '@src/user/__test__/createUser';
import { User } from '@prisma/client';

const prismaService = new PrismaService();
const userService = new UserService(prismaService);
const authService = new AuthService(
  userService,
  new JwtService({ secretOrPrivateKey: 'secretKey' }),
);

export const createAccessToken = async (user?: User) => {
  const result = await authService.login(user || (await createUser()));
  return result.access_token;
};
