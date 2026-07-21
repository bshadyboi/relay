"use client";

import { Composer } from "@/components/Composer";
import { MessagePane } from "@/components/MessagePane";
import { Sidebar } from "@/components/Sidebar";
import { ThreadPanel } from "@/components/ThreadPanel";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace";

function OpsStatusBar() {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 overflow-x-auto border-b border-border bg-black px-3 font-mono text-[10px] text-ink-muted scrollbar-thin">
      <span className="flex items-center gap-1.5 text-white">
        <span className="size-1.5 rounded-full bg-presence-active animate-pulse-dot" />
        LIVE
      </span>
      <Stat label="In service" value="14" color="text-presence-active" />
      <Stat label="Idle" value="3" />
      <Stat label="Charging" value="2" color="text-blue-400" />
      <Stat label="Maintenance" value="1" color="text-amber-400" />
      <Stat label="Incidents" value="2" color="text-urgent" pulse />
      <span className="ml-auto hidden text-ink-muted sm:inline">
        Foster City · PST · Shift Day
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

function WorkspaceShell() {
  const { threadRootId } = useWorkspace();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-chrome">
      <OpsStatusBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1">
            <div className="flex min-w-0 flex-1 flex-col">
              <MessagePane />
              <Composer />
            </div>
            {threadRootId && <ThreadPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Workspace() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}
