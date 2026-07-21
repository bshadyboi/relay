"use client";

import { workspace } from "@/lib/data";
import type { Channel, Presence } from "@/lib/types";
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
      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar ${color}`}
      aria-hidden
    />
  );
}

const SECTION_LABELS: Record<string, string> = {
  ops: "Ops",
  field: "Field",
  eng: "Eng",
  social: "Social",
};

export function Sidebar() {
  const {
    channels,
    directMessages,
    active,
    setActive,
    sidebarOpen,
    setSidebarOpen,
    users,
    currentUserId,
    mentionCount,
    requestHandoff,
    logout,
    setAssistStatus,
    setRosterOpen,
    setProfileUserId,
    liveTrafficOn,
    setLiveTrafficOn,
    setMentionsOpen,
    setStatusPickerOpen,
    soundOn,
    setSoundOn,
  } = useWorkspace();
  const me = users.find((u) => u.id === currentUserId)!;
  const online = users.filter(
    (u) => u.presence === "active" || u.presence === "assist",
  ).length;

  const sections = ["ops", "field", "eng", "social"] as const;

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-sidebar text-sidebar-fg transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white text-[13px] font-black tracking-tighter text-black">
              Z
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold tracking-tight text-white">
                {workspace.name}
              </span>
              <span className="block truncate text-[10px] uppercase tracking-widest text-sidebar-muted">
                {workspace.subtitle}
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
          <nav className="mb-4 space-y-0.5 px-2 text-[13px] text-sidebar-muted">
            <SidebarLink
              label="Team roster"
              onClick={() => setRosterOpen(true)}
            />
            <SidebarLink
              label="Mentions"
              badge={mentionCount || undefined}
              onClick={() => setMentionsOpen(true)}
            />
            <SidebarLink
              label="Set status"
              onClick={() => setStatusPickerOpen(true)}
            />
            <SidebarLink
              label={me.presence === "assist" ? "End assist" : "Start assist"}
              onClick={() => setAssistStatus(me.presence !== "assist")}
            />
            <SidebarLink
              label={liveTrafficOn ? "Live traffic · on" : "Live traffic · off"}
              onClick={() => setLiveTrafficOn(!liveTrafficOn)}
            />
            <SidebarLink
              label={soundOn ? "Alert sound · on" : "Alert sound · off"}
              onClick={() => setSoundOn(!soundOn)}
            />
            <SidebarLink label="End shift" onClick={requestHandoff} />
          </nav>

          {sections.map((section) => {
            const list = channels.filter((c) => c.section === section);
            if (!list.length) return null;
            return (
              <ChannelSection
                key={section}
                title={SECTION_LABELS[section]}
                channels={list}
                active={active}
                onSelect={(id) => setActive({ type: "channel", id })}
              />
            );
          })}

          <Section title="Direct messages">
            {directMessages.map((dm) => {
              const user = users.find((u) => u.id === dm.userId)!;
              const isActive = active.type === "dm" && active.id === dm.id;
              return (
                <button
                  key={dm.id}
                  type="button"
                  onClick={() => setActive({ type: "dm", id: dm.id })}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setProfileUserId(user.id);
                  }}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[14px] transition-colors ${
                    isActive
                      ? "bg-sidebar-active text-white"
                      : "text-sidebar-fg/90 hover:bg-white/5"
                  }`}
                >
                  <span className="relative shrink-0">
                    <span className="flex size-5 items-center justify-center rounded border border-white/10 bg-avatar font-mono text-[9px] font-semibold text-white">
                      {user.avatar}
                    </span>
                    <PresenceDot presence={user.presence} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {user.name}
                    {user.presence === "assist" && (
                      <span className="ml-1 font-mono text-[9px] text-blue-300">
                        assist
                      </span>
                    )}
                  </span>
                  {(dm.unread ?? 0) > 0 && !isActive && (
                    <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                      {dm.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </Section>
        </div>

        <div className="border-t border-border p-2">
          <button
            type="button"
            onClick={() => setStatusPickerOpen(true)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5"
          >
            <span className="relative">
              <span className="flex size-9 items-center justify-center rounded border border-white/10 bg-avatar font-mono text-[11px] font-bold text-white">
                {me.avatar}
              </span>
              <PresenceDot presence={me.presence} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">
                {me.name}
              </div>
              <div className="truncate font-mono text-[10px] text-sidebar-muted">
                {me.status ?? me.title}
              </div>
            </div>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                logout();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  logout();
                }
              }}
              className="font-mono text-[10px] text-sidebar-muted hover:text-white"
            >
              out
            </span>
          </button>
          <p className="mt-1 px-2 font-mono text-[10px] text-sidebar-muted">
            {online} online · {users.filter((u) => u.role !== "Bot").length}{" "}
            roster · Bryant
          </p>
        </div>
      </aside>
    </>
  );
}

function ChannelSection({
  title,
  channels,
  active,
  onSelect,
}: {
  title: string;
  channels: Channel[];
  active: { type: string; id: string };
  onSelect: (id: string) => void;
}) {
  return (
    <Section title={title}>
      {channels.map((ch) => {
        const isActive = active.type === "channel" && active.id === ch.id;
        return (
          <button
            key={ch.id}
            type="button"
            onClick={() => onSelect(ch.id)}
            className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[14px] transition-colors ${
              isActive
                ? "bg-sidebar-active text-white"
                : "text-sidebar-fg/90 hover:bg-white/5"
            }`}
          >
            <span className="w-4 shrink-0 text-center font-mono text-[12px] text-sidebar-muted">
              {ch.isPrivate ? "🔒" : "#"}
            </span>
            <span
              className={`min-w-0 flex-1 truncate ${
                (ch.unread ?? 0) > 0 && !isActive
                  ? "font-semibold text-white"
                  : ""
              }`}
            >
              {ch.name}
            </span>
            {(ch.unread ?? 0) > 0 && !isActive && (
              <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black">
                {ch.unread}
              </span>
            )}
          </button>
        );
      })}
    </Section>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  label,
  badge,
  onClick,
}: {
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5 hover:text-white"
    >
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="rounded bg-urgent px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
