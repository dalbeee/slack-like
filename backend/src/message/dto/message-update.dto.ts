import { IsString } from 'class-validator';

export class MessageUpdateDto {
  @IsString()
  id!: string;

  @IsString()
  userId!: string;

  @IsString()
  content!: string;
}
