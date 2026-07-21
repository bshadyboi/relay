# Zoox Fleet Ops — Workspace

Slack-style ops chat for **Zoox Fleet Operations** at **1600 Bryant St, San Francisco**.

## Live

- **[https://zoox-workspace.vercel.app](https://zoox-workspace.vercel.app)** — this Slack-style ops chat
- Fleet Operations Center stays at [https://zoox-fleet-ops.vercel.app](https://zoox-fleet-ops.vercel.app) (separate project)

## Features

- **AI operators** — DMs and `@mentions` get real replies (typing indicator included)
- Login / shift clock-in / handoff
- Incident + vehicle chips, search, pins, runbooks, roster
- Live floor traffic, status picker, pager sounds

## AI replies

Works out of the box with a local persona engine.

For smarter LLM replies, set one of:

```bash
# .env.local
OPENAI_API_KEY=sk-...
# optional
OPENAI_MODEL=gpt-4o-mini

# or
ANTHROPIC_API_KEY=...
```

On Vercel: Project → Settings → Environment Variables → add `OPENAI_API_KEY`, redeploy.

## Demo login

| Email | Password |
| --- | --- |
| `bperalta1@zoox.com` | `demo1234` |
| `sokonkwo@zoox.com` | `demo1234` |
| `mchen@zoox.com` | `demo1234` |
| `pnair@zoox.com` | `demo1234` |

## Run

```bash
npm install
npm run dev
```

Try: DM Sarah → “Can you check ZX-1199?” or in `#fleet-ops-bay` send `@sokonkwo need eyes on cams`.

Simulated environment only — not affiliated with Zoox.
