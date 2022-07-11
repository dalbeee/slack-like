import { IsString } from 'class-validator';

export class InvitationCreateDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  inviteeEmail!: string;
}
