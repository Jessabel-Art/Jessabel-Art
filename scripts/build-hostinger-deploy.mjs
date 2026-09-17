import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Never assemble into the source tree: Cleaning's source has the same name as its public mount.
const targetRoot = path.join(root, 'deploy', 'hostinger');
const projectMap = [
  { source: 'FMBLifestyle', publicDir: 'fmbl', buildCommand: 'npm run build', output: 'dist' },
  { source: 'cleaning-service-demo', publicDir: 'cleaning-service-demo', buildCommand: 'npm run build', output: 'dist' },
  { source: 'Cavalry Green 2.0', publicDir: 'cavalry-green', buildCommand: 'npm run check', output: 'dist' },
  { source: 'Landscape Website Demo', publicDir: 'landscape-website-demo', buildCommand: 'npm run build', output: 'dist' },
  { source: 'PinkLadyZ-OLED-Display', publicDir: 'pinkladyz-oled', output: '.' },
  { source: 'Santos FormWorks', publicDir: 'santos-formworks', buildCommand: 'npm run build', output: 'out' },
];
const requested = process.argv.slice(2);
for (const name of requested) {
  if (!projectMap.some(project => project.publicDir === name)) throw new Error(`Unknown public mount: ${name}`);
}
const selected = projectMap.filter(project => !requested.length || requested.includes(project.publicDir));
for (const project of selected) {
  const sourceDir = path.join(root, project.source);
  const outputDir = path.join(sourceDir, project.output);
  const targetDir = path.join(targetRoot, project.publicDir);
  // Only generated staging mounts may be replaced; never source or repository directories.
  if (path.dirname(targetDir) !== targetRoot || targetDir === sourceDir || sourceDir.startsWith(targetDir + path.sep)) {
    throw new Error(`Unsafe deployment target: ${targetDir}`);
  }
  if (project.buildCommand) {
    if (!fs.existsSync(path.join(sourceDir, 'node_modules'))) {
      execSync('npm ci', { cwd: sourceDir, stdio: 'inherit' });
    }
    console.log(`Building ${project.source} -> /${project.publicDir}/`);
    execSync(project.buildCommand, { cwd: sourceDir, stdio: 'inherit' });
  }
  if (!fs.existsSync(path.join(outputDir, 'index.html'))) {
    throw new Error(`Missing production index: ${outputDir}`);
  }
  // Validate/build before replacing any existing staged output. Never fall back to source HTML.
  fs.mkdirSync(targetRoot, { recursive: true });
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.cpSync(outputDir, targetDir, {
    recursive: true,
    filter: source => !['node_modules', '.git', '.env'].includes(path.basename(source)) && !path.basename(source).startsWith('.env.'),
  });
  console.log(`Staged ${path.join(targetDir, 'index.html')}`);
}
console.log('Upload the selected mount directories inside deploy/hostinger to public_html; do not upload source directories.');
