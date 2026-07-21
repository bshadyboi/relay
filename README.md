# Zoox Fleet Ops — Workspace

Slack-style ops chat for **Zoox Fleet Operations** at **1600 Bryant St, San Francisco**.

## Live

- **[https://zoox-ops.vercel.app](https://zoox-ops.vercel.app)** (primary)
- [https://zoox-workspace.vercel.app](https://zoox-workspace.vercel.app)

## Features

- Login as Brandon / Sarah / Field Tech / Eng (`demo1234`)
- Shift clock-in + handoff notes posted to `#shift-handoff`
- Incident chips (`INC-8842`) and vehicle chips (`ZX-1199`) in messages
- Search (`⌘K`), pins, runbooks, PagerDuty toasts
- @mentions, file attach (local preview), remote-assist presence
- Ops status bar · Bryant site

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

Simulated environment only — not affiliated with Zoox.
