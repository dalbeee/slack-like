import { IsString, Length } from 'class-validator';

export class MessageReactionCreateDto {
  @IsString()
  @Length(2, 2)
  content!: string;

  @IsString()
  messageId!: string;
}
