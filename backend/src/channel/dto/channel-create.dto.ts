import { IsOptional, IsString } from 'class-validator';

export class ChannelCreateDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
