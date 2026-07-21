import type { Channel, DirectMessage, Message, User } from "./types";

export const CURRENT_USER_ID = "u1";

export const users: User[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    displayName: "alex",
    avatar: "AR",
    presence: "active",
    status: "Building Relay 🚀",
    title: "Product Engineer",
  },
  {
    id: "u2",
    name: "Jordan Lee",
    displayName: "jordan",
    avatar: "JL",
    presence: "active",
    status: "In a meeting",
    title: "Design Lead",
  },
  {
    id: "u3",
    name: "Sam Chen",
    displayName: "sam",
    avatar: "SC",
    presence: "away",
    status: "Back in 20",
    title: "Frontend",
  },
  {
    id: "u4",
    name: "Morgan Blake",
    displayName: "morgan",
    avatar: "MB",
    presence: "dnd",
    status: "Focusing",
    title: "Backend",
  },
  {
    id: "u5",
    name: "Casey Nguyen",
    displayName: "casey",
    avatar: "CN",
    presence: "active",
    title: "Customer Success",
  },
  {
    id: "u6",
    name: "Riley Park",
    displayName: "riley",
    avatar: "RP",
    presence: "offline",
    title: "Ops",
  },
];

export const channels: Channel[] = [
  {
    id: "c-general",
    name: "general",
    description: "Company-wide announcements and work-based matters",
    topic: "Welcome to Relay HQ — keep it friendly",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3", "u4", "u5", "u6"],
    unread: 0,
  },
  {
    id: "c-random",
    name: "random",
    description: "Non-work banter and watercooler chat",
    topic: "Memes, pets, weekend plans",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3", "u5"],
    unread: 3,
  },
  {
    id: "c-design",
    name: "design",
    description: "Design critique, Figma links, and polish notes",
    topic: "Ship beautiful interfaces",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3"],
    unread: 0,
  },
  {
    id: "c-eng",
    name: "engineering",
    description: "Build status, PRs, and incident chatter",
    topic: "Deploy Fridays optional",
    isPrivate: false,
    memberIds: ["u1", "u3", "u4"],
    unread: 1,
  },
  {
    id: "c-launch",
    name: "project-launch",
    description: "Private channel for the Q3 launch squad",
    isPrivate: true,
    memberIds: ["u1", "u2", "u4", "u5"],
    unread: 0,
  },
];

export const directMessages: DirectMessage[] = [
  { id: "dm-u2", userId: "u2", unread: 2 },
  { id: "dm-u3", userId: "u3" },
  { id: "dm-u4", userId: "u4" },
  { id: "dm-u5", userId: "u5" },
];

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();

export const initialMessages: Message[] = [
  {
    id: "m1",
    channelId: "c-general",
    userId: "u2",
    text: "Morning team — standup notes are in the doc. Drop blockers here if anything's stuck.",
    createdAt: minutesAgo(180),
    reactions: [
      { emoji: "👍", userIds: ["u1", "u3"] },
      { emoji: "👀", userIds: ["u5"] },
    ],
  },
  {
    id: "m2",
    channelId: "c-general",
    userId: "u5",
    text: "Customer call went great. They're excited about the new threads UI.",
    createdAt: minutesAgo(120),
    reactions: [{ emoji: "🎉", userIds: ["u1", "u2", "u3"] }],
    replyCount: 2,
  },
  {
    id: "m3",
    channelId: "c-general",
    userId: "u1",
    text: "Nice! I'll polish the composer keyboard shortcuts today.",
    createdAt: minutesAgo(110),
    reactions: [],
    threadId: "m2",
  },
  {
    id: "m4",
    channelId: "c-general",
    userId: "u2",
    text: "Want me to pair on the empty states? Happy to jump in after lunch.",
    createdAt: minutesAgo(95),
    reactions: [],
    threadId: "m2",
  },
  {
    id: "m5",
    channelId: "c-general",
    userId: "u4",
    text: "API latency is down ~18% after the cache tweak. Monitoring overnight.",
    createdAt: minutesAgo(45),
    reactions: [{ emoji: "🔥", userIds: ["u1", "u3"] }],
  },
  {
    id: "m6",
    channelId: "c-general",
    userId: "u3",
    text: "Shipping the unread badge animation in a few — feels much snappier.",
    createdAt: minutesAgo(12),
    reactions: [],
  },
  {
    id: "m7",
    channelId: "c-random",
    userId: "u3",
    text: "Anyone try the new espresso place on Market? Worth the walk.",
    createdAt: minutesAgo(90),
    reactions: [{ emoji: "☕", userIds: ["u5"] }],
  },
  {
    id: "m8",
    channelId: "c-random",
    userId: "u5",
    text: "Yes! Get the oat cortado. Thank me later.",
    createdAt: minutesAgo(80),
    reactions: [{ emoji: "🙌", userIds: ["u1", "u3"] }],
  },
  {
    id: "m9",
    channelId: "c-random",
    userId: "u2",
    text: "Office dog tax: Luna learned a new trick 🐕",
    createdAt: minutesAgo(30),
    reactions: [
      { emoji: "🐶", userIds: ["u1", "u3", "u5"] },
      { emoji: "❤️", userIds: ["u4"] },
    ],
  },
  {
    id: "m10",
    channelId: "c-design",
    userId: "u2",
    text: "Updated the sidebar tokens — aubergine stays, but hover states are softer. Critique welcome.",
    createdAt: minutesAgo(200),
    reactions: [{ emoji: "🎨", userIds: ["u1"] }],
  },
  {
    id: "m11",
    channelId: "c-design",
    userId: "u1",
    text: "Love the density. Can we bump message padding by 2px on mobile?",
    createdAt: minutesAgo(150),
    reactions: [],
  },
  {
    id: "m12",
    channelId: "c-eng",
    userId: "u4",
    text: "Reminder: cutover window is Thursday 9pm. Freeze starts noon.",
    createdAt: minutesAgo(60),
    reactions: [{ emoji: "🫡", userIds: ["u1", "u3"] }],
  },
  {
    id: "m13",
    channelId: "c-eng",
    userId: "u3",
    text: "PR #482 ready for review — composer autosize + Enter to send.",
    createdAt: minutesAgo(25),
    reactions: [],
    replyCount: 1,
  },
  {
    id: "m14",
    channelId: "c-eng",
    userId: "u1",
    text: "Looking now.",
    createdAt: minutesAgo(20),
    reactions: [],
    threadId: "m13",
  },
  {
    id: "m15",
    channelId: "c-launch",
    userId: "u5",
    text: "Launch checklist is at 92%. Remaining: help center copy + analytics event.",
    createdAt: minutesAgo(70),
    reactions: [{ emoji: "📋", userIds: ["u2"] }],
  },
  {
    id: "m16",
    channelId: "dm-u2",
    userId: "u2",
    text: "Hey — can you glance at the hero motion before I send to eng?",
    createdAt: minutesAgo(40),
    reactions: [],
  },
  {
    id: "m17",
    channelId: "dm-u2",
    userId: "u2",
    text: "Also left a couple notes on the avatar stack.",
    createdAt: minutesAgo(38),
    reactions: [],
  },
  {
    id: "m18",
    channelId: "dm-u3",
    userId: "u3",
    text: "Want to pair on the thread panel later?",
    createdAt: minutesAgo(100),
    reactions: [],
  },
];

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export const workspace = {
  name: "Relay HQ",
  initial: "R",
};
