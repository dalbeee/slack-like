import { IsString } from 'class-validator';

export class MessageCreateDto {
  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsString()
  messageId: string;
}
