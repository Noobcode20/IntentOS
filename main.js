const { app, BrowserWindow, screen, ipcMain, desktopCapturer } = require('electron');
const path = require('path');

let dashboardWindow, petWindow;

// ---- shared state, all owned by main so both windows agree ----
let settings = { apiUrl: '', captureInterval: 15 }; // captureInterval in seconds
let currentTasks = [];
let monitoringEnabled = true;
let currentTargetMood = 60;
let connectionState = { connected: false, message: 'Not connected — using demo mode' };
let lastAnalysis = null;

let captureTimer = null;
let captureInFlight = false; // guards against overlapping requests if backend is slow

function broadcast(channel, payload) {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) dashboardWindow.webContents.send(channel, payload);
  if (petWindow && !petWindow.isDestroyed()) petWindow.webContents.send(channel, payload);
}

function updateConnection(nextState) {
  connectionState = nextState;
  broadcast('conn-update', connectionState);
}

// ---- screenshot capture ----
// Captured already-downscaled (not full-res then resized) to keep memory
// and upload size small. thumbnailSize is a max bound, not exact output size.
async function captureScreenshot() {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: { width: 1280, height: 800 },
  });
  const primary = sources[0]; // NOTE: on multi-monitor setups this is just the first
  if (!primary || primary.thumbnail.isEmpty()) return null;
  const jpegBuffer = primary.thumbnail.toJPEG(70); // quality 70: small file, plenty for classification
  return `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
}

// ---- single capture-and-analyze cycle ----
// Expected backend contract:
//   POST {apiUrl}/analyze
//   body: { "image": "data:image/jpeg;base64,...", "tasks": ["task1", "task2"] }
//   response: { "mood": 0-100 } or { "status": "productive"|"unproductive"|"ambiguous", "reasoning": "..." }
async function captureAndAnalyze() {
  if (!monitoringEnabled) {
    scheduleNextCapture();
    return;
  }
  if (!settings.apiUrl) {
    updateConnection({ connected: false, message: 'Not connected — using demo mode' });
    scheduleNextCapture();
    return;
  }
  if (captureInFlight) {
    scheduleNextCapture();
    return;
  }

  captureInFlight = true;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const image = await captureScreenshot();
    if (!image) throw new Error('screenshot capture failed');

    const res = await fetch(settings.apiUrl.replace(/\/$/, '') + '/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, tasks: currentTasks }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('bad response: ' + res.status);
    const data = await res.json();

    let mood;
    if (typeof data.mood === 'number') {
      mood = Math.max(0, Math.min(100, data.mood));
    } else if (data.status === 'productive') {
      mood = Math.min(100, currentTargetMood + 15);
    } else if (data.status === 'unproductive') {
      mood = Math.max(0, currentTargetMood - 15);
    } else {
      mood = currentTargetMood + (50 - currentTargetMood) * 0.3;
    }
    currentTargetMood = mood;

    broadcast('mood-update', mood);
    lastAnalysis = {
      status: data.status || null,
      reasoning: data.reasoning || null,
      timestamp: Date.now(),
    };
    broadcast('analysis-update', lastAnalysis);
    updateConnection({ connected: true, message: 'Connected — live data' });
  } catch (e) {
    updateConnection({ connected: false, message: "Can't reach backend — check the URL" });
  } finally {
    clearTimeout(timeoutId);
    captureInFlight = false;
    scheduleNextCapture();
  }
}

function scheduleNextCapture() {
  if (captureTimer) clearTimeout(captureTimer);
  const intervalMs = Math.max(5, settings.captureInterval || 15) * 1000;
  captureTimer = setTimeout(captureAndAnalyze, intervalMs);
}

// ---- IPC from the renderer windows ----
ipcMain.on('settings-update', (event, newSettings) => {
  settings = {
    apiUrl: typeof newSettings?.apiUrl === 'string' ? newSettings.apiUrl : '',
    captureInterval: Math.max(5, Number(newSettings?.captureInterval) || 15),
  };
  // A user who just saved a backend URL should not have to wait for the
  // previous interval before learning whether it works.
  captureAndAnalyze();
});

ipcMain.on('tasks-update', (event, tasks) => {
  currentTasks = tasks;
});

ipcMain.on('monitoring-toggle', (event, enabled) => {
  monitoringEnabled = enabled;
  if (monitoringEnabled) captureAndAnalyze();
});

ipcMain.handle('focus-state', () => ({
  mood: currentTargetMood,
  connected: connectionState.connected,
  analysis: lastAnalysis,
  monitoringEnabled,
}));

ipcMain.on('nudge', (event, delta) => {
  currentTargetMood = Math.max(0, Math.min(100, currentTargetMood + delta));
  broadcast('mood-update', currentTargetMood);
});

function createWindows() {
  dashboardWindow = new BrowserWindow({
    width: 900,
    height: 760,
    title: 'Focus Companion',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  // Vite serves React during development, enabling hot reload in Electron.
  // Without the environment variable, the packaged build uses dist instead.
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    dashboardWindow.loadURL(devServerUrl);
  } else {
    dashboardWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  const winSize = 150;
  petWindow = new BrowserWindow({
    width: winSize,
    height: winSize,
    x: sw - winSize - 40,
    y: sh - winSize - 40,
    frame: false,
    transparent: true,
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  petWindow.setAlwaysOnTop(true, 'screen-saver');
  petWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  petWindow.loadFile(path.join(__dirname, 'pet.html'));

  dashboardWindow.on('closed', () => { dashboardWindow = null; });
  petWindow.on('closed', () => { petWindow = null; });
}

app.whenReady().then(() => {
  createWindows();
  captureAndAnalyze();
});

app.on('window-all-closed', () => {
  app.quit();
});
