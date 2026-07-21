"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CURRENT_USER_ID, getUser } from "@/lib/data";
import type { Message } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎉", "👀", "🔥"];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function sameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function MessagePane() {
  const {
    messages,
    active,
    channels,
    directMessages,
    setThreadRootId,
    toggleReaction,
    setSidebarOpen,
  } = useWorkspace();
  const bottomRef = useRef<HTMLDivElement>(null);

  const conversationMessages = useMemo(
    () =>
      messages
        .filter((m) => m.channelId === active.id && !m.threadId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    [messages, active.id],
  );

  const title = useMemo(() => {
    if (active.type === "channel") {
      const ch = channels.find((c) => c.id === active.id);
      return ch ? `${ch.isPrivate ? "🔒 " : "#"}${ch.name}` : "";
    }
    const dm = directMessages.find((d) => d.id === active.id);
    const user = dm ? getUser(dm.userId) : undefined;
    return user?.name ?? "Direct message";
  }, [active, channels, directMessages]);

  const subtitle = useMemo(() => {
    if (active.type === "channel") {
      const ch = channels.find((c) => c.id === active.id);
      return ch?.topic ?? ch?.description;
    }
    const dm = directMessages.find((d) => d.id === active.id);
    const user = dm ? getUser(dm.userId) : undefined;
    return user?.status ?? user?.title;
  }, [active, channels, directMessages]);

  const memberCount = useMemo(() => {
    if (active.type !== "channel") return null;
    return channels.find((c) => c.id === active.id)?.memberIds.length ?? 0;
  }, [active, channels]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length, active.id]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
        <button
          type="button"
          className="rounded p-1.5 text-ink-muted hover:bg-hover lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[17px] font-bold text-ink">{title}</h1>
            {memberCount != null && (
              <span className="hidden items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs text-ink-muted sm:inline-flex">
                <PeopleIcon />
                {memberCount}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="truncate text-xs text-ink-muted">{subtitle}</p>
          )}
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <HeaderBtn label="Search" />
          <HeaderBtn label="Profile" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin sm:px-4">
        {conversationMessages.length === 0 && (
          <EmptyState title={title} />
        )}
        {conversationMessages.map((msg, i) => {
          const prev = conversationMessages[i - 1];
          const showDay =
            !prev || !sameDay(prev.createdAt, msg.createdAt);
          const user = getUser(msg.userId);
          const compact =
            !!prev &&
            prev.userId === msg.userId &&
            !showDay &&
            new Date(msg.createdAt).getTime() -
              new Date(prev.createdAt).getTime() <
              5 * 60_000;

          return (
            <div key={msg.id}>
              {showDay && (
                <div className="relative my-4 flex items-center justify-center">
                  <div className="absolute inset-x-0 top-1/2 border-t border-border" />
                  <span className="relative rounded-full border border-border bg-surface px-3 py-0.5 text-xs font-bold text-ink">
                    {formatDayLabel(msg.createdAt)}
                  </span>
                </div>
              )}
              <MessageRow
                message={msg}
                userName={user?.name ?? "Unknown"}
                avatar={user?.avatar ?? "?"}
                compact={compact}
                onOpenThread={() => setThreadRootId(msg.id)}
                onToggleReaction={(emoji) => toggleReaction(msg.id, emoji)}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageRow({
  message,
  userName,
  avatar,
  compact,
  onOpenThread,
  onToggleReaction,
}: {
  message: Message;
  userName: string;
  avatar: string;
  compact: boolean;
  onOpenThread: () => void;
  onToggleReaction: (emoji: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMine = message.userId === CURRENT_USER_ID;

  return (
    <div
      className={`group relative rounded-md px-2 py-0.5 hover:bg-hover ${
        compact ? "mt-0" : "mt-2 pt-1"
      }`}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="flex gap-2">
        {compact ? (
          <div className="w-9 shrink-0" />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded bg-avatar text-xs font-bold text-white">
            {avatar}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {!compact && (
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-[15px] font-bold text-ink">{userName}</span>
              <time className="text-[12px] text-ink-muted">
                {formatTime(message.createdAt)}
              </time>
              {isMine && (
                <span className="text-[11px] text-ink-muted">(you)</span>
              )}
            </div>
          )}
          <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.45] text-ink">
            {message.text}
          </p>
          {message.reactions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {message.reactions.map((r) => {
                const mine = r.userIds.includes(CURRENT_USER_ID);
                return (
                  <button
                    key={r.emoji}
                    type="button"
                    onClick={() => onToggleReaction(r.emoji)}
                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors ${
                      mine
                        ? "border-accent/40 bg-accent-soft text-ink"
                        : "border-border bg-surface hover:border-accent/30"
                    }`}
                  >
                    <span>{r.emoji}</span>
                    <span className="font-semibold text-ink-muted">
                      {r.userIds.length}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {(message.replyCount ?? 0) > 0 && (
            <button
              type="button"
              onClick={onOpenThread}
              className="mt-1.5 text-[13px] font-bold text-link hover:underline"
            >
              {message.replyCount}{" "}
              {message.replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-0 z-10 hidden -translate-y-1/2 items-center rounded-lg border border-border bg-surface shadow-sm group-hover:flex">
        {QUICK_EMOJIS.slice(0, 3).map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="px-1.5 py-1 text-sm hover:bg-hover"
            onClick={() => onToggleReaction(emoji)}
            title={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        <button
          type="button"
          className="px-2 py-1 text-xs font-medium text-ink-muted hover:bg-hover"
          onClick={onOpenThread}
        >
          Reply
        </button>
        <button
          type="button"
          className="px-2 py-1 text-ink-muted hover:bg-hover"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More reactions"
        >
          ···
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 flex gap-0.5 rounded-lg border border-border bg-surface p-1 shadow-md">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded px-1.5 py-1 hover:bg-hover"
                onClick={() => {
                  onToggleReaction(emoji);
                  setMenuOpen(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-sidebar text-2xl text-white">
        💬
      </div>
      <h2 className="text-lg font-bold text-ink">This is the very beginning of {title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        Say hello, share an update, or drop a link. Messages stay in this
        conversation.
      </p>
    </div>
  );
}

function HeaderBtn({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-ink-muted hover:bg-hover"
    >
      {label}
    </button>
  );
}

function MenuIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
