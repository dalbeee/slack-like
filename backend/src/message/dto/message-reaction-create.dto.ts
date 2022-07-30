import { IsString, Length } from 'class-validator';

export class MessageReactionCreateDto {
  @IsString()
  @Length(1, 1)
  content!: string;

  @IsString()
  messageId!: string;
}
