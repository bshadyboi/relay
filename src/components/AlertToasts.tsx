"use client";

import { useWorkspace } from "@/lib/workspace";

export function AlertToasts() {
  const { alerts, dismissAlert, setDetail, incidents } = useWorkspace();
  if (!alerts.length) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-12 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      {alerts.slice(-3).map((a) => (
        <div
          key={a.id}
          className={`pointer-events-auto rounded-lg border px-3 py-2 shadow-xl backdrop-blur ${
            a.type === "incident" || a.type === "pager"
              ? "border-red-500/30 bg-red-950/90"
              : "border-border bg-[#1a1a1a]/95"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-white">{a.title}</div>
              <div className="mt-0.5 text-[11px] text-ink-muted">{a.body}</div>
              {a.type === "pager" && (
                <button
                  type="button"
                  className="mt-1 font-mono text-[10px] text-urgent underline"
                  onClick={() => {
                    const inc = incidents.find((i) => i.ticketId === "HD-4421");
                    if (inc) setDetail({ kind: "incident", id: inc.id });
                    dismissAlert(a.id);
                  }}
                >
                  Open HD-4421
                </button>
              )}
            </div>
            <button
              type="button"
              className="text-ink-muted hover:text-white"
              onClick={() => dismissAlert(a.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
