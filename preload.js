const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('focusAPI', {
  sendSettings: (settings) => ipcRenderer.send('settings-update', settings),
  sendTasks: (tasks) => ipcRenderer.send('tasks-update', tasks),
  toggleMonitoring: (enabled) => ipcRenderer.send('monitoring-toggle', enabled),
  nudge: (delta) => ipcRenderer.send('nudge', delta),
  onMoodUpdate: (callback) => ipcRenderer.on('mood-update', (event, mood) => callback(mood)),
  onAnalysisUpdate: (callback) => ipcRenderer.on('analysis-update', (event, data) => callback(data)),
  onConnUpdate: (callback) => ipcRenderer.on('conn-update', (event, state) => callback(state)),
});
