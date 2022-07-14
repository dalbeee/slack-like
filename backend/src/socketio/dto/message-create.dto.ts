import { IsString, ValidateNested } from 'class-validator';

import { SocketInfo } from './socket-info.dto';

export class MessageCreateDto {
  @ValidateNested()
  socketInfo: SocketInfo;

  @IsString()
  message: string;
}
