"use client";

import { parseMessageParts } from "@/lib/parseMessage";
import { getIncidentByTicket } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function MessageBody({
  text,
  attachmentName,
}: {
  text: string;
  attachmentName?: string;
}) {
  const { setDetail, currentUserId, users } = useWorkspace();
  const me = users.find((u) => u.id === currentUserId);
  const parts = parseMessageParts(text);

  return (
    <div>
      <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.5] text-ink">
        {parts.map((part, i) => {
          if (part.type === "text") return <span key={i}>{part.value}</span>;
          if (part.type === "mention") {
            const mine =
              me &&
              part.value.toLowerCase() === `@${me.displayName.toLowerCase()}`;
            return (
              <span
                key={i}
                className={`rounded px-0.5 font-semibold ${
                  mine
                    ? "bg-amber-500/20 text-amber-100"
                    : "bg-white/10 text-white"
                }`}
              >
                {part.value}
              </span>
            );
          }
          if (part.type === "incident") {
            const inc = getIncidentByTicket(part.value);
            return (
              <button
                key={i}
                type="button"
                onClick={() =>
                  inc && setDetail({ kind: "incident", id: inc.id })
                }
                className="mx-0.5 inline-flex items-center rounded border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-red-200 hover:bg-red-500/20"
              >
                {part.value}
              </button>
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => setDetail({ kind: "vehicle", id: part.value })}
              className="mx-0.5 inline-flex items-center rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-white hover:bg-white/10"
            >
              {part.value}
            </button>
          );
        })}
      </p>
      {attachmentName && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-border bg-black/40 px-2.5 py-1.5 font-mono text-[11px] text-ink-muted">
          <span aria-hidden>📎</span>
          <span className="text-white">{attachmentName}</span>
          <span>(local preview)</span>
        </div>
      )}
    </div>
  );
}
