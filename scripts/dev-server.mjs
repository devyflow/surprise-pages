import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const readValue = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const host = readValue('--host', '0.0.0.0');
const port = readValue('--port', '3000');
const nextBin = new URL('../node_modules/next/dist/bin/next', import.meta.url);

const child = spawn(process.execPath, [nextBin.pathname, 'dev', '-H', host, '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
