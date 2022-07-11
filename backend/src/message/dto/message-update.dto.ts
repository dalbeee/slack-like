import { IsString } from 'class-validator';

export class MessageUpdateDto {
  @IsString()
  id!: string;

  @IsString()
  content!: string;
}
