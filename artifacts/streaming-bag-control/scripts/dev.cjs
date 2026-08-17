const { spawn } = require('node:child_process');

const env = {
  ...process.env,
  ...(process.env.REPLIT_EXPO_DEV_DOMAIN
    ? { EXPO_PACKAGER_PROXY_URL: `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}` }
    : {}),
  ...(process.env.REPLIT_DEV_DOMAIN
    ? { EXPO_PUBLIC_DOMAIN: process.env.REPLIT_DEV_DOMAIN }
    : {}),
  ...(process.env.REPL_ID ? { EXPO_PUBLIC_REPL_ID: process.env.REPL_ID } : {}),
  ...(process.env.REPLIT_DEV_DOMAIN
    ? { REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REPLIT_DEV_DOMAIN }
    : {}),
};

const expoCommand = process.platform === 'win32' ? 'expo.cmd' : 'expo';
const args = ['start', '--localhost'];
if (process.env.PORT) args.push('--port', process.env.PORT);

const child = spawn(expoCommand, args, {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});