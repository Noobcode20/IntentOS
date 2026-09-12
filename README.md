# Focus Companion

One app, two windows:

1. **Dashboard** — a normal window with your task list, connection
   settings, and session history.
2. **Floating pet** — a small transparent, always-on-top window that
   sits over your other apps.

Both windows are opened by the same app and share the same state — the
app itself talks to your friend's backend once, then updates whichever
windows are open. Setting the API URL in the dashboard is enough; the
floating pet automatically stays in sync, no separate config needed.

## Running it (Mac)

You'll need [Node.js](https://nodejs.org) installed (one-time).

```bash
cd focus-companion-app
npm install
npm start
```

This opens the dashboard window plus the floating pet near the
bottom-right of your screen. The pet stays on top of everything else,
even across full-screen apps and different spaces. Click and drag it
anywhere you like.

## Connecting it to your friend's backend

The app expects a `GET {api_url}/status` endpoint that returns one of:

```json
{ "mood": 72 }
```
or
```json
{ "status": "productive" }   // or "unproductive" / "ambiguous"
```

Set the API URL in the dashboard's settings panel and hit Save — the
app starts polling immediately and both windows update together.

## Notes

- The dashboard remembers your tasks and last-used settings between
  runs (stored locally on your machine).
- If the backend isn't reachable, both windows just idle at a neutral
  mood instead of erroring out — safe to run before the backend exists.
- The demo buttons ("On task" / "Off task") nudge the shared mood, so
  you'll see both windows react together even without a backend.
- To make the app launch automatically at login, you can later package
  it as a `.app` with `electron-builder` — `npm start` is enough for
  testing now.
