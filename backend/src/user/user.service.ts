import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: UserCreateDto) {
    const existEmail = await this.findUserByEmail(data.email);
    if (existEmail) throw new ConflictException('unavailable this email');
    const existName = await this.findUserByName(data.name);
    if (existName) throw new ConflictException('unavailable this name');

    return await this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: string, data: UserUpdateDto) {
    if (data.name) {
      const existName = await this.findUserByName(data.name);
      if (existName)
        throw new ConflictException(`${existName.name} is unavailable`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findWorkspacesByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { workspaces: true },
    });
  }

  async findSubscribedChannelsByWorkspaceIdAndUserId(
    userId: string,
    workspaceId: string,
  ) {
    return (
      await this.prisma.user.findUnique({
        where: { id: userId },
        include: { channels: { where: { workspaceId } } },
      })
    ).channels;
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  findUserByName(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }
}
