import { IsOptional, IsString } from 'class-validator';

export class WorkspaceFindDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
