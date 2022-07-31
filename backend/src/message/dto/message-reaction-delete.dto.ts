import { IsString } from 'class-validator';

export class MessageReactionDeleteDto {
  @IsString()
  reactionId: string;
}
