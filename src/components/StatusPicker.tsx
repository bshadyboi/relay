"use client";

import { useState } from "react";
import { STATUS_PRESETS } from "@/lib/statuses";
import { useWorkspace } from "@/lib/workspace";

export function StatusPicker() {
  const {
    statusPickerOpen,
    setStatusPickerOpen,
    setCustomStatus,
    users,
    currentUserId,
  } = useWorkspace();
  const me = users.find((u) => u.id === currentUserId);
  const [custom, setCustom] = useState(me?.status ?? "");

  if (!statusPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-2xl animate-[fade-up_0.25s_ease-out]">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Set status</h2>
            <p className="font-mono text-[10px] text-ink-muted">
              Visible on the Bryant ops floor
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStatusPickerOpen(false)}
            className="text-ink-muted hover:text-white"
          >
            ✕
          </button>
        </header>

        <div className="grid grid-cols-2 gap-2 p-4">
          {STATUS_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setCustomStatus(p.status, p.presence);
                setStatusPickerOpen(false);
              }}
              className="rounded-lg border border-border bg-black/40 px-3 py-3 text-left transition hover:border-white/25 hover:bg-hover"
            >
              <div className="text-sm font-semibold text-white">{p.label}</div>
              <div className="mt-1 font-mono text-[10px] text-ink-muted">
                {p.status}
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-4">
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            Custom status
          </label>
          <div className="flex gap-2">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Pairing on INC-8842"
              className="flex-1 rounded-md border border-border bg-black px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
            <button
              type="button"
              disabled={!custom.trim()}
              onClick={() => {
                setCustomStatus(custom.trim(), "active");
                setStatusPickerOpen(false);
              }}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-black disabled:opacity-40"
            >
              Set
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
