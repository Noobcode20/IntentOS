# Focus Companion

One app, two windows:

1. **Dashboard** — your task list, backend connection settings, a
   monitoring pause/resume toggle, session history, and the latest
   classification/reasoning from the backend.
2. **Floating pet** — a small transparent, always-on-top window that
   sits over your other apps and reflects the same mood.

## How it works

Every 15 seconds (configurable), the app:
1. Takes a screenshot of your primary screen (downscaled at capture
   time to keep it small — not full-res then resized).
2. Sends it, along with your current task list, to your friend's
   backend.
3. The backend forwards it to a vision LLM (via OpenRouter) and
   returns a classification.
4. The app updates the dashboard and the floating pet's mood
   accordingly.

The next capture only starts after the previous one fully finishes
(success, failure, or a 20-second timeout) — so a slow backend
response can't cause requests to pile up.

## Running it (Mac)

You'll need [Node.js](https://nodejs.org) installed (one-time).

```bash
cd focus-companion-app
npm install
npm start
```

**macOS only:** the first time you run this, macOS will ask for
Screen Recording permission (System Settings → Privacy & Security →
Screen Recording) — grant it to your terminal or the packaged app,
or screenshots will come back empty.

## The backend contract — send this to your friend

```
POST {api_url}/analyze
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,....",
  "tasks": ["task one", "task two"]
}
```

The `image` field is a full data URL — this can typically be passed
straight into OpenRouter's vision message content as-is.

**Expected response** — either shape works:

```json
{ "mood": 72 }
```
or
```json
{ "status": "productive", "reasoning": "Watching a lecture related to one of the listed tasks" }
```

`reasoning` is optional but recommended — it's what shows up in the
dashboard's "Last reading" panel, and it's useful for debugging why
the model classified something the way it did.

Set the API URL in the dashboard's settings panel and hit Save — the
app starts capturing immediately and both windows update together.

## Notes / things to be aware of

- **Privacy**: screenshots capture whatever's on your screen,
  including anything sensitive that happens to be visible (DMs,
  passwords, etc). Worth being mindful of what's open while this is
  running, especially during a live demo.
- **Multi-monitor**: only the first detected screen is captured for
  now — fine for a single-monitor setup or a hackathon demo, but
  worth knowing if you're presenting on a second display.
- Use the **Pause monitoring** button in the dashboard to stop
  screenshot capture without closing the app (useful for breaks or
  before opening anything you don't want captured).
- The dashboard remembers your tasks and last-used settings between
  runs (stored locally on your machine).
- If the backend isn't reachable, both windows just idle at a
  neutral mood instead of erroring out.
- The demo buttons ("On task" / "Off task") nudge the shared mood
  directly, bypassing the backend — useful for testing the UI before
  the backend/OpenRouter integration is ready.
