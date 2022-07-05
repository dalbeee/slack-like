import { IsString } from 'class-validator';

export class MessageCreateDto {
  @IsString()
  userId!: string;

  @IsString()
  content!: string;
}
