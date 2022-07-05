import { IsString } from 'class-validator';

export class MessageCreateDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  channelId!: string;

  @IsString()
  userId!: string;

  @IsString()
  content!: string;
}
