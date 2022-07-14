import { IsOptional, IsString } from 'class-validator';

export class SocketConnectionDto {
  @IsString()
  workspaceId: string;

  @IsString()
  @IsOptional()
  channelId?: string;
}
