"use client";

import { Sidebar } from "@/components/Sidebar";
import { MessagePane } from "@/components/MessagePane";
import { Composer } from "@/components/Composer";
import { ThreadPanel } from "@/components/ThreadPanel";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace";

function WorkspaceShell() {
  const { threadRootId } = useWorkspace();

  return (
    <div className="flex h-dvh overflow-hidden bg-chrome">
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
  );
}

export function Workspace() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}
