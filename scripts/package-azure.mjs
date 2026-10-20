import { cpSync, mkdirSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
rmSync('release', { recursive: true, force: true });
mkdirSync('release/api', { recursive: true });
cpSync('dist/bcrs', 'release/site', { recursive: true });
copyFileSync('staticwebapp.config.json', 'release/site/staticwebapp.config.json');
// Explicit allowlist excludes the legacy server, secrets, tests and Git history.
for (const file of ['package.json', 'package-lock.json', 'functions.js', 'handler.js', 'accounts.js', 'database.js', 'demo.js', 'host.json']) {
  copyFileSync(`api/${file}`, `release/api/${file}`);
}
execFileSync('npm', ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: 'release/api', stdio: 'inherit' });
rmSync('bcrs.zip', { force: true });
execFileSync('zip', ['-qr', '../bcrs.zip', '.'], { cwd: 'release' });
