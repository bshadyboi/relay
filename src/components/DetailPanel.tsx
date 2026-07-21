"use client";

import { useWorkspace } from "@/lib/workspace";

export function DetailPanel() {
  const {
    detail,
    setDetail,
    incidents,
    vehicles,
    acknowledgeIncident,
    resolveIncident,
    setAssistStatus,
  } = useWorkspace();

  if (!detail) return null;

  if (detail.kind === "incident") {
    const inc = incidents.find((i) => i.id === detail.id);
    if (!inc) return null;
    const vehicle = vehicles.find((v) => v.id === inc.vehicleId);

    return (
      <aside className="flex w-full max-w-full flex-col border-l border-border bg-surface animate-slide-in md:w-[360px]">
        <Header title="Incident" onClose={() => setDetail(null)} />
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <p className="font-mono text-[11px] text-urgent">{inc.ticketId}</p>
          <h3 className="mt-1 text-base font-semibold text-white">{inc.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px]">
            <Pill>{inc.stage.replace("_", " ")}</Pill>
            <Pill>{inc.severity}</Pill>
            <Pill>{inc.assignee}</Pill>
          </div>
          <p className="mt-4 text-sm text-ink-muted">{inc.summary}</p>
          <Row label="Location" value={inc.location} />
          <Row label="Vehicle" value={inc.vehicleId} />
          {vehicle && (
            <button
              type="button"
              className="mt-2 text-left font-mono text-[11px] text-white/70 underline hover:text-white"
              onClick={() => setDetail({ kind: "vehicle", id: vehicle.id })}
            >
              Open vehicle card →
            </button>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {inc.stage === "open" && (
              <button
                type="button"
                onClick={() => acknowledgeIncident(inc.id)}
                className="rounded-md bg-white py-2 text-sm font-semibold text-black"
              >
                Acknowledge
              </button>
            )}
            {inc.stage !== "resolved" && (
              <button
                type="button"
                onClick={() => {
                  setAssistStatus(true);
                  resolveIncident(inc.id);
                }}
                className="rounded-md border border-border py-2 text-sm text-ink-muted hover:text-white"
              >
                Mark resolved
              </button>
            )}
          </div>
        </div>
      </aside>
    );
  }

  const vehicle = vehicles.find((v) => v.id === detail.id);
  if (!vehicle) return null;
  const linked = incidents.find(
    (i) => i.vehicleId === vehicle.id && i.stage !== "resolved",
  );

  return (
    <aside className="flex w-full max-w-full flex-col border-l border-border bg-surface animate-slide-in md:w-[360px]">
      <Header title="Vehicle" onClose={() => setDetail(null)} />
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <p className="font-mono text-[11px] text-ink-muted">{vehicle.nickname}</p>
        <h3 className="mt-1 text-base font-semibold text-white">{vehicle.id}</h3>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px]">
          <Pill>{vehicle.status}</Pill>
          <Pill>{vehicle.battery}% batt</Pill>
          <Pill>{vehicle.speed} mph</Pill>
        </div>
        <Row label="Route" value={vehicle.route} />
        <Row label="Location" value={vehicle.location} />
        <Row label="Operator" value={vehicle.operator ?? "Unassigned"} />
        {vehicle.alerts.length > 0 && (
          <div className="mt-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Alerts
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-200/90">
              {vehicle.alerts.map((a) => (
                <li key={a}>• {a}</li>
              ))}
            </ul>
          </div>
        )}
        {linked && (
          <button
            type="button"
            className="mt-4 font-mono text-[11px] text-urgent underline"
            onClick={() => setDetail({ kind: "incident", id: linked.id })}
          >
            Open {linked.ticketId} →
          </button>
        )}
        <button
          type="button"
          onClick={() => setAssistStatus(true)}
          className="mt-6 w-full rounded-md bg-white py-2 text-sm font-semibold text-black"
        >
          Start remote assist
        </button>
      </div>
    </aside>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
      <h2 className="font-mono text-[12px] font-semibold uppercase tracking-wider text-white">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="rounded p-1.5 text-ink-muted hover:bg-hover"
        aria-label="Close"
      >
        ✕
      </button>
    </header>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border bg-black/40 px-1.5 py-0.5 uppercase text-ink-muted">
      {children}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-white">{value}</div>
    </div>
  );
}
