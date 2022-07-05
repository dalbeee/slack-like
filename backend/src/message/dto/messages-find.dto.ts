import { IsString } from 'class-validator';

export class MessagesFindDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  channelId!: string;
}
