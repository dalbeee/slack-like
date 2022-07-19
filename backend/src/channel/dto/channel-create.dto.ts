import { IsOptional, IsString } from 'class-validator';

export class ChannelCreateDto {
  @IsString()
  name!: string;

  @IsString()
  workspaceId!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
