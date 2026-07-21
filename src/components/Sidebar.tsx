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

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-sidebar text-sidebar-fg transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-white/10 px-4">
          <button
            type="button"
            className="group flex items-center gap-2 truncate text-left"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded bg-white/15 text-sm font-bold text-white">
              {workspace.initial}
            </span>
            <span className="truncate text-[15px] font-bold tracking-tight text-white group-hover:underline">
              {workspace.name}
            </span>
            <ChevronDown className="size-3.5 shrink-0 opacity-70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
          <nav className="mb-4 space-y-0.5 px-2 text-[13px] text-sidebar-muted">
            <SidebarLink icon={<HomeIcon />} label="Home" />
            <SidebarLink icon={<DMsIcon />} label="DMs" />
            <SidebarLink icon={<ActivityIcon />} label="Activity" />
            <SidebarLink icon={<LaterIcon />} label="Later" />
          </nav>

          <Section title="Channels">
            {channels.map((ch) => {
              const isActive =
                active.type === "channel" && active.id === ch.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setActive({ type: "channel", id: ch.id })}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[15px] transition-colors ${
                    isActive
                      ? "bg-sidebar-active text-white"
                      : "text-sidebar-fg/90 hover:bg-white/10"
                  }`}
                >
                  <span className="w-4 shrink-0 text-center opacity-80">
                    {ch.isPrivate ? "🔒" : "#"}
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      (ch.unread ?? 0) > 0 && !isActive ? "font-bold text-white" : ""
                    }`}
                  >
                    {ch.name}
                  </span>
                  {(ch.unread ?? 0) > 0 && !isActive && (
                    <span className="rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
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
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-[15px] transition-colors ${
                    isActive
                      ? "bg-sidebar-active text-white"
                      : "text-sidebar-fg/90 hover:bg-white/10"
                  }`}
                >
                  <span className="relative shrink-0">
                    <span className="flex size-5 items-center justify-center rounded text-[10px] font-semibold bg-avatar text-white">
                      {user.avatar}
                    </span>
                    <PresenceDot presence={user.presence} />
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      (dm.unread ?? 0) > 0 && !isActive ? "font-bold text-white" : ""
                    }`}
                  >
                    {user.name}
                  </span>
                  {(dm.unread ?? 0) > 0 && !isActive && (
                    <span className="rounded-full bg-accent px-1.5 text-[11px] font-bold text-white">
                      {dm.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </Section>
        </div>

        <div className="border-t border-white/10 p-2">
          <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/10">
            <span className="relative">
              <span className="flex size-9 items-center justify-center rounded bg-avatar text-xs font-bold text-white">
                {me.avatar}
              </span>
              <PresenceDot presence={me.presence} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">
                {me.name}
              </div>
              <div className="truncate text-xs text-sidebar-muted">
                {me.status ?? me.title}
              </div>
            </div>
          </div>
          <p className="mt-1 px-2 text-[11px] text-sidebar-muted/80">
            {users.filter((u) => u.presence === "active").length} online
          </p>
        </div>
      </aside>
    </>
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
        <span className="text-[13px] font-medium text-sidebar-muted">
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
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5V21a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1v-10.5z" />
    </svg>
  );
}

function DMsIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 01-4.1-.98L3 21l1.1-3.86A8.96 8.96 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
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

function LaterIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  );
}
