import { IsString } from 'class-validator';

export class SubscribedChannelsDto {
  @IsString()
  workspaceId: string;
}
