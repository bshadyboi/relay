"use client";

import type { Presence, ShiftBlock, User } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace";

function PresenceDot({ presence }: { presence: Presence }) {
  const color =
    presence === "active"
      ? "bg-presence-active"
      : presence === "away"
        ? "bg-presence-away"
        : presence === "dnd"
          ? "bg-presence-dnd"
          : presence === "assist"
            ? "bg-blue-400"
            : "bg-presence-offline";
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface ${color}`}
    />
  );
}

export function RosterDrawer() {
  const {
    rosterOpen,
    setRosterOpen,
    users,
    profileUserId,
    setProfileUserId,
    openDm,
    currentUserId,
  } = useWorkspace();

  if (!rosterOpen && !profileUserId) return null;

  const people = users.filter((u) => u.role !== "Bot");
  const byShift = (shift: ShiftBlock) =>
    people.filter((u) => u.shift === shift);

  const profile = profileUserId
    ? users.find((u) => u.id === profileUserId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close roster"
        onClick={() => {
          setRosterOpen(false);
          setProfileUserId(null);
        }}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface animate-slide-in">
        <header className="flex h-12 items-center justify-between border-b border-border px-4">
          <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
            {profile ? "Operator" : "Team roster"}
          </h2>
          <button
            type="button"
            className="text-ink-muted hover:text-white"
            onClick={() => {
              if (profile) setProfileUserId(null);
              else setRosterOpen(false);
            }}
          >
            {profile ? "←" : "✕"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {profile ? (
            <ProfileCard
              user={profile}
              isMe={profile.id === currentUserId}
              onMessage={() => openDm(profile.id)}
            />
          ) : (
            <>
              <p className="mb-4 font-mono text-[10px] text-ink-muted">
                {people.filter((u) =>
                  ["active", "assist"].includes(u.presence),
                ).length}{" "}
                on floor · 1600 Bryant St
              </p>
              {(["Day", "Swing", "Night"] as ShiftBlock[]).map((shift) => (
                <div key={shift} className="mb-5">
                  <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {shift} shift
                  </h3>
                  <div className="space-y-1">
                    {byShift(shift).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setProfileUserId(u.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-hover"
                      >
                        <span className="relative">
                          <span className="flex size-8 items-center justify-center rounded border border-white/10 bg-avatar font-mono text-[10px] font-bold text-white">
                            {u.avatar}
                          </span>
                          <PresenceDot presence={u.presence} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-white">
                            {u.name}
                          </span>
                          <span className="block truncate font-mono text-[10px] text-ink-muted">
                            {u.bay ?? "—"} · {u.role}
                          </span>
                        </span>
                        {u.presence === "assist" && (
                          <span className="font-mono text-[9px] text-blue-300">
                            assist
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function ProfileCard({
  user,
  isMe,
  onMessage,
}: {
  user: User;
  isMe: boolean;
  onMessage: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="relative">
          <span className="flex size-14 items-center justify-center rounded-lg border border-white/10 bg-avatar font-mono text-sm font-bold text-white">
            {user.avatar}
          </span>
          <PresenceDot presence={user.presence} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-white">{user.name}</h3>
          <p className="font-mono text-[11px] text-ink-muted">
            @{user.displayName}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3 rounded-lg border border-border bg-black/40 p-3 font-mono text-[11px]">
        <Row label="Role" value={user.role ?? user.title ?? "—"} />
        <Row label="Badge" value={user.badgeId ?? "—"} />
        <Row label="Shift" value={user.shift ?? "—"} />
        <Row label="Bay" value={user.bay ?? "—"} />
        <Row label="Status" value={user.status ?? user.presence} />
        <Row label="Email" value={user.email ?? "—"} />
      </div>
      {!isMe && (
        <button
          type="button"
          onClick={onMessage}
          className="mt-4 w-full rounded-md bg-white py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          Message {user.name.split(" ")[0]}
        </button>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
