/** Simulated live floor traffic for the Bryant ops workspace. */

export type LiveEvent = {
  userId: string;
  channelId: string;
  text: string;
  alert?: { title: string; body: string; type: "incident" | "info" | "pager" };
  bumpUnread?: boolean;
};

export const LIVE_EVENTS: LiveEvent[] = [
  {
    userId: "u8",
    channelId: "c-fleet-ops",
    text: "Bay-1 clear on Embarcadero — ZX-1201 pacing well past Ferry Building.",
    bumpUnread: true,
  },
  {
    userId: "u6",
    channelId: "c-field",
    text: "Bryant lot update: slot 2 free. ZX-0915 still charging B4 — 41%.",
    bumpUnread: true,
  },
  {
    userId: "u10",
    channelId: "c-random",
    text: "Anyone want coffee from the Bryant lobby cart? Running down in 5.",
  },
  {
    userId: "u7",
    channelId: "c-eng",
    text: "INFO: Fleet avg battery 64%. Two units below 40% — ZX-1134, ZX-0915.",
    alert: {
      type: "info",
      title: "Telemetry Bot",
      body: "Two units below 40% battery threshold.",
    },
  },
  {
    userId: "u9",
    channelId: "c-fleet-ops",
    text: "Taking ZX-1210 remote assist — pedestrian cluster near Market. Status → On Assist.",
    bumpUnread: true,
  },
  {
    userId: "u12",
    channelId: "c-field",
    text: "Field unit en route to Kato for ZX-0721 support if cal slips.",
  },
  {
    userId: "u11",
    channelId: "c-shift",
    text: "Swing shift pre-briefs at 14:30 in Bay-2 — bring open INC list.",
  },
  {
    userId: "u3",
    channelId: "c-fleet-ops",
    text: "ZX-1087 Mission loop clean. Handing Route 12 to Bay-1 spare if needed.",
  },
  {
    userId: "u13",
    channelId: "c-eng",
    text: "VPN tunnel check green from Bryant NOC. Still watching ZX-1134 gap on HD-4421.",
  },
  {
    userId: "u14",
    channelId: "c-random",
    text: "Night crew: leave the stand-up notes on the Bay-2 whiteboard before you bounce.",
  },
  {
    userId: "u2",
    channelId: "c-fleet-ops",
    text: "INC-8842 still holding — obstacle uncleared. @bperalta keep surround cams up.",
    alert: {
      type: "incident",
      title: "INC-8842 update",
      body: "Obstacle still uncleared on ZX-1199.",
    },
    bumpUnread: true,
  },
  {
    userId: "u6",
    channelId: "c-field",
    text: "ZX-1178 remains staged at 1600 Bryant for FLT-2108 / Route 14.",
  },
];
