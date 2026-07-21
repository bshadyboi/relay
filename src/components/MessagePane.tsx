"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageBody } from "@/components/MessageBody";
import { getUser } from "@/lib/data";
import type { Message } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace";

const QUICK_EMOJIS = ["👍", "👀", "🚨", "✅", "🛠️", "📋"];

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
    users,
    setThreadRootId,
    toggleReaction,
    togglePin,
    setSidebarOpen,
    setRunbooksOpen,
    setPinsOpen,
    setSearchOpen,
    focusMessageId,
    setMentionsOpen,
  } = useWorkspace();
  const bottomRef = useRef<HTMLDivElement>(null);
  const skipAutoScroll = useRef(false);

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
    const user = dm ? users.find((u) => u.id === dm.userId) : undefined;
    return user?.name ?? "Direct message";
  }, [active, channels, directMessages, users]);

  const subtitle = useMemo(() => {
    if (active.type === "channel") {
      const ch = channels.find((c) => c.id === active.id);
      return ch?.topic ?? ch?.description;
    }
    const dm = directMessages.find((d) => d.id === active.id);
    const user = dm ? users.find((u) => u.id === dm.userId) : undefined;
    return user?.status ?? user?.title;
  }, [active, channels, directMessages, users]);

  const memberCount = useMemo(() => {
    if (active.type !== "channel") return null;
    return channels.find((c) => c.id === active.id)?.memberIds.length ?? 0;
  }, [active, channels]);

  useEffect(() => {
    if (focusMessageId) {
      skipAutoScroll.current = true;
      const el = document.getElementById(`msg-${focusMessageId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (skipAutoScroll.current) {
      skipAutoScroll.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length, active.id, focusMessageId]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-surface">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md">
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
            <h1 className="truncate font-mono text-[15px] font-semibold tracking-tight text-white">
              {title}
            </h1>
            {memberCount != null && (
              <span className="hidden items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-muted sm:inline-flex">
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
          <HeaderBtn label="Mentions" onClick={() => setMentionsOpen(true)} />
          <HeaderBtn label="Pins" onClick={() => setPinsOpen(true)} />
          <HeaderBtn label="Runbooks" onClick={() => setRunbooksOpen(true)} />
          <HeaderBtn label="Search" onClick={() => setSearchOpen(true)} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin sm:px-4">
        {conversationMessages.length === 0 && <EmptyState title={title} />}
        {conversationMessages.map((msg, i) => {
          const prev = conversationMessages[i - 1];
          const showDay = !prev || !sameDay(prev.createdAt, msg.createdAt);
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
                  <span className="relative rounded-full border border-border bg-surface px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {formatDayLabel(msg.createdAt)}
                  </span>
                </div>
              )}
              <MessageRow
                message={msg}
                userName={user?.name ?? "Unknown"}
                avatar={user?.avatar ?? "?"}
                compact={compact}
                focused={focusMessageId === msg.id}
                onOpenThread={() => setThreadRootId(msg.id)}
                onToggleReaction={(emoji) => toggleReaction(msg.id, emoji)}
                onTogglePin={() => togglePin(msg.id)}
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
  focused,
  onOpenThread,
  onToggleReaction,
  onTogglePin,
}: {
  message: Message;
  userName: string;
  avatar: string;
  compact: boolean;
  focused?: boolean;
  onOpenThread: () => void;
  onToggleReaction: (emoji: string) => void;
  onTogglePin: () => void;
}) {
  const { currentUserId } = useWorkspace();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMine = message.userId === currentUserId;

  return (
    <div
      id={`msg-${message.id}`}
      className={`group relative rounded-md px-2 py-0.5 transition-colors ${
        focused
          ? "animate-mention-flash bg-amber-500/15 ring-1 ring-amber-400/40"
          : "hover:bg-hover"
      } ${compact ? "mt-0" : "mt-2 pt-1"}`}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className="flex gap-2">
        {compact ? (
          <div className="w-9 shrink-0" />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded border border-white/10 bg-avatar font-mono text-[11px] font-bold text-white">
            {avatar}
          </div>
        )}
        <div className="min-w-0 flex-1">
          {!compact && (
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-[14px] font-semibold text-white">
                {userName}
              </span>
              <time className="font-mono text-[11px] text-ink-muted">
                {formatTime(message.createdAt)}
              </time>
              {isMine && (
                <span className="font-mono text-[10px] text-ink-muted">you</span>
              )}
              {message.pinned && (
                <span className="font-mono text-[10px] text-amber-300">
                  pinned
                </span>
              )}
            </div>
          )}
          <MessageBody
            text={message.text}
            attachmentName={message.attachmentName}
          />
          {message.reactions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {message.reactions.map((r) => {
                const mine = r.userIds.includes(currentUserId);
                return (
                  <button
                    key={r.emoji}
                    type="button"
                    onClick={() => onToggleReaction(r.emoji)}
                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
                      mine
                        ? "border-white/30 bg-accent-soft text-white"
                        : "border-border bg-black/40 hover:border-white/20"
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
              className="mt-1.5 font-mono text-[12px] font-semibold text-white/70 hover:text-white"
            >
              {message.replyCount}{" "}
              {message.replyCount === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-0 z-10 hidden -translate-y-1/2 items-center rounded-lg border border-border bg-[#1a1a1a] shadow-lg group-hover:flex">
        {QUICK_EMOJIS.slice(0, 3).map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="px-1.5 py-1 text-sm hover:bg-hover"
            onClick={() => onToggleReaction(emoji)}
          >
            {emoji}
          </button>
        ))}
        <button
          type="button"
          className="px-2 py-1 font-mono text-[11px] text-ink-muted hover:bg-hover hover:text-white"
          onClick={onOpenThread}
        >
          Reply
        </button>
        <button
          type="button"
          className="px-2 py-1 font-mono text-[11px] text-ink-muted hover:bg-hover hover:text-white"
          onClick={onTogglePin}
        >
          {message.pinned ? "Unpin" : "Pin"}
        </button>
        <button
          type="button"
          className="px-2 py-1 text-ink-muted hover:bg-hover"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ···
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 flex gap-0.5 rounded-lg border border-border bg-[#1a1a1a] p-1 shadow-md">
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
      <div className="mb-3 flex size-12 items-center justify-center rounded-md border border-white/15 bg-white font-black text-black">
        Z
      </div>
      <h2 className="text-base font-semibold text-white">Start of {title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        Post fleet updates, incident acks, or dispatch notes from 1600 Bryant
        St.
      </p>
    </div>
  );
}

function HeaderBtn({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted hover:border-white/20 hover:text-white"
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
