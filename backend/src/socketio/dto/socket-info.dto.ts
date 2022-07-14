import { IsString } from 'class-validator';

export class SocketInfo {
  @IsString()
  workspaceId: string;

  @IsString()
  channelId: string;
}
