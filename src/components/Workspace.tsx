"use client";

import { useEffect } from "react";
import { AlertToasts } from "@/components/AlertToasts";
import { Composer } from "@/components/Composer";
import { DetailPanel } from "@/components/DetailPanel";
import { Login } from "@/components/Login";
import { MentionsPanel } from "@/components/MentionsPanel";
import { MessagePane } from "@/components/MessagePane";
import { RosterDrawer } from "@/components/RosterDrawer";
import { RunbooksDrawer } from "@/components/RunbooksDrawer";
import { PinsDrawer, SearchModal } from "@/components/SearchModal";
import { ShiftClockIn, ShiftHandoff } from "@/components/ShiftFlow";
import { Sidebar } from "@/components/Sidebar";
import { StatusPicker } from "@/components/StatusPicker";
import { ThreadPanel } from "@/components/ThreadPanel";
import { OFFICE } from "@/lib/data";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace";

function OpsStatusBar() {
  const {
    incidents,
    requestHandoff,
    setSearchOpen,
    mentionCount,
    users,
    liveTrafficOn,
    setRosterOpen,
    setMentionsOpen,
    setStatusPickerOpen,
    currentUserId,
    shift,
    soundOn,
  } = useWorkspace();
  const open = incidents.filter((i) => i.stage !== "resolved").length;
  const online = users.filter(
    (u) => u.presence === "active" || u.presence === "assist",
  ).length;
  const me = users.find((u) => u.id === currentUserId);
  const mins = shift
    ? Math.max(
        1,
        Math.round((Date.now() - new Date(shift.startedAt).getTime()) / 60_000),
      )
    : 0;

  return (
    <div className="flex h-10 shrink-0 items-center gap-3 overflow-x-auto border-b border-border bg-gradient-to-r from-black via-[#0a0a0a] to-black px-3 font-mono text-[10px] text-ink-muted scrollbar-thin">
      <span className="flex items-center gap-1.5 text-white">
        <span
          className={`size-1.5 rounded-full ${
            liveTrafficOn
              ? "animate-pulse-dot bg-presence-active"
              : "bg-zinc-600"
          }`}
        />
        {liveTrafficOn ? "LIVE FLOOR" : "PAUSED"}
      </span>
      <Stat label="Online" value={String(online)} color="text-presence-active" />
      <Stat label="Incidents" value={String(open)} color="text-urgent" pulse={open > 0} />
      <button
        type="button"
        onClick={() => setMentionsOpen(true)}
        className="inline-flex items-center gap-1.5 hover:text-white"
      >
        <span className={mentionCount > 0 ? "text-amber-300" : ""}>Mentions</span>
        <span
          className={`rounded border px-1.5 py-0.5 font-semibold ${
            mentionCount > 0
              ? "border-amber-500/40 bg-amber-500/15 text-amber-100"
              : "border-border bg-surface text-white"
          }`}
        >
          {mentionCount}
        </span>
      </button>
      <span className="hidden text-ink-muted lg:inline">Shift {mins}m</span>
      <span className="ml-auto hidden items-center gap-2 sm:flex">
        <button
          type="button"
          onClick={() => setStatusPickerOpen(true)}
          className="max-w-[180px] truncate rounded border border-border px-2 py-0.5 text-left hover:border-white/25 hover:text-white"
          title="Set status"
        >
          {me?.status ?? "Set status"}
        </button>
        <span className="text-ink-muted">{OFFICE.label}</span>
        <span className="rounded border border-border px-1.5 py-0.5">
          {soundOn ? "🔊" : "🔇"}
        </span>
        <button
          type="button"
          onClick={() => setRosterOpen(true)}
          className="rounded border border-border px-1.5 py-0.5 hover:text-white"
        >
          Roster
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="rounded border border-border px-1.5 py-0.5 hover:text-white"
        >
          ⌘K
        </button>
        <button
          type="button"
          onClick={requestHandoff}
          className="rounded border border-border px-1.5 py-0.5 hover:text-white"
        >
          End shift
        </button>
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  pulse,
}: {
  label: string;
  value: string;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className={color ?? "text-ink-muted"}>{label}</span>
      <span
        className={`rounded border border-border bg-surface px-1.5 py-0.5 font-semibold text-white ${
          pulse ? "animate-pulse-dot" : ""
        }`}
      >
        {value}
      </span>
    </span>
  );
}

function Shortcuts() {
  const {
    setSearchOpen,
    setRunbooksOpen,
    setThreadRootId,
    setDetail,
    setSidebarOpen,
    setMentionsOpen,
    setStatusPickerOpen,
    setRosterOpen,
    screen,
  } = useWorkspace();

  useEffect(() => {
    if (screen !== "workspace") return;
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (meta && e.key.toLowerCase() === "u") {
        e.preventDefault();
        setMentionsOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setRunbooksOpen(false);
        setMentionsOpen(false);
        setStatusPickerOpen(false);
        setRosterOpen(false);
        setThreadRootId(null);
        setDetail(null);
        setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    screen,
    setSearchOpen,
    setRunbooksOpen,
    setThreadRootId,
    setDetail,
    setSidebarOpen,
    setMentionsOpen,
    setStatusPickerOpen,
    setRosterOpen,
  ]);

  return null;
}

function WorkspaceShell() {
  const { threadRootId, detail } = useWorkspace();
  const sideOpen = !!threadRootId || !!detail;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-chrome">
      <OpsStatusBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div
              className={`flex min-w-0 flex-1 flex-col ${
                sideOpen ? "hidden md:flex" : "flex"
              }`}
            >
              <MessagePane />
              <Composer />
            </div>
            {threadRootId && <ThreadPanel />}
            {detail && !threadRootId && <DetailPanel />}
          </div>
        </main>
      </div>
      <SearchModal />
      <PinsDrawer />
      <RunbooksDrawer />
      <RosterDrawer />
      <MentionsPanel />
      <StatusPicker />
      <AlertToasts />
      <Shortcuts />
    </div>
  );
}

function AppRouter() {
  const { screen } = useWorkspace();
  if (screen === "login") return <Login />;
  if (screen === "clock-in") return <ShiftClockIn />;
  if (screen === "handoff") return <ShiftHandoff />;
  return <WorkspaceShell />;
}

export function Workspace() {
  return (
    <WorkspaceProvider>
      <AppRouter />
    </WorkspaceProvider>
  );
}
