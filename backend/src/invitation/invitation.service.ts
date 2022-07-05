import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';

import { PrismaService } from '@src/prisma.service';
import { InvitationCreateProps, ValidateInvivationProps } from './types';

@Injectable()
export class InvitationService {
  constructor(private readonly prisma: PrismaService) {}

  _findInvitationsByActivationLink(link: string) {
    return this.prisma.invitation.findFirst({
      where: { activationLink: link },
    });
  }
  _validateInvatations({
    inviteeUserId,
    invitations,
  }: ValidateInvivationProps) {}

  async createInvitations({
    inviteeUserId,
    inviterUserId,
    workspaceId,
  }: InvitationCreateProps) {
    const expiredDate = dayjs(Date.now()).add(7, 'days').toDate();

    const activationLink = encodeURIComponent(dayjs().unix() + '__' + uuid());

    return this.prisma.invitation.create({
      data: {
        expiredDate,
        activationLink,
        inviterUserId,
        inviteeUserId,
        workspaceId,
      },
    });
  }

  async activateInvitations(link: string) {
    const invitations = await this._findInvitationsByActivationLink(link);
    if (!invitations) throw new BadRequestException();

    // await this._validateInvatations();
  }
}
