export interface WorkspaceState {
  latestMessageId: string;
  lastCheckMessageId: string;
}

export interface Workspaces {
  [workspaceId: string]: WorkspaceState;
}

export interface Sockets {
  [workspaceId: string]: string;
}

export interface UserState {
  id: string;
  [key: string]: any;
  workspaces: Workspaces;
  sockets: Sockets;
}
