import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ChannelFindDirectMesageDto {
  @IsString()
  workspaceId!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  userIds: string[];
}
