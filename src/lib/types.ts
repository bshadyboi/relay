export type Presence = "active" | "away" | "dnd" | "offline";

export type User = {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  status?: string;
  presence: Presence;
  title?: string;
};

export type Reaction = {
  emoji: string;
  userIds: string[];
};

export type Message = {
  id: string;
  channelId: string;
  userId: string;
  text: string;
  createdAt: string;
  reactions: Reaction[];
  threadId?: string;
  replyCount?: number;
  edited?: boolean;
};

export type Channel = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds: string[];
  unread?: number;
  topic?: string;
};

export type DirectMessage = {
  id: string;
  userId: string;
  unread?: number;
};

export type Conversation =
  | { type: "channel"; id: string }
  | { type: "dm"; id: string };
