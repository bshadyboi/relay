# Relay

A Slack-inspired team chat workspace built with Next.js, React, and Tailwind CSS.

## Features

- **Channels & DMs** — switch between public/private channels and direct messages
- **Messaging** — send messages with Enter; Shift+Enter for newlines
- **Threads** — open a reply thread from any message
- **Reactions** — hover a message to add emoji reactions
- **Presence** — online / away / DND / offline indicators
- **Unread badges** — clear when you open a conversation
- **Responsive** — collapsible sidebar on mobile

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run lint` | Lint                     |

## Notes

Messages and reactions are stored in client state for demo purposes — refresh resets to seed data. You play as **Alex Rivera**.
