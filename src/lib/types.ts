export type Presence = "active" | "away" | "dnd" | "offline" | "assist";

export type ShiftBlock = "Day" | "Swing" | "Night";

export type User = {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  status?: string;
  presence: Presence;
  title?: string;
  email?: string;
  role?: string;
  badgeId?: string;
  shift?: ShiftBlock;
  bay?: string;
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
  pinned?: boolean;
  attachmentName?: string;
};

export type ChannelSection = "ops" | "field" | "eng" | "social";

export type Channel = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberIds: string[];
  unread?: number;
  topic?: string;
  section?: ChannelSection;
};

export type DirectMessage = {
  id: string;
  userId: string;
  unread?: number;
};

export type Conversation =
  | { type: "channel"; id: string }
  | { type: "dm"; id: string };

export type IncidentStage =
  | "open"
  | "acknowledged"
  | "in_progress"
  | "resolved";

export type Incident = {
  id: string;
  ticketId: string;
  title: string;
  vehicleId: string;
  stage: IncidentStage;
  assignee: string;
  severity: "low" | "medium" | "high" | "critical";
  location: string;
  summary: string;
  updatedAt: string;
};

export type VehicleStatus =
  | "active"
  | "idle"
  | "charging"
  | "maintenance"
  | "incident"
  | "offline";

export type Vehicle = {
  id: string;
  nickname: string;
  status: VehicleStatus;
  battery: number;
  speed: number;
  route: string;
  operator: string | null;
  location: string;
  lastPing: string;
  alerts: string[];
};

export type Runbook = {
  id: string;
  title: string;
  body: string;
};

export type AlertToast = {
  id: string;
  title: string;
  body: string;
  type: "incident" | "info" | "pager";
};

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  role: string;
  badgeId: string;
};

export type AppScreen = "login" | "clock-in" | "workspace" | "handoff";

export type DetailTarget =
  | { kind: "incident"; id: string }
  | { kind: "vehicle"; id: string }
  | null;

export type ShiftMetrics = {
  startedAt: string;
  messagesSent: number;
  incidentsAcknowledged: number;
  assists: number;
};
