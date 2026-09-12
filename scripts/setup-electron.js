const { spawnSync } = require('node:child_process');

const result = spawnSync(process.execPath, ['node_modules/electron/install.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_MIRROR: 'https://npmmirror.com/mirrors/electron/',
  },
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
