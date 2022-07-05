import { MessageCreateDto } from './dto/message-create.dto';
import { MessageReactionCreateDto } from './dto/message-reaction-create.dto';

export type MessageReactionCreateProps = MessageReactionCreateDto & {
  messageId: string;
};

export type MessageCreateProps = MessageCreateDto & {
  channelId: string;
  workspaceId: string;
};
