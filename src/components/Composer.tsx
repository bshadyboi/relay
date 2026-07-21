"use client";

import { useEffect, useRef, useState } from "react";
import { channels, directMessages, getUser } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function Composer({
  threadId,
  placeholder,
}: {
  threadId?: string;
  placeholder?: string;
}) {
  const { sendMessage, active } = useWorkspace();
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

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
    if (!text.trim()) return;
    sendMessage(text, threadId);
    setText("");
  }

  return (
    <div className="shrink-0 px-3 pb-3 pt-1 sm:px-4">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm focus-within:border-ink-muted/40 focus-within:shadow-md transition-shadow">
        <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
          <ToolBtn label="B" title="Bold" />
          <ToolBtn label="I" title="Italic" italic />
          <ToolBtn label="<>" title="Code" mono />
          <span className="mx-1 h-4 w-px bg-border" />
          <ToolBtn label="@" title="Mention" />
          <ToolBtn label="😊" title="Emoji" />
        </div>
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
            <kbd className="rounded border border-border px-1">Enter</kbd> to
            send ·{" "}
            <kbd className="rounded border border-border px-1">Shift</kbd>+
            <kbd className="rounded border border-border px-1">Enter</kbd> for
            newline
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim()}
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
