import { IsOptional, IsString } from 'class-validator';

export class WorkspaceCreateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
