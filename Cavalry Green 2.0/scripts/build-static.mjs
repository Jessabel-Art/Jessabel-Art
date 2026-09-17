import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distPath = path.join(root, 'dist');
const outPath = path.join(root, 'out');
const publicPath = path.join(root, 'public');

fs.rmSync(distPath, { recursive: true, force: true });
fs.rmSync(outPath, { recursive: true, force: true });

execSync('npx next build', { stdio: 'inherit', cwd: root, shell: true });

if (!fs.existsSync(outPath)) {
  throw new Error('Next static export did not generate an out/ folder.');
}

const apiSource = path.join(publicPath, 'api');
const uploadsSource = path.join(publicPath, 'uploads');
const apiTarget = path.join(outPath, 'api');
const uploadsTarget = path.join(outPath, 'uploads');
const vendorSource = path.join(apiSource, 'vendor');
const vendorTarget = path.join(apiTarget, 'vendor');

if (fs.existsSync(apiSource)) {
  fs.cpSync(apiSource, apiTarget, { recursive: true, force: true });
}

if (fs.existsSync(vendorSource)) {
  fs.cpSync(vendorSource, vendorTarget, { recursive: true, force: true });
}

if (fs.existsSync(uploadsSource)) {
  fs.cpSync(uploadsSource, uploadsTarget, { recursive: true, force: true });
}

fs.rmSync(distPath, { recursive: true, force: true });
fs.cpSync(outPath, distPath, { recursive: true, force: true });
fs.rmSync(outPath, { recursive: true, force: true });

const routes = ['index.html', 'services/index.html', 'quote/index.html'];
for (const relative of routes) {
  const filePath = path.join(distPath, relative);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated route: ${relative}`);
  }
}

const phpPaths = ['api/quote-submit.php', 'api/vendor/autoload.php'];
for (const relative of phpPaths) {
  const filePath = path.join(distPath, relative);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing generated PHP route: ${relative}`);
  }
}

console.log('Static export finalized at dist/.');
