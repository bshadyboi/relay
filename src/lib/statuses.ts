import type { Presence } from "./types";

export type StatusPreset = {
  id: string;
  label: string;
  status: string;
  presence: Presence;
};

export const STATUS_PRESETS: StatusPreset[] = [
  {
    id: "on-shift",
    label: "On shift",
    status: "On shift · Bay-2",
    presence: "active",
  },
  {
    id: "assist",
    label: "On assist",
    status: "Remote assist in progress",
    presence: "assist",
  },
  {
    id: "standup",
    label: "Stand-up",
    status: "In stand-up · Bryant floor",
    presence: "away",
  },
  {
    id: "lunch",
    label: "Lunch",
    status: "Lunch · back in 30",
    presence: "away",
  },
  {
    id: "focus",
    label: "Focus",
    status: "Focusing · DND",
    presence: "dnd",
  },
  {
    id: "cams",
    label: "Watching cams",
    status: "Eyes on surround cams",
    presence: "active",
  },
];
