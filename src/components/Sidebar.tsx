"use client";

import { CURRENT_USER_ID, getUser, users, workspace } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

function PresenceDot({
  presence,
}: {
  presence: "active" | "away" | "dnd" | "offline";
}) {
  const color =
    presence === "active"
      ? "bg-presence-active"
      : presence === "away"
        ? "bg-presence-away"
        : presence === "dnd"
          ? "bg-presence-dnd"
          : "bg-presence-offline";
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar ${color}`}
      aria-hidden
    />
  );
}

export function Sidebar() {
  const {
    channels,
    directMessages,
    active,
    setActive,
    sidebarOpen,
    setSidebarOpen,
  } = useWorkspace();
  const me = getUser(CURRENT_USER_ID)!;
  const online = users.filter((u) => u.presence === "active").length;

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
          <button
            type="button"
            className="group flex min-w-0 items-center gap-2.5 text-left"
          >
            <ZooxMark />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold tracking-tight text-white">
                {workspace.name}
              </span>
              <span className="block truncate text-[10px] uppercase tracking-widest text-sidebar-muted">
                {workspace.subtitle}
              </span>
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
          <nav className="mb-4 space-y-0.5 px-2 text-[13px] text-sidebar-muted">
            <SidebarLink icon={<FleetIcon />} label="Fleet floor" />
            <SidebarLink icon={<IncidentIcon />} label="Incidents" badge={2} />
            <SidebarLink icon={<DispatchIcon />} label="Dispatch" />
            <SidebarLink icon={<ActivityIcon />} label="Activity" />
          </nav>

          <Section title="Ops channels">
            {channels.map((ch) => {
              const isActive =
                active.type === "channel" && active.id === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActive({ type: "channel", id: ch.id })}
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

          <Section title="Direct messages">
            {directMessages.map((dm) => {
              const user = getUser(dm.userId)!;
              const isActive = active.type === "dm" && active.id === dm.id;
              return (
                <button
                  key={dm.id}
                  type="button"
                  onClick={() => setActive({ type: "dm", id: dm.id })}
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
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      (dm.unread ?? 0) > 0 && !isActive
                        ? "font-semibold text-white"
                        : ""
                    }`}
                  >
                    {user.name}
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
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/5">
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
                {me.title}
              </div>
            </div>
          </div>
          <p className="mt-1 px-2 font-mono text-[10px] text-sidebar-muted">
            {online} operators online · PST
          </p>
        </div>
      </aside>
    </>
  );
}

function ZooxMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white text-[13px] font-black tracking-tighter text-black">
      Z
    </span>
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
      <div className="mb-1 flex items-center justify-between px-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
          {title}
        </span>
        <span className="text-sidebar-muted opacity-70" aria-hidden>
          +
        </span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/5 hover:text-white"
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="rounded bg-urgent px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function FleetIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 17h18M5 17l1.5-7h11L19 17M8 17v2m8-2v2M7 10l1-4h8l1 4" />
    </svg>
  );
}

function IncidentIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

function DispatchIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.894L9 2m0 18l6-3m-6 3V2m6 15l5.447 2.724A2 2 0 0021 18.382V9.618a2 2 0 00-1.553-1.894L15 5m0 12V5" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0" />
    </svg>
  );
}
