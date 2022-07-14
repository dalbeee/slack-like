import { IsString, ValidateNested } from 'class-validator';

import { SocketInfo } from './socket-info.dto';

export class MessageDeleteDto {
  @ValidateNested()
  socketInfo: SocketInfo;

  @IsString()
  messageId: string;
}
