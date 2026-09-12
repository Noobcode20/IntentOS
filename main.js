const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let dashboardWindow, petWindow;
let settings = { apiUrl: '', pollInterval: 15 };
let pollHandle = null;
let currentTargetMood = 60;

function broadcast(channel, payload) {
  if (dashboardWindow && !dashboardWindow.isDestroyed()) dashboardWindow.webContents.send(channel, payload);
  if (petWindow && !petWindow.isDestroyed()) petWindow.webContents.send(channel, payload);
}

// ---- single source of truth: main process polls the backend once,
// both windows just receive the result. ----
async function pollOnce() {
  if (!settings.apiUrl) {
    broadcast('conn-update', { connected: false, message: 'Not connected — using demo mode' });
    return;
  }
  try {
    const res = await fetch(settings.apiUrl.replace(/\/$/, '') + '/status');
    if (!res.ok) throw new Error('bad response');
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
    broadcast('conn-update', { connected: true, message: 'Connected — live data' });
  } catch (e) {
    broadcast('conn-update', { connected: false, message: "Can't reach backend — check the URL" });
  }
}

function restartPolling() {
  if (pollHandle) clearInterval(pollHandle);
  pollOnce();
  pollHandle = setInterval(pollOnce, Math.max(3, settings.pollInterval) * 1000);
}

ipcMain.on('settings-update', (event, newSettings) => {
  settings = newSettings;
  restartPolling();
});

ipcMain.on('nudge', (event, delta) => {
  currentTargetMood = Math.max(0, Math.min(100, currentTargetMood + delta));
  broadcast('mood-update', currentTargetMood);
});

function createWindows() {
  dashboardWindow = new BrowserWindow({
    width: 900,
    height: 720,
    title: 'Focus Companion',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });
  dashboardWindow.loadFile('dashboard.html');

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
  petWindow.loadFile('pet.html');

  dashboardWindow.on('closed', () => { dashboardWindow = null; });
  petWindow.on('closed', () => { petWindow = null; });
}

app.whenReady().then(createWindows);

app.on('window-all-closed', () => {
  app.quit();
});
