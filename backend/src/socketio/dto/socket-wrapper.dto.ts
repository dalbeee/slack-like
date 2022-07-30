import { ValidateNested } from 'class-validator';

import { SocketInfo } from './socket-info.dto';

export class SocketWrapper {
  @ValidateNested()
  socketInfo: SocketInfo;
}
