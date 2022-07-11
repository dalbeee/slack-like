export class MessageDto {
  socketInfo: {
    workspaceId: string;
    channelId?: string;
    userId: string;
  };
  message: string;
}
