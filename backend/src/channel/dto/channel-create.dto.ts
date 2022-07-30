import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ChannelCreateDto {
  @IsString()
  name!: string;

  @IsString()
  workspaceId!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsString()
  password?: string;
}
