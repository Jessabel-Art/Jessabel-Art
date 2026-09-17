import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const targetRoot = root;
const publicProjectDirs = ['fmbl', 'cavalry-green', 'landscape-website-demo', 'cleaning-service-demo', 'pinkladyz-oled', 'santos-formworks'];
const projectMap = [
  {
    source: 'FMBLifestyle',
    publicDir: 'fmbl',
    buildCommand: 'npm install && npm run build',
    buildDirCandidates: ['dist'],
  },
  {
    source: 'cleaning-service-demo',
    publicDir: 'cleaning-service-demo',
    buildCommand: '',
    buildDirCandidates: ['dist'],
    staticCopy: true,
  },
  {
    source: 'Cavalry Green 2.0',
    publicDir: 'cavalry-green',
    buildCommand: 'npm install && npm run check',
    buildDirCandidates: ['dist'],
  },
  {
    source: 'Landscape Website Demo',
    publicDir: 'landscape-website-demo',
    buildCommand: 'npm install && npm run build',
    buildDirCandidates: ['dist'],
  },
  {
    source: 'PinkLadyZ-OLED-Display',
    publicDir: 'pinkladyz-oled',
    buildCommand: '',
    buildDirCandidates: ['.'],
    staticCopy: true,
  },
  {
    source: 'Santos FormWorks',
    publicDir: 'santos-formworks',
    buildCommand: 'npm install && npm run build',
    buildDirCandidates: ['out', '.next', 'dist'],
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function resolveBuildDir(sourceDir, candidates) {
  for (const candidate of candidates) {
    const full = path.join(sourceDir, candidate);
    if (fs.existsSync(full)) {
      return full;
    }
  }
  return null;
}

for (const dirName of publicProjectDirs) {
  const targetDir = path.join(targetRoot, dirName);
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
}

for (const project of projectMap) {
  const sourceDir = path.join(root, project.source);
  const targetDir = path.join(targetRoot, project.publicDir);
  ensureDir(targetDir);

  if (project.staticCopy === true) {
    const sourceBuildDir = resolveBuildDir(sourceDir, project.buildDirCandidates);
    if (sourceBuildDir && sourceBuildDir !== sourceDir) {
      fs.cpSync(sourceBuildDir, targetDir, { recursive: true, force: true });
    } else {
      for (const entry of fs.readdirSync(sourceDir)) {
        const srcPath = path.join(sourceDir, entry);
        const destPath = path.join(targetDir, entry);
        if (fs.statSync(srcPath).isDirectory()) {
          fs.cpSync(srcPath, destPath, { recursive: true, force: true });
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    continue;
  }

  if (project.buildCommand) {
    console.log(`Building ${project.source} -> ${project.publicDir}`);
    execSync(project.buildCommand, {
      cwd: sourceDir,
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
    });
  }

  const sourceBuildDir = resolveBuildDir(sourceDir, project.buildDirCandidates);
  if (!sourceBuildDir) {
    throw new Error(`Expected build output for ${project.source} in one of: ${project.buildDirCandidates.join(', ')}`);
  }

  const sourceIndex = path.join(sourceBuildDir, 'index.html');
  if (!fs.existsSync(sourceIndex)) {
    throw new Error(`No valid build output found for ${project.source}: ${sourceIndex}`);
  }

  fs.cpSync(sourceBuildDir, targetDir, { recursive: true, force: true });
}

const required = [
  'fmbl/index.html',
  'cavalry-green/index.html',
  'landscape-website-demo/index.html',
  'cleaning-service-demo/index.html',
  'pinkladyz-oled/index.html',
  'santos-formworks/index.html',
];

for (const relative of required) {
  const full = path.join(targetRoot, relative);
  if (!fs.existsSync(full)) {
    throw new Error(`Deployment output missing: ${relative}`);
  }
}

console.log('Deployment directory ready:', targetRoot);
console.log('Generated deployment outputs:', required.join(', '));
