import { IsString } from 'class-validator';

export class ChannelSubscribeDto {
  @IsString()
  channelId: string;
}
