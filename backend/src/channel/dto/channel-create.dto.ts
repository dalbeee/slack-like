import { IsOptional, IsString } from 'class-validator';

export class ChannelCreateDto {
  @IsString()
  workspaceId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
