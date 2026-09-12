const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('focusAPI', {
  getState: () => ipcRenderer.invoke('focus-state'),
  sendSettings: (settings) => ipcRenderer.send('settings-update', settings),
  sendTasks: (tasks) => ipcRenderer.send('tasks-update', tasks),
  toggleMonitoring: (enabled) => ipcRenderer.send('monitoring-toggle', enabled),
  nudge: (delta) => ipcRenderer.send('nudge', delta),
  // Expose subscriptions as unsubscribe functions. Returning Electron's
  // ipcRenderer instance across the context boundary is both unsafe and was
  // the reason React cleanup crashed in development mode.
  onMoodUpdate: (callback) => {
    const listener = (_event, mood) => callback(mood);
    ipcRenderer.on('mood-update', listener);
    return () => ipcRenderer.removeListener('mood-update', listener);
  },
  onAnalysisUpdate: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('analysis-update', listener);
    return () => ipcRenderer.removeListener('analysis-update', listener);
  },
  onConnUpdate: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('conn-update', listener);
    return () => ipcRenderer.removeListener('conn-update', listener);
  },
});
