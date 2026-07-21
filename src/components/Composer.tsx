"use client";

import { useEffect, useRef, useState } from "react";
import { channels, directMessages, getUser, users } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function Composer({
  threadId,
  placeholder,
}: {
  threadId?: string;
  placeholder?: string;
}) {
  const { sendMessage, active, currentUserId } = useWorkspace();
  const [text, setText] = useState("");
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const me = getUser(currentUserId);

  const defaultPlaceholder = (() => {
    if (placeholder) return placeholder;
    if (active.type === "channel") {
      const ch = channels.find((c) => c.id === active.id);
      return ch ? `Message #${ch.name}` : "Message";
    }
    const dm = directMessages.find((d) => d.id === active.id);
    const user = dm ? getUser(dm.userId) : undefined;
    return user ? `Message ${user.name}` : "Message";
  })();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);

  function submit() {
    if (!text.trim() && !attachmentName) return;
    sendMessage(text, threadId, attachmentName);
    setText("");
    setAttachmentName(undefined);
    if (fileRef.current) fileRef.current.value = "";
  }

  function insertMention(displayName: string) {
    setText((t) => `${t}${t.endsWith(" ") || !t ? "" : " "}@${displayName} `);
    ref.current?.focus();
  }

  return (
    <div className="shrink-0 px-3 pb-3 pt-1 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-border bg-black/40 transition-shadow focus-within:border-white/25">
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-1.5">
          <ToolBtn label="B" title="Bold" />
          <ToolBtn label="I" title="Italic" italic />
          <ToolBtn label="<>" title="Code" mono />
          <span className="mx-1 h-4 w-px bg-border" />
          <div className="relative">
            <details className="group">
              <summary className="cursor-pointer list-none rounded px-2 py-1 text-xs font-semibold text-ink-muted hover:bg-hover hover:text-white">
                @
              </summary>
              <div className="absolute bottom-full left-0 z-20 mb-1 max-h-40 w-48 overflow-y-auto rounded-md border border-border bg-[#1a1a1a] p-1 shadow-lg">
                {users
                  .filter((u) => u.id !== currentUserId && u.role !== "Bot")
                  .map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      className="block w-full rounded px-2 py-1 text-left text-xs text-white hover:bg-hover"
                      onClick={() => insertMention(u.displayName)}
                    >
                      @{u.displayName}
                    </button>
                  ))}
              </div>
            </details>
          </div>
          <button
            type="button"
            title="Attach file"
            className="rounded px-2 py-1 text-xs text-ink-muted hover:bg-hover hover:text-white"
            onClick={() => fileRef.current?.click()}
          >
            📎
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.txt"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setAttachmentName(f.name);
            }}
          />
          {me && (
            <span className="ml-auto hidden font-mono text-[10px] text-ink-muted sm:inline">
              posting as @{me.displayName}
            </span>
          )}
        </div>
        {attachmentName && (
          <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-[11px] text-ink-muted">
            <span>📎 {attachmentName}</span>
            <button
              type="button"
              onClick={() => setAttachmentName(undefined)}
              className="hover:text-white"
            >
              remove
            </button>
          </div>
        )}
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder={defaultPlaceholder}
          className="block w-full resize-none bg-transparent px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-ink-muted/70"
        />
        <div className="flex items-center justify-between px-2 pb-2">
          <p className="hidden text-[11px] text-ink-muted sm:block">
            <kbd className="rounded border border-border px-1">Enter</kbd> send
            · AI operators reply in DMs & @mentions
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim() && !attachmentName}
            className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({
  label,
  title,
  italic,
  mono,
}: {
  label: string;
  title: string;
  italic?: boolean;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`rounded px-2 py-1 text-xs text-ink-muted hover:bg-hover hover:text-ink ${
        italic ? "italic" : ""
      } ${mono ? "font-mono" : "font-semibold"}`}
    >
      {label}
    </button>
  );
}
