const { spawn } = require('node:child_process');
const net = require('node:net');

const port = 5173;
const host = '127.0.0.1';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const environment = { ...process.env };

// Some development environments set this globally, which makes Electron
// run as plain Node and leaves Electron APIs such as ipcMain undefined.
delete environment.ELECTRON_RUN_AS_NODE;

const devServer = spawn(npmCommand, ['run', 'dev'], {
  cwd: process.cwd(),
  env: environment,
  stdio: 'inherit',
});

let electronProcess;
let shuttingDown = false;

function stop(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (electronProcess && !electronProcess.killed) electronProcess.kill();
  if (!devServer.killed) devServer.kill();
  process.exit(exitCode);
}

function waitForDevServer() {
  const socket = net.createConnection({ host, port });
  socket.once('connect', () => {
    socket.destroy();
    const electronPath = require('electron');
    electronProcess = spawn(electronPath, ['.'], {
      cwd: process.cwd(),
      env: { ...environment, VITE_DEV_SERVER_URL: `http://${host}:${port}` },
      stdio: 'inherit',
    });
    electronProcess.once('exit', (code) => stop(code || 0));
  });
  socket.once('error', () => {
    socket.destroy();
    if (!devServer.killed) setTimeout(waitForDevServer, 100);
  });
}

devServer.once('exit', (code) => {
  if (!electronProcess && !shuttingDown) stop(code || 1);
});

process.once('SIGINT', () => stop(0));
process.once('SIGTERM', () => stop(0));
waitForDevServer();
