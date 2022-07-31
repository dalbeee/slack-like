import { IsString, Length } from 'class-validator';

export class MessageReactionCreateDto {
  @IsString()
  @Length(1, 2)
  content!: string;

  @IsString()
  messageId!: string;
}
