"use client";

import { runbooks } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function RunbooksDrawer() {
  const { runbooksOpen, setRunbooksOpen } = useWorkspace();
  if (!runbooksOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close runbooks"
        onClick={() => setRunbooksOpen(false)}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface animate-slide-in">
        <header className="flex h-12 items-center justify-between border-b border-border px-4">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
            Runbooks
          </h2>
          <button
            type="button"
            onClick={() => setRunbooksOpen(false)}
            className="text-ink-muted hover:text-white"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {runbooks.map((rb) => (
            <article
              key={rb.id}
              className="mb-3 rounded-lg border border-border bg-black/40 p-4"
            >
              <h3 className="text-sm font-semibold text-white">{rb.title}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-ink-muted">
                {rb.body}
              </p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
