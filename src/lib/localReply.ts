import { getUser, getVehicleById, getIncidentByTicket } from "./data";
import { PERSONAS } from "./personas";

const ZX_RE = /ZX-\d{4}/i;
const TICKET_RE = /(INC|HD|FLT)-\d+/i;

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Contextual in-character reply when no LLM API key is configured. */
export function localPersonaReply(opts: {
  botUserId: string;
  userText: string;
  history: { role: "user" | "assistant"; content: string }[];
}): string {
  const { botUserId, userText } = opts;
  const bot = getUser(botUserId);
  const persona = PERSONAS[botUserId];
  const lower = userText.toLowerCase();
  const zx = userText.match(ZX_RE)?.[0]?.toUpperCase();
  const ticket = userText.match(TICKET_RE)?.[0]?.toUpperCase();
  const vehicle = zx ? getVehicleById(zx) : undefined;
  const incident = ticket ? getIncidentByTicket(ticket) : undefined;

  if (botUserId === "u7") {
    if (incident) {
      return `ALERT: ${incident.ticketId} still ${incident.stage.replace("_", " ")} — ${incident.title}. Ack or escalate.`;
    }
    return `ALERT: Monitoring open tickets. Primary on-call standing by.`;
  }

  if (vehicle) {
    return pick([
      `${vehicle.id} showing ${vehicle.status} · ${vehicle.battery}% · ${vehicle.location}. ${vehicle.alerts[0] ?? "No active alerts."}`,
      `Got ${vehicle.id} — ${vehicle.route}. ${vehicle.operator ? `Operator ${vehicle.operator}.` : "Unassigned."}`,
      `Checking ${vehicle.id} now. Last ping looks ${vehicle.status === "offline" ? "stale" : "fresh"} from ${vehicle.location}.`,
    ]);
  }

  if (incident) {
    return pick([
      `${incident.ticketId} is ${incident.stage.replace("_", " ")} — assignee ${incident.assignee}. ${incident.summary.split(".")[0]}.`,
      `On it — ${incident.ticketId} @ ${incident.location}. Severity ${incident.severity}.`,
      `Thanks for the ping on ${incident.ticketId}. Keeping eyes on ${incident.vehicleId}.`,
    ]);
  }

  if (
    lower.includes("hello") ||
    lower.includes("hey") ||
    lower.includes("hi ") ||
    lower === "hi"
  ) {
    return pick([
      `Hey — ${bot?.name?.split(" ")[0] ?? "here"}. What's up on the floor?`,
      `Hey. I'm ${bot?.status ?? "on shift"} — shoot.`,
      `Yo. Bryant floor here — what do you need?`,
    ]);
  }

  if (lower.includes("status") || lower.includes("update")) {
    return pick([
      `Quick status: ${bot?.status ?? "on shift"}. ${persona?.habits[0] ?? "Standing by"}.`,
      `Still ${bot?.presence === "assist" ? "in assist" : "covering"} from ${bot?.bay ?? "ops"}. Anything blocking you?`,
      `Floor's busy but manageable. You need eyes on a vehicle or an INC?`,
    ]);
  }

  if (lower.includes("help") || lower.includes("can you")) {
    return pick([
      `Yeah — send me the ZX or ticket ID and I'll jump.`,
      `I can take it. Cam angle, ticket, or field dispatch?`,
      `Copy. Drop details and I'll handle from ${bot?.bay ?? "here"}.`,
    ]);
  }

  if (lower.includes("thank")) {
    return pick([
      `You got it.`,
      `Anytime — shout if it drifts.`,
      `Np. Keeping the thread warm.`,
    ]);
  }

  if (lower.endsWith("?")) {
    return pick([
      `Good question — from my seat: ${bot?.status ?? "we're nominal"}. Want me to pull a specific ZX?`,
      `I'd check the open INC list first, then cams. I can grab that if you want.`,
      `Short answer: yes, but let's confirm on ${bot?.bay ?? "Bay"} before we move metal.`,
    ]);
  }

  // Generic in-voice continuations
  const name = bot?.name?.split(" ")[0] ?? "Ops";
  return pick([
    `Copy that. I'm ${bot?.status ?? "on it"} — will loop back if anything changes.`,
    `${name} here — noted. Keep me tagged if it escalates.`,
    `Makes sense. I'll align with ${persona?.habits[0] ?? "the bay"} and update this thread.`,
    `Roger. Watching from ${bot?.bay ?? "Bryant"} — ping me with a ZX ID if you need depth.`,
    `Understood. I'll stay close on this.`,
  ]);
}
