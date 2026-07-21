"use client";

import { useEffect } from "react";
import { AlertToasts } from "@/components/AlertToasts";
import { Composer } from "@/components/Composer";
import { DetailPanel } from "@/components/DetailPanel";
import { Login } from "@/components/Login";
import { MessagePane } from "@/components/MessagePane";
import { RosterDrawer } from "@/components/RosterDrawer";
import { RunbooksDrawer } from "@/components/RunbooksDrawer";
import { PinsDrawer, SearchModal } from "@/components/SearchModal";
import { ShiftClockIn, ShiftHandoff } from "@/components/ShiftFlow";
import { Sidebar } from "@/components/Sidebar";
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
  } = useWorkspace();
  const open = incidents.filter((i) => i.stage !== "resolved").length;
  const online = users.filter(
    (u) => u.presence === "active" || u.presence === "assist",
  ).length;

  return (
    <div className="flex h-9 shrink-0 items-center gap-3 overflow-x-auto border-b border-border bg-black px-3 font-mono text-[10px] text-ink-muted scrollbar-thin">
      <span className="flex items-center gap-1.5 text-white">
        <span className="size-1.5 animate-pulse-dot rounded-full bg-presence-active" />
        {liveTrafficOn ? "LIVE" : "PAUSED"}
      </span>
      <Stat label="In service" value="14" color="text-presence-active" />
      <Stat label="Online" value={String(online)} />
      <Stat label="Incidents" value={String(open)} color="text-urgent" pulse />
      {mentionCount > 0 && (
        <Stat
          label="Mentions"
          value={String(mentionCount)}
          color="text-amber-300"
        />
      )}
      <span className="ml-auto hidden items-center gap-3 sm:flex">
        <span>{OFFICE.label}</span>
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
      if (e.key === "Escape") {
        setSearchOpen(false);
        setRunbooksOpen(false);
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
