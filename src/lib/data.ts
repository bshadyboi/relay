import type {
  Channel,
  DirectMessage,
  Incident,
  Message,
  Runbook,
  User,
  Vehicle,
} from "./types";

export const OFFICE = {
  name: "Zoox HQ",
  address: "1600 Bryant St",
  city: "San Francisco, CA",
  label: "1600 Bryant St · SF",
};

export const users: User[] = [
  {
    id: "u1",
    name: "Brandon Peralta",
    displayName: "bperalta",
    avatar: "BP",
    presence: "active",
    status: "On shift · Bay-2",
    title: "Remote Fleet Operator",
    email: "bperalta1@zoox.com",
    role: "Remote Fleet Operator",
    badgeId: "ZX-OP-10481",
  },
  {
    id: "u2",
    name: "Sarah Okonkwo",
    displayName: "sokonkwo",
    avatar: "SO",
    presence: "assist",
    status: "Remote assist · ZX-1199",
    title: "Remote Fleet Operator",
    email: "sokonkwo@zoox.com",
    role: "Remote Fleet Operator",
    badgeId: "ZX-OP-10402",
  },
  {
    id: "u3",
    name: "James Liu",
    displayName: "jliu",
    avatar: "JL",
    presence: "active",
    status: "Route 12 coverage",
    title: "Remote Fleet Operator",
    email: "jliu@zoox.com",
    role: "Remote Fleet Operator",
    badgeId: "ZX-OP-10355",
  },
  {
    id: "u4",
    name: "M. Chen",
    displayName: "mchen",
    avatar: "MC",
    presence: "away",
    status: "On site · Kato Rd",
    title: "Field Tech",
    email: "mchen@zoox.com",
    role: "Field Tech",
    badgeId: "ZX-FT-0088",
  },
  {
    id: "u5",
    name: "Priya Nair",
    displayName: "pnair",
    avatar: "PN",
    presence: "active",
    status: "Primary on-call",
    title: "Fleet Engineer",
    email: "pnair@zoox.com",
    role: "Fleet Engineer",
    badgeId: "ZX-EN-0021",
  },
  {
    id: "u6",
    name: "Depot Ops",
    displayName: "depot",
    avatar: "DO",
    presence: "active",
    status: "Bryant lot lead",
    title: "Depot Operations",
    email: "depot@zoox.com",
    role: "Depot Ops",
    badgeId: "ZX-DP-0001",
  },
  {
    id: "u7",
    name: "PagerDuty",
    displayName: "pagerduty",
    avatar: "PD",
    presence: "active",
    title: "Alert bot",
    role: "Bot",
  },
];

export const DEMO_ACCOUNTS = [
  { email: "bperalta1@zoox.com", password: "demo1234", userId: "u1" },
  { email: "sokonkwo@zoox.com", password: "demo1234", userId: "u2" },
  { email: "mchen@zoox.com", password: "demo1234", userId: "u4" },
  { email: "pnair@zoox.com", password: "demo1234", userId: "u5" },
];

export const DEFAULT_EMAIL = "bperalta1@zoox.com";

export const channels: Channel[] = [
  {
    id: "c-fleet-ops",
    name: "fleet-ops-bay",
    description: "Primary remote ops floor — Bay-1 / Bay-2 coverage",
    topic: "Live vehicle holds, assists, and bay-to-bay handoffs · 1600 Bryant",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3", "u5", "u6"],
    unread: 2,
  },
  {
    id: "c-field",
    name: "field-dispatch",
    description: "Field tech + depot coordination",
    topic: "Dispatch, lidar cal, charge slots, staged vehicles",
    isPrivate: false,
    memberIds: ["u1", "u2", "u4", "u6"],
    unread: 1,
  },
  {
    id: "c-eng",
    name: "eng-oncall",
    description: "Platform / telemetry / PagerDuty escalations",
    topic: "Priya Nair primary · Eng rotation B secondary",
    isPrivate: false,
    memberIds: ["u1", "u5", "u7"],
    unread: 1,
  },
  {
    id: "c-incidents",
    name: "incidents",
    description: "Active incident thread — ack, escalate, resolve",
    topic: "Open: INC-8842 · HD-4421",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3", "u4", "u5"],
    unread: 0,
  },
  {
    id: "c-shift",
    name: "shift-handoff",
    description: "Day ↔ night operator handoff notes",
    topic: "Post metrics before clock-out · Bryant ops floor",
    isPrivate: false,
    memberIds: ["u1", "u2", "u3", "u6"],
    unread: 0,
  },
  {
    id: "c-ops-private",
    name: "bay-2-leads",
    description: "Private Bay-2 lead channel",
    isPrivate: true,
    memberIds: ["u1", "u2"],
    unread: 0,
  },
];

export const directMessages: DirectMessage[] = [
  { id: "dm-u2", userId: "u2", unread: 1 },
  { id: "dm-u3", userId: "u3" },
  { id: "dm-u4", userId: "u4" },
  { id: "dm-u5", userId: "u5" },
  { id: "dm-u6", userId: "u6" },
];

export const vehicles: Vehicle[] = [
  {
    id: "ZX-1199",
    nickname: "Sunset",
    status: "incident",
    battery: 67,
    speed: 0,
    route: "Route 9 — Sunset hold",
    operator: "Sarah Okonkwo · Bay-2",
    location: "Sunset Blvd @ 19th Ave",
    lastPing: new Date().toISOString(),
    alerts: ["Safety hold · Obstacle detected", "INC-8842"],
  },
  {
    id: "ZX-1134",
    nickname: "Mission Bay",
    status: "offline",
    battery: 41,
    speed: 0,
    route: "Last: Mission Bay loop",
    operator: null,
    location: "Mission Bay · last GPS",
    lastPing: new Date(Date.now() - 18 * 60_000).toISOString(),
    alerts: ["Telemetry gap > 15 min", "HD-4421"],
  },
  {
    id: "ZX-0721",
    nickname: "Kato",
    status: "maintenance",
    battery: 55,
    speed: 0,
    route: "Lidar calibration",
    operator: "M. Chen · Field",
    location: "Kato Rd yard",
    lastPing: new Date().toISOString(),
    alerts: ["Lidar cal in progress"],
  },
  {
    id: "ZX-0915",
    nickname: "Bryant L3",
    status: "charging",
    battery: 34,
    speed: 0,
    route: "Depot charge · slot 4",
    operator: null,
    location: "1600 Bryant St · Lot B4",
    lastPing: new Date().toISOString(),
    alerts: [],
  },
  {
    id: "ZX-1178",
    nickname: "Embarcadero",
    status: "idle",
    battery: 88,
    speed: 0,
    route: "Staged for Route 14",
    operator: null,
    location: "1600 Bryant St · staging",
    lastPing: new Date().toISOString(),
    alerts: [],
  },
  {
    id: "ZX-1087",
    nickname: "Mission",
    status: "active",
    battery: 62,
    speed: 18,
    route: "Route 12 — Mission Loop",
    operator: "James Liu · Bay-1",
    location: "Mission District",
    lastPing: new Date().toISOString(),
    alerts: [],
  },
];

export const incidents: Incident[] = [
  {
    id: "inc-8842",
    ticketId: "INC-8842",
    title: "ZX-1199 safety hold — obstacle detected",
    vehicleId: "ZX-1199",
    stage: "in_progress",
    assignee: "Sarah Okonkwo",
    severity: "high",
    location: "Sunset Blvd @ 19th Ave",
    summary:
      "Obstacle hold on front wide. Surround cams confirm stationary. Escalate to field if >10 min per Obstacle Hold SOP.",
    updatedAt: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
  {
    id: "inc-4421",
    ticketId: "HD-4421",
    title: "ZX-1134 comms telemetry gap",
    vehicleId: "ZX-1134",
    stage: "open",
    assignee: "Priya Nair",
    severity: "critical",
    location: "Mission Bay · last GPS",
    summary:
      "Telemetry gap > 15 min. Comms subsystem flagged. Run Comms Loss Procedure if gap hits 20 min.",
    updatedAt: new Date(Date.now() - 18 * 60_000).toISOString(),
  },
  {
    id: "inc-8839",
    ticketId: "INC-8839",
    title: "ZX-0915 charge stall B4 intermittent",
    vehicleId: "ZX-0915",
    stage: "resolved",
    assignee: "Depot Ops",
    severity: "medium",
    location: "1600 Bryant St · Lot B4",
    summary: "Charge stall intermittent — resolved after cable reseat.",
    updatedAt: new Date(Date.now() - 90 * 60_000).toISOString(),
  },
  {
    id: "inc-2108",
    ticketId: "FLT-2108",
    title: "Route 14 unassigned — coverage gap",
    vehicleId: "ZX-1178",
    stage: "open",
    assignee: "Fleet Ops",
    severity: "low",
    location: "1600 Bryant St · staging",
    summary: "ZX-1178 staged and ready. Needs Route 14 assignment from dispatch.",
    updatedAt: new Date(Date.now() - 40 * 60_000).toISOString(),
  },
];

export const runbooks: Runbook[] = [
  {
    id: "rb1",
    title: "Obstacle Hold SOP",
    body: "1. Acknowledge incident. 2. Pull front + surround cams. 3. Verify stationary. 4. Escalate to field if >10 min.",
  },
  {
    id: "rb2",
    title: "Comms Loss Procedure",
    body: "Check VPN tunnel status. Verify last GPS. Dispatch field if gap >20 min or battery critical.",
  },
  {
    id: "rb3",
    title: "Remote Assist Protocol",
    body: "Only authorized operators. Log assist reason. Max speed cap 15 mph during assist. Update presence to On Assist.",
  },
  {
    id: "rb4",
    title: "Return to Depot — Bryant",
    body: "Clear active route. Set maintenance hold if needed. Notify #field-dispatch. Stage at 1600 Bryant St lot.",
  },
];

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();

export const initialMessages: Message[] = [
  {
    id: "m1",
    channelId: "c-fleet-ops",
    userId: "u3",
    text: "Route 12 running smooth. ZX-1087 Mission loop on time — Ferry Building clear.",
    createdAt: minutesAgo(35),
    reactions: [{ emoji: "👍", userIds: ["u1", "u2"] }],
  },
  {
    id: "m2",
    channelId: "c-fleet-ops",
    userId: "u2",
    text: "ZX-1199 obstacle hold on Sunset — need eyes on front cam. INC-8842 open. @bperalta can you take surround?",
    createdAt: minutesAgo(8),
    reactions: [{ emoji: "👀", userIds: ["u1", "u3"] }],
    replyCount: 2,
    pinned: true,
  },
  {
    id: "m3",
    channelId: "c-fleet-ops",
    userId: "u1",
    text: "Pulling surround cams now. Vehicle stationary — confirming clearance window.",
    createdAt: minutesAgo(6),
    reactions: [],
    threadId: "m2",
  },
  {
    id: "m4",
    channelId: "c-fleet-ops",
    userId: "u2",
    text: "Thanks — if >10 min escalate per Obstacle Hold SOP. Field standing by.",
    createdAt: minutesAgo(5),
    reactions: [],
    threadId: "m2",
  },
  {
    id: "m5",
    channelId: "c-fleet-ops",
    userId: "u1",
    text: "Bay-2 clocked in at 1600 Bryant. Taking INC-8842 assist if needed.",
    createdAt: minutesAgo(2),
    reactions: [],
  },
  {
    id: "m6",
    channelId: "c-field",
    userId: "u4",
    text: "At Kato Rd on ZX-0721 lidar cal. Back in service ~2 hrs.",
    createdAt: minutesAgo(22),
    reactions: [{ emoji: "🛠️", userIds: ["u6"] }],
  },
  {
    id: "m7",
    channelId: "c-field",
    userId: "u6",
    text: "ZX-0915 (L3) charging at Bryant lot — slot 4, 34% → est. ready 17:45 PST.",
    createdAt: minutesAgo(12),
    reactions: [],
    pinned: true,
  },
  {
    id: "m8",
    channelId: "c-field",
    userId: "u6",
    text: "ZX-1178 staged at 1600 Bryant and ready for Route 14 — see FLT-2108.",
    createdAt: minutesAgo(4),
    reactions: [{ emoji: "✅", userIds: ["u1"] }],
  },
  {
    id: "m9",
    channelId: "c-eng",
    userId: "u7",
    text: "ALERT: ZX-1134 telemetry gap > 15 min. Comms subsystem flagged. Ticket HD-4421. @pnair",
    createdAt: minutesAgo(18),
    reactions: [{ emoji: "🚨", userIds: ["u5"] }],
  },
  {
    id: "m10",
    channelId: "c-eng",
    userId: "u5",
    text: "Acknowledged HD-4421. Checking VPN tunnel + last GPS. Will escalate if gap hits 20 min.",
    createdAt: minutesAgo(14),
    reactions: [],
    replyCount: 1,
  },
  {
    id: "m11",
    channelId: "c-eng",
    userId: "u1",
    text: "Last known: Mission Bay. ZX-1134 battery 41% — not critical yet.",
    createdAt: minutesAgo(11),
    reactions: [],
    threadId: "m10",
  },
  {
    id: "m12",
    channelId: "c-incidents",
    userId: "u2",
    text: "INC-8842 · ZX-1199 safety hold — obstacle detected · In Progress · assignee Sarah Okonkwo",
    createdAt: minutesAgo(40),
    reactions: [],
    pinned: true,
  },
  {
    id: "m13",
    channelId: "c-incidents",
    userId: "u5",
    text: "HD-4421 · ZX-1134 comms telemetry gap · Open · assignee Eng on-call",
    createdAt: minutesAgo(20),
    reactions: [],
  },
  {
    id: "m14",
    channelId: "c-incidents",
    userId: "u6",
    text: "INC-8839 · ZX-0915 charge stall B4 intermittent · Resolved at Bryant lot",
    createdAt: minutesAgo(90),
    reactions: [{ emoji: "✅", userIds: ["u1", "u2"] }],
  },
  {
    id: "m15",
    channelId: "c-shift",
    userId: "u3",
    text: "Morning handoff @ 1600 Bryant: 14 in service · 2 open incidents · Route 14 still unassigned (FLT-2108).",
    createdAt: minutesAgo(180),
    reactions: [{ emoji: "📋", userIds: ["u1", "u2"] }],
    pinned: true,
  },
  {
    id: "m16",
    channelId: "c-ops-private",
    userId: "u2",
    text: "Bay-2 density is high this afternoon — keep one operator free for remote assist.",
    createdAt: minutesAgo(50),
    reactions: [],
  },
  {
    id: "m17",
    channelId: "dm-u2",
    userId: "u2",
    text: "Can you take eyes on ZX-1199 front cam while I update INC-8842?",
    createdAt: minutesAgo(7),
    reactions: [],
  },
  {
    id: "m18",
    channelId: "dm-u5",
    userId: "u5",
    text: "If ZX-1134 gap continues, run Comms Loss Procedure — I can join the bridge.",
    createdAt: minutesAgo(13),
    reactions: [],
  },
  {
    id: "m19",
    channelId: "dm-u4",
    userId: "u4",
    text: "Need a tow slot cleared at Bryant if lidar cal on ZX-0721 slips past 19:00.",
    createdAt: minutesAgo(25),
    reactions: [],
  },
];

export function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export function getUserByHandle(handle: string) {
  const h = handle.replace(/^@/, "").toLowerCase();
  return users.find((u) => u.displayName.toLowerCase() === h);
}

export function getIncidentByTicket(ticket: string) {
  const t = ticket.toUpperCase();
  return incidents.find((i) => i.ticketId === t);
}

export function getVehicleById(id: string) {
  return vehicles.find((v) => v.id.toUpperCase() === id.toUpperCase());
}

export const workspace = {
  name: "Zoox Fleet Ops",
  initial: "Z",
  subtitle: OFFICE.label,
};
