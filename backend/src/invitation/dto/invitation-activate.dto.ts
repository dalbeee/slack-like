import { IsString } from 'class-validator';

export class InvitationActivateDto {
  @IsString()
  activateCode!: string;

  @IsString()
  userId!: string;
}
