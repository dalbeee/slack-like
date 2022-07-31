import { IsString } from 'class-validator';

export class MessageCreateDto {
  @IsString()
  content!: string;

  @IsString()
  workspaceId!: string;

  @IsString()
  channelId!: string;
}
