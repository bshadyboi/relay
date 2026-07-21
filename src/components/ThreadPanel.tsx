"use client";

import { useMemo } from "react";
import { CURRENT_USER_ID, getUser } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";
import { Composer } from "./Composer";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ThreadPanel() {
  const {
    threadRootId,
    setThreadRootId,
    messages,
    toggleReaction,
  } = useWorkspace();

  const root = useMemo(
    () => messages.find((m) => m.id === threadRootId),
    [messages, threadRootId],
  );

  const replies = useMemo(
    () =>
      messages
        .filter((m) => m.threadId === threadRootId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [messages, threadRootId],
  );

  if (!threadRootId || !root) return null;

  const rootUser = getUser(root.userId);

  return (
    <aside className="flex w-full max-w-full flex-col border-l border-border bg-surface animate-slide-in md:w-[380px]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-[17px] font-bold text-ink">Thread</h2>
        <button
          type="button"
          onClick={() => setThreadRootId(null)}
          className="rounded p-1.5 text-ink-muted hover:bg-hover"
          aria-label="Close thread"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        <ThreadMessage
          name={rootUser?.name ?? "Unknown"}
          avatar={rootUser?.avatar ?? "?"}
          time={formatTime(root.createdAt)}
          text={root.text}
          reactions={root.reactions}
          onToggle={(emoji) => toggleReaction(root.id, emoji)}
        />

        <div className="my-3 flex items-center gap-2 text-xs text-ink-muted">
          <span className="font-semibold">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {replies.map((r) => {
          const u = getUser(r.userId);
          return (
            <ThreadMessage
              key={r.id}
              name={u?.name ?? "Unknown"}
              avatar={u?.avatar ?? "?"}
              time={formatTime(r.createdAt)}
              text={r.text}
              reactions={r.reactions}
              onToggle={(emoji) => toggleReaction(r.id, emoji)}
            />
          );
        })}
      </div>

      <Composer threadId={threadRootId} placeholder="Reply…" />
    </aside>
  );
}

function ThreadMessage({
  name,
  avatar,
  time,
  text,
  reactions,
  onToggle,
}: {
  name: string;
  avatar: string;
  time: string;
  text: string;
  reactions: { emoji: string; userIds: string[] }[];
  onToggle: (emoji: string) => void;
}) {
  return (
    <div className="mb-3 flex gap-2 rounded-md px-1 py-1 hover:bg-hover">
      <div className="flex size-9 shrink-0 items-center justify-center rounded bg-avatar text-xs font-bold text-white">
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-ink">{name}</span>
          <time className="text-[11px] text-ink-muted">{time}</time>
        </div>
        <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.45] text-ink">
          {text}
        </p>
        {reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {reactions.map((r) => {
              const mine = r.userIds.includes(CURRENT_USER_ID);
              return (
                <button
                  key={r.emoji}
                  type="button"
                  onClick={() => onToggle(r.emoji)}
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs ${
                    mine
                      ? "border-accent/40 bg-accent-soft"
                      : "border-border"
                  }`}
                >
                  {r.emoji} {r.userIds.length}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
