import { IsString } from 'class-validator';

export class InvitationCreateDto {
  @IsString()
  inviterUserId!: string;

  @IsString()
  inviteeUserId!: string;
}
