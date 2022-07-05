import { Invitation } from '@prisma/client';
import { InvitationCreateDto } from './dto/invitation-create.dto';

export type InvitationCreateProps = InvitationCreateDto & {
  workspaceId: string;
};

export type ValidateInvivationProps = {
  invitations: Invitation;
  inviteeUserId: string;
};

export type ActivateInvitationsProps = {};
