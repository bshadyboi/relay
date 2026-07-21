"use client";

import { useMemo } from "react";
import { Composer } from "@/components/Composer";
import { MessageBody } from "@/components/MessageBody";
import { getUser } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

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
    currentUserId,
    typingUserIds,
    users,
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
        <h2 className="font-mono text-[14px] font-semibold uppercase tracking-wider text-white">
          Thread
        </h2>
        <button
          type="button"
          onClick={() => setThreadRootId(null)}
          className="rounded p-1.5 text-ink-muted hover:bg-hover"
          aria-label="Close thread"
        >
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        <ThreadMessage
          name={rootUser?.name ?? "Unknown"}
          avatar={rootUser?.avatar ?? "?"}
          time={formatTime(root.createdAt)}
          text={root.text}
          attachmentName={root.attachmentName}
          reactions={root.reactions}
          currentUserId={currentUserId}
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
              attachmentName={r.attachmentName}
              reactions={r.reactions}
              currentUserId={currentUserId}
              onToggle={(emoji) => toggleReaction(r.id, emoji)}
            />
          );
        })}
        {typingUserIds.length > 0 && (
          <p className="px-1 py-2 font-mono text-[11px] text-ink-muted">
            {typingUserIds
              .map((id) => users.find((u) => u.id === id)?.name.split(" ")[0])
              .filter(Boolean)
              .join(", ")}{" "}
            typing…
          </p>
        )}
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
  attachmentName,
  reactions,
  currentUserId,
  onToggle,
}: {
  name: string;
  avatar: string;
  time: string;
  text: string;
  attachmentName?: string;
  reactions: { emoji: string; userIds: string[] }[];
  currentUserId: string;
  onToggle: (emoji: string) => void;
}) {
  return (
    <div className="mb-3 flex gap-2 rounded-md px-1 py-1 hover:bg-hover">
      <div className="flex size-9 shrink-0 items-center justify-center rounded border border-white/10 bg-avatar font-mono text-[11px] font-bold text-white">
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{name}</span>
          <time className="font-mono text-[11px] text-ink-muted">{time}</time>
        </div>
        <MessageBody text={text} attachmentName={attachmentName} />
        {reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {reactions.map((r) => {
              const mine = r.userIds.includes(currentUserId);
              return (
                <button
                  key={r.emoji}
                  type="button"
                  onClick={() => onToggle(r.emoji)}
                  className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[11px] ${
                    mine
                      ? "border-white/30 bg-accent-soft"
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
