import { IsString, ValidateNested } from 'class-validator';
import { SocketInfo } from './socket-info.dto';

export class ChannelMetadataUpdateDto {
  @ValidateNested()
  socketInfo: SocketInfo;

  @IsString()
  lastCheckMesasgeId: string;
}
