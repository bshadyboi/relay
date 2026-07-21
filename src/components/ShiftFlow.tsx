"use client";

import { OFFICE } from "@/lib/data";
import { useWorkspace } from "@/lib/workspace";

export function ShiftClockIn() {
  const { session, clockIn, logout, incidents } = useWorkspace();
  const open = incidents.filter((i) => i.stage !== "resolved").length;

  return (
    <div className="flex min-h-dvh flex-col bg-black text-ink">
      <header className="border-b border-border px-6 py-4">
        <div className="font-bold tracking-[0.35em] text-white">ZOOX</div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            Start of shift
          </p>
          <h1 className="mt-2 text-2xl font-light text-white">
            Welcome, {session?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {session?.role} · {session?.badgeId}
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Ops floor · {OFFICE.address}, {OFFICE.city}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Open incidents" value={String(open)} />
            <Stat label="Bay" value="Bay-2" />
            <Stat label="Site" value="Bryant" />
          </div>

          <div className="mt-6 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/90">
            Incoming handoff: INC-8842 in progress · HD-4421 telemetry gap ·
            ZX-1178 staged for Route 14.
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={clockIn}
              className="flex-1 rounded-md bg-white py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Clock in
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-border px-4 py-3 text-sm text-ink-muted hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export function ShiftHandoff() {
  const {
    session,
    shift,
    handoffNotes,
    setHandoffNotes,
    endShift,
    continueShift,
  } = useWorkspace();

  const durationMin = shift
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(shift.startedAt).getTime()) / 60_000,
        ),
      )
    : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-black text-ink">
      <header className="border-b border-border px-6 py-4">
        <div className="font-bold tracking-[0.35em] text-white">ZOOX</div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
            End of shift
          </p>
          <h1 className="mt-2 text-2xl font-light text-white">Handoff notes</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {session?.name} · {durationMin} min on floor · {OFFICE.address}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Messages" value={String(shift?.messagesSent ?? 0)} />
            <Stat
              label="Incidents ack"
              value={String(shift?.incidentsAcknowledged ?? 0)}
            />
            <Stat label="Assists" value={String(shift?.assists ?? 0)} />
            <Stat label="Site" value="Bryant" />
          </div>

          <label className="mt-6 mb-2 block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Notes for next operator
          </label>
          <textarea
            value={handoffNotes}
            onChange={(e) => setHandoffNotes(e.target.value)}
            rows={5}
            placeholder="Open holds, vehicles to watch, depot notes…"
            className="w-full resize-none rounded-md border border-border bg-black px-3 py-2 font-mono text-xs text-white outline-none focus:border-white/30"
          />

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => endShift(handoffNotes)}
              className="flex-1 rounded-md bg-white py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Post handoff & clock out
            </button>
            <button
              type="button"
              onClick={continueShift}
              className="rounded-md border border-border px-4 py-3 text-sm text-ink-muted hover:text-white"
            >
              Stay on shift
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-black/40 px-3 py-2">
      <div className="font-mono text-[10px] text-ink-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
