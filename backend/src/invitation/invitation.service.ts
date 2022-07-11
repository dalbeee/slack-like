import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '@src/prisma.service';
import { InvitationCreateProps } from './types';
import { UserService } from '@src/user/user.service';
import { WorkspaceService } from '@src/workspace/workspace.service';
import { UserJwtPayload } from '@src/auth/types';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  _findInvitationsByActivationCode(activateCode: string) {
    return this.prisma.invitation.findFirst({
      where: { activateCode },
    });
  }

  _isInviteeAlreadyJoinedUser(email: string) {
    return this.userService.findUserByEmail(email);
  }

  async createInvitations(
    { id }: UserJwtPayload,
    { inviteeEmail, workspaceId }: InvitationCreateProps,
  ) {
    const expiredDate = dayjs(Date.now()).add(7, 'days').toDate();
    const activateCode = encodeURIComponent(dayjs().unix() + '__' + uuid());
    return this.prisma.invitation.create({
      data: {
        expiredDate,
        activateCode,
        inviterUserId: id,
        inviteeEmail,
        workspaceId,
      },
    });
  }

  async isValidExpiredDate(activateCode: string) {
    const invitations = await this._findInvitationsByActivationCode(
      activateCode,
    );
    return invitations.expiredDate > new Date(Date.now()) ? true : false;
  }

  async hasWorkspaceJoinedUser(activateCode: string) {
    const invitations = await this._findInvitationsByActivationCode(
      activateCode,
    );
    const user = await this.userService.findUserByEmail(
      invitations.inviteeEmail,
    );
    if (!user) return false;

    return await this.workspaceService._hasWorkspaceJoinedUser({
      userId: user.id,
      workspaceId: invitations.workspaceId,
    });
  }

  async activateInvitations(
    { id }: UserJwtPayload,
    {
      activateCode,
    }: {
      activateCode: string;
    },
  ) {
    const invitations = await this._findInvitationsByActivationCode(
      activateCode,
    );
    if (!invitations) throw new BadRequestException();

    const isValidateExpiredDate = await this.isValidExpiredDate(activateCode);
    if (!isValidateExpiredDate)
      throw new BadRequestException('expired invitations');

    const result = await this.workspaceService.joinMember({
      userId: id,
      workspaceId: invitations.workspaceId,
    });
    return result;
  }
}
