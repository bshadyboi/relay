"use client";

import { getUser } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function MentionsPanel() {
  const {
    mentionsOpen,
    setMentionsOpen,
    mentionMessages,
    channels,
    jumpToMessage,
  } = useWorkspace();

  if (!mentionsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close mentions"
        onClick={() => setMentionsOpen(false)}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface animate-slide-in">
        <header className="flex h-12 items-center justify-between border-b border-border px-4">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
            Mentions
          </h2>
          <button
            type="button"
            onClick={() => setMentionsOpen(false)}
            className="text-ink-muted hover:text-white"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {mentionMessages.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-ink-muted">
              No open mentions — you&apos;re clear.
            </p>
          )}
          {mentionMessages.map((m) => {
            const author = getUser(m.userId);
            const ch = channels.find((c) => c.id === m.channelId);
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => jumpToMessage(m.id)}
                className="mb-2 w-full rounded-lg border border-border bg-black/40 p-3 text-left transition hover:border-amber-500/40 hover:bg-hover"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-ink-muted">
                  <span>#{ch?.name ?? "channel"}</span>
                  <span>
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  {author?.name ?? "Unknown"}
                </p>
                <p className="mt-1 line-clamp-3 text-[13px] text-ink-muted">
                  {m.text}
                </p>
                <span className="mt-2 inline-block font-mono text-[10px] text-amber-300">
                  Jump to message →
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
