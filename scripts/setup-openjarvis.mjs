#!/usr/bin/env node
/**
 * Clone OpenJarvis into vendor/OpenJarvis (Apache 2.0).
 * https://github.com/open-jarvis/OpenJarvis
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const vendor = path.join(root, 'vendor', 'OpenJarvis');
const repo = 'https://github.com/open-jarvis/OpenJarvis.git';

if (existsSync(path.join(vendor, '.git'))) {
  console.log('OpenJarvis already cloned at vendor/OpenJarvis — pulling latest…');
  execSync('git pull --ff-only', { cwd: vendor, stdio: 'inherit' });
} else {
  console.log('Cloning OpenJarvis…');
  execSync(`git clone --depth 1 ${repo} "${vendor}"`, { stdio: 'inherit', cwd: root });
}

console.log('\nDone. Start with: npm run openjarvis:start');
console.log('Docs: https://open-jarvis.github.io/OpenJarvis/');
