"use client";

import {
  getIncidentByTicket,
  getUserByHandle,
  getVehicleById,
} from "./data";

const TOKEN_RE =
  /(@[a-z0-9_]+)|(INC-\d+|HD-\d+|FLT-\d+)|(ZX-\d{4})/gi;

export type MessagePart =
  | { type: "text"; value: string }
  | { type: "mention"; value: string; userId?: string }
  | { type: "incident"; value: string }
  | { type: "vehicle"; value: string };

export function parseMessageParts(text: string): MessagePart[] {
  const parts: MessagePart[] = [];
  let last = 0;
  const re = new RegExp(TOKEN_RE);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith("@")) {
      const user = getUserByHandle(raw);
      parts.push({ type: "mention", value: raw, userId: user?.id });
    } else if (/^(INC|HD|FLT)-/i.test(raw)) {
      parts.push({ type: "incident", value: raw.toUpperCase() });
    } else {
      parts.push({ type: "vehicle", value: raw.toUpperCase() });
    }
    last = match.index + raw.length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts.length ? parts : [{ type: "text", value: text }];
}

export function extractMentionUserIds(text: string, currentUserId: string) {
  const ids = new Set<string>();
  for (const part of parseMessageParts(text)) {
    if (part.type === "mention" && part.userId && part.userId !== currentUserId) {
      ids.add(part.userId);
    }
  }
  return [...ids];
}

export function messageHasIncidentOrVehicle(text: string) {
  return parseMessageParts(text).some(
    (p) => p.type === "incident" || p.type === "vehicle",
  );
}

export function resolveIncidentTicket(ticket: string) {
  return getIncidentByTicket(ticket);
}

export function resolveVehicle(id: string) {
  return getVehicleById(id);
}
