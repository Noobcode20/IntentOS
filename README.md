# IntentOS

**Stay focused. Stay aware. Meet your desktop companion.**

**Status: Early Development — No Stable Release Available**

IntentOS is an experimental macOS productivity companion designed to help you stay focused by understanding what you're working on in real time.

Using AI-powered screen analysis, IntentOS compares your current activity with your task list to determine whether you're staying productive or getting distracted. Your progress is reflected through a floating desktop pet that changes its mood based on your activity.

The project is actively under development. Features may be incomplete, unstable, or subject to change.

## Features

### Productivity Dashboard

A central place to manage tasks and monitor productivity.

- **Task management** — Keep track of what you're working on.
- **AI activity analysis** — Evaluate whether your current activity aligns with your goals.
- **Live feedback** — View productivity classifications and the AI's reasoning.
- **Session history** — Review previous activity.
- **Monitoring controls** — Pause or resume tracking.
- **Backend configuration** — Connect to a compatible analysis server.

### Floating Desktop Companion

A lightweight, transparent desktop pet that stays visible above your other applications.

- Reacts to productivity classifications.
- Changes mood based on your current activity.
- Stays synchronized with the dashboard.
- Provides visual feedback without interrupting your workflow.

## How It Works

IntentOS uses periodic screen analysis to understand your activity without requiring manual check-ins.

1. **Capture** — At a configurable interval (15 seconds by default), IntentOS captures a downscaled screenshot of your primary display.
2. **Analyze** — The screenshot and current task list are sent to the configured backend.
3. **Classify** — The backend uses a vision-capable language model through OpenRouter to evaluate whether your activity is relevant to your tasks.
4. **Respond** — The classification updates both the dashboard and desktop companion.

IntentOS waits for each analysis request to finish before beginning another capture. A 20-second timeout helps prevent slow backend responses from creating overlapping requests.

## Development Setup

> **Development notice:** IntentOS does not currently have a stable release. The following instructions are intended for developers and testers running the project from source. Functionality may be incomplete, and the application may contain bugs or breaking changes.

### Requirements

- macOS
- [Node.js](https://nodejs.org)
- A compatible analysis backend

### Running From Source

Clone or download the repository, then navigate to the application directory:

```bash
cd focus-companion-app
npm install
npm start
```

These commands launch the current development build. They do not install a stable or production-ready release.

### Screen Recording Permission

IntentOS requires macOS Screen Recording permission to analyze your activity.

Grant permission to your terminal or packaged application under:

**System Settings → Privacy & Security → Screen Recording**

Without this permission, screenshots may be empty and activity analysis will not work correctly.

### Backend Configuration

To connect your own backend:

1. Open the IntentOS dashboard.
2. Navigate to the backend settings.
3. Enter your backend API URL.
4. Click **Save**.

Once configured, the application begins monitoring and updates both windows as analysis results arrive.

## Backend API

IntentOS uses a separate analysis backend, allowing the AI processing service to be developed independently of the desktop application.

### Request

**Endpoint:** `POST {api_url}/analyze`

**Content-Type:** `application/json`

```json
{
  "image": "data:image/jpeg;base64,...",
  "tasks": [
    "Complete project documentation",
    "Study network theory"
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `image` | String | Screenshot encoded as a Base64 JPEG data URL |
| `tasks` | Array of strings | Current tasks used to evaluate productivity |

The image is provided as a complete data URL, suitable for use with vision-capable models through OpenRouter.

### Supported Responses

**Option 1 — Numerical mood**

```json
{
  "mood": 72
}
```

**Option 2 — Activity classification**

```json
{
  "status": "productive",
  "reasoning": "The user is watching a lecture relevant to their current study tasks."
}
```

The `reasoning` field is optional but recommended. When provided, it appears in the dashboard's **Last Reading** panel, helping explain the classification.

The API contract may change as development continues.

## Privacy & Monitoring

IntentOS uses screenshots to understand your activity. These screenshots may contain personal or sensitive information visible on your display.

- **Monitoring controls** — Pause screenshot capture using the dashboard's **Pause Monitoring** button.
- **External processing** — Screenshots are transmitted to the configured backend, which may use third-party AI services.
- **Local persistence** — Tasks and last-used settings are stored locally.
- **Display support** — Only the first detected display is currently captured.

Avoid using experimental builds with sensitive information visible on your screen unless you understand and trust the configured backend.

## Testing & Demo Mode

IntentOS includes controls for testing the desktop companion without a working backend.

The **On Task** and **Off Task** buttons simulate productivity changes and update the companion's mood directly.

These controls are useful for UI testing, demonstrations, and development before the backend integration is complete.

If the backend becomes unavailable, IntentOS falls back to a neutral mood rather than interrupting the application.

## Current Limitations

- No stable or production-ready release is available.
- macOS is the only currently targeted platform.
- Only the first detected display is captured.
- Screen Recording permission is required.
- AI analysis depends on a compatible external backend.
- Activity classifications may be inaccurate.
- Features, configuration, and API behavior may change without notice.

## The Idea Behind IntentOS

Most productivity tools rely on timers, manual tracking, or website-blocking rules.

IntentOS explores a different approach: **understanding the context of what you're doing, rather than simply measuring how long you're doing it.**

Watching a video might be a distraction, or it might be exactly what you need to finish an assignment. IntentOS aims to distinguish between the two by considering both your current tasks and screen activity.

The desktop companion turns that analysis into a visual experience designed to encourage focus without constantly demanding attention.

---

**IntentOS — A little companion for a more focused desktop.**

*Experimental project • Actively under development • Contributions and feedback welcome*
