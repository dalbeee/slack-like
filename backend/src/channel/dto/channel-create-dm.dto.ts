import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChannelCreateDirectMesageDto {
  @IsString()
  workspaceId!: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  userIds: string[];

  @IsOptional()
  @IsString()
  description?: string;
}
