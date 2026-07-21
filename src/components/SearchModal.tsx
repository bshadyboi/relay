"use client";

import { useEffect, useMemo, useState } from "react";
import { getUser } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function SearchModal() {
  const {
    searchOpen,
    setSearchOpen,
    messages,
    channels,
    setActive,
    setDetail,
    incidents,
    vehicles,
  } = useWorkspace();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!searchOpen) setQ("");
  }, [searchOpen]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return { messages: [], incidents: [], vehicles: [] };
    return {
      messages: messages
        .filter((m) => !m.threadId && m.text.toLowerCase().includes(query))
        .slice(0, 8),
      incidents: incidents
        .filter(
          (i) =>
            i.ticketId.toLowerCase().includes(query) ||
            i.title.toLowerCase().includes(query),
        )
        .slice(0, 5),
      vehicles: vehicles
        .filter(
          (v) =>
            v.id.toLowerCase().includes(query) ||
            v.nickname.toLowerCase().includes(query),
        )
        .slice(0, 5),
    };
  }, [q, messages, incidents, vehicles]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh]">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <span className="font-mono text-ink-muted">⌘K</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearchOpen(false);
            }}
            placeholder="Search messages, INC tickets, ZX vehicles…"
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-ink-muted"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="text-ink-muted hover:text-white"
          >
            Esc
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin">
          {!q.trim() && (
            <p className="px-2 py-4 text-sm text-ink-muted">
              Try ZX-1199, INC-8842, or Bryant
            </p>
          )}
          {results.incidents.map((i) => (
            <button
              key={i.id}
              type="button"
              className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-hover"
              onClick={() => {
                setDetail({ kind: "incident", id: i.id });
                setSearchOpen(false);
              }}
            >
              <span className="font-mono text-[11px] text-urgent">
                {i.ticketId}
              </span>
              <span className="text-sm text-white">{i.title}</span>
            </button>
          ))}
          {results.vehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-hover"
              onClick={() => {
                setDetail({ kind: "vehicle", id: v.id });
                setSearchOpen(false);
              }}
            >
              <span className="font-mono text-[11px] text-ink-muted">
                {v.id}
              </span>
              <span className="text-sm text-white">
                {v.nickname} · {v.status}
              </span>
            </button>
          ))}
          {results.messages.map((m) => {
            const ch = channels.find((c) => c.id === m.channelId);
            const user = getUser(m.userId);
            return (
              <button
                key={m.id}
                type="button"
                className="flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-hover"
                onClick={() => {
                  if (ch) setActive({ type: "channel", id: ch.id });
                  setSearchOpen(false);
                }}
              >
                <span className="font-mono text-[10px] text-ink-muted">
                  #{ch?.name ?? "dm"} · {user?.name}
                </span>
                <span className="line-clamp-2 text-sm text-white">{m.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PinsDrawer() {
  const { pinsOpen, setPinsOpen, messages, channels, setActive, active } =
    useWorkspace();
  if (!pinsOpen) return null;

  const pinned = messages.filter(
    (m) => m.pinned && !m.threadId && m.channelId === active.id,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close pins"
        onClick={() => setPinsOpen(false)}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface">
        <header className="flex h-12 items-center justify-between border-b border-border px-4">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
            Pinned in channel
          </h2>
          <button type="button" onClick={() => setPinsOpen(false)}>
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {pinned.length === 0 && (
            <p className="text-sm text-ink-muted">No pins in this conversation.</p>
          )}
          {pinned.map((m) => {
            const user = getUser(m.userId);
            return (
              <div
                key={m.id}
                className="mb-3 rounded-lg border border-border bg-black/40 p-3"
              >
                <p className="font-mono text-[10px] text-ink-muted">
                  {user?.name}
                </p>
                <p className="mt-1 text-sm text-white">{m.text}</p>
              </div>
            );
          })}
          {channels.length > 0 && null}
        </div>
      </aside>
    </div>
  );
}
