import { ChannelCreateDto } from './dto/channel-create.dto';

export type ChannelCreateProps = ChannelCreateDto & { workspaceId: string };
export type findChannelsByIdProps = {
  channelId: string;
  workspaceId: string;
};
