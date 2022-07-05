import { IsString } from 'class-validator';

export class MessageReactionCreateDto {
  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsString()
  messageId: string;
}
