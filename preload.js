const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('focusAPI', {
  sendSettings: (settings) => ipcRenderer.send('settings-update', settings),
  nudge: (delta) => ipcRenderer.send('nudge', delta),
  onMoodUpdate: (callback) => ipcRenderer.on('mood-update', (event, mood) => callback(mood)),
  onConnUpdate: (callback) => ipcRenderer.on('conn-update', (event, state) => callback(state)),
});
