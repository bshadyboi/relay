# Zoox Fleet Ops — Workspace

Slack-style team chat remixed as a **Zoox remote fleet operations** work environment. Dark ops chrome, fleet channels, and roster pulled from the Zoox Fleet Ops simulation.

## Live

[https://relay-one-livid.vercel.app](https://relay-one-livid.vercel.app)

## Features

- **Ops channels** — `#fleet-ops-bay`, `#field-dispatch`, `#eng-oncall`, `#incidents`, `#shift-handoff`
- **Fleet status bar** — in-service / charging / incident counts
- **DMs** — operators, field tech, eng on-call, depot
- **Threads & reactions** — incident follow-ups without leaving channel context
- You play as **Brandon Peralta** (Remote Fleet Operator · Bay-2)

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npx vercel --prod
```

Simulated environment only — not affiliated with Zoox.
