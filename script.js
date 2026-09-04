const SHOW_BOOT_EVERY_LOAD = true;
const BOOT_DURATION_MS = 2800;

const APP_CONFIG = {
  home: {
    id: 'home',
    name: 'Jessabel Home',
    icon: 'home',
    kind: 'desktop',
    accent: 'blue',
    defaultWindow: false,
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: 'projects',
    kind: 'workspace',
    accent: 'blue',
    defaultWindow: true,
  },
  lab: {
    id: 'lab',
    name: 'Lab',
    icon: 'lab',
    kind: 'workspace',
    accent: 'green',
    defaultWindow: true,
  },
  about: {
    id: 'about',
    name: 'About Me',
    icon: 'about',
    kind: 'workspace',
    accent: 'yellow',
    defaultWindow: true,
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    icon: 'resume',
    kind: 'workspace',
    accent: 'blue',
    defaultWindow: true,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    kind: 'external',
    accent: 'green',
    defaultWindow: false,
    url: 'https://github.com/Jessabel-Art',
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    icon: 'contact',
    kind: 'workspace',
    accent: 'red',
    defaultWindow: true,
  },
};

const PROJECTS = [
  {
    id: 'alchemize',
    name: 'Alchemize',
    category: 'Agency / Business Website',
    type: 'Agency / Business Website',
    description: 'Jessabel’s broader business and agency presence, representing services and digital strategy work.',
    role: 'Brand and digital presence',
    tools: ['Branding', 'Web Design', 'Business Systems'],
    url: 'https://getalchemize.com/',
    accent: 'yellow',
    logo: 'alchemize-emblem-light.png',
    preview: 'Alchemize',
  },
  {
    id: 'cavalry-green',
    name: 'Cavalry Green LLC',
    category: 'Client Website',
    type: 'Client Website',
    description: 'A branded client experience blending heritage, identity, and a digital-first service presence.',
    role: 'Design systems and front-end implementation',
    tools: ['Branding', 'Web Design', 'Front-End'],
    url: 'https://cavalry-green.jessabel.art/',
    accent: 'green',
    logo: 'cavalry-green-logo.png',
    preview: 'Cavalry Green',
  },
  {
    id: 'cleaning-service-demo',
    name: 'Cleaning Service Demo',
    category: 'Demo Website',
    type: 'Demo Website',
    description: 'A clean service-site concept focused on clarity, trust, and conversion-focused layout structure.',
    role: 'Landing page concept and UI direction',
    tools: ['UI', 'Front-End', 'Marketing'],
    url: 'https://cleaning-service-demo.jessabel.art/',
    accent: 'yellow',
    logo: '',
    preview: 'Cleaning Service Demo',
  },
  {
    id: 'fmblifestyle',
    name: 'FMBLifestyle',
    category: 'Portfolio',
    type: 'Portfolio',
    description: 'An external portfolio project highlighting personal creative work and selected visual storytelling.',
    role: 'Creative portfolio frontend',
    tools: ['Portfolio Design', 'Front-End'],
    url: 'https://fmbl.jessabel.art/',
    accent: 'blue',
    logo: '',
    preview: 'FMBLifestyle',
  },
];

const LAB_PROJECT = {
  id: 'pinkladyz-oled',
  name: 'PinkLadyZ OLED',
  category: 'Experimental Hardware / UI',
  type: 'Experimental System',
  description: 'Creative exploration around an OLED display interface, embedded experimentation, and playful technical identity.',
  role: 'Experimental concepting and front-end tinkering',
  tools: ['OLED', 'Embedded', 'UI Exploration'],
  url: 'https://pinkladyz-oled.jessabel.art/',
  accent: 'pink',
};

const PRIMARY_APP_IDS = ['projects', 'lab', 'about', 'resume', 'contact'];
const DISCOVERY_KEY = 'jessabel-os-discovery';
const ACHIEVEMENTS_KEY = 'jessabel-os-achievements';

const state = {
  windows: new Map(),
  dockOrder: [],
  activeWindowId: null,
  minimized: new Set(),
  bootHidden: false,
  draggedWindowId: null,
  discovery: {},
  achievements: {},
  homeMenuOpen: false,
  commandPaletteOpen: false,
};

const desktopIcons = document.getElementById('desktopIcons');
const dock = document.getElementById('dock');
const windowLayer = document.getElementById('windowLayer');
const windowTemplate = document.getElementById('windowTemplate');
const bootScreen = document.getElementById('bootScreen');
const systemTime = document.getElementById('systemTime');
const desktopHomeButton = document.getElementById('desktopHomeButton');
const homeMenu = document.getElementById('homeMenu');
const commandPalette = document.getElementById('commandPalette');
const commandInput = document.getElementById('commandInput');
const commandSuggestions = document.getElementById('commandSuggestions');
const discoveryChip = document.getElementById('systemDiscovery');
const toastContainer = document.getElementById('toastContainer');

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function loadSessionState() {
  try {
    const savedDiscovery = JSON.parse(sessionStorage.getItem(DISCOVERY_KEY) || '{}');
    const savedAchievements = JSON.parse(sessionStorage.getItem(ACHIEVEMENTS_KEY) || '{}');
    state.discovery = { ...savedDiscovery };
    state.achievements = { ...savedAchievements };
  } catch (error) {
    state.discovery = {};
    state.achievements = {};
  }
}

function saveSessionState() {
  sessionStorage.setItem(DISCOVERY_KEY, JSON.stringify(state.discovery));
  sessionStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state.achievements));
}

function getDiscoveryCount() {
  return PRIMARY_APP_IDS.filter((appId) => state.discovery[appId]).length;
}

function updateDiscoveryIndicator() {
  if (!discoveryChip) return;
  const count = getDiscoveryCount();
  discoveryChip.innerHTML = `
    <span class="system-discovery-label">System Discovery</span>
    <strong>${count} / ${PRIMARY_APP_IDS.length}</strong>
  `;
  discoveryChip.classList.toggle('is-complete', count === PRIMARY_APP_IDS.length);
}

function markDiscovered(appId) {
  if (!PRIMARY_APP_IDS.includes(appId) || state.discovery[appId]) {
    return false;
  }

  state.discovery[appId] = true;
  saveSessionState();
  updateDiscoveryIndicator();

  if (getDiscoveryCount() === PRIMARY_APP_IDS.length) {
    unlockAchievement('fullSystemAccess', 'FULL SYSTEM ACCESS', 'All primary apps discovered.');
  }

  return true;
}

function unlockAchievement(id, label, body) {
  if (state.achievements[id]) return false;

  state.achievements[id] = true;
  saveSessionState();
  showToast(label, body, 'green');
  return true;
}

function showToast(title, detail, accent = 'blue') {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${accent}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast-indicator" aria-hidden="true"></div>
    <div>
      <strong>${title}</strong>
      <span>${detail}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function updateTime() {
  systemTime.textContent = formatTime(new Date());
}

function getReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function bootSequence() {
  const reducedMotion = getReducedMotion();
  const wasSeen = sessionStorage.getItem('jessabel-os-boot-visited');

  if (reducedMotion) {
    bootScreen.classList.add('hidden');
    state.bootHidden = true;
    return;
  }

  if (!SHOW_BOOT_EVERY_LOAD && wasSeen === 'true') {
    bootScreen.classList.add('hidden');
    state.bootHidden = true;
    return;
  }

  sessionStorage.setItem('jessabel-os-boot-visited', 'true');
  setTimeout(() => {
    bootScreen.classList.add('hidden');
    state.bootHidden = true;
  }, BOOT_DURATION_MS);
}

function createDesktopIcon(appId) {
  const app = APP_CONFIG[appId];
  if (!app) return null;

  const template = document.querySelector('#iconTemplate');
  const button = template.content.firstElementChild.cloneNode(true);
  button.dataset.app = appId;
  button.setAttribute('aria-label', app.name);
  button.querySelector('.icon-label').textContent = app.name;
  button.querySelector('.icon-graphic').setAttribute('data-icon', app.icon);

  if (PRIMARY_APP_IDS.includes(appId) && state.discovery[appId]) {
    button.classList.add('is-discovered');
  }

  button.addEventListener('click', () => {
    if (app.kind === 'external') {
      openExternalApp(appId);
      return;
    }

    openAppWindow(appId);
  });

  return button;
}

function renderDesktopIcons() {
  const appOrder = ['projects', 'lab', 'about', 'resume', 'github', 'contact'];
  desktopIcons.innerHTML = '';

  appOrder.forEach((appId) => {
    const icon = createDesktopIcon(appId);
    if (icon) {
      desktopIcons.appendChild(icon);
    }
  });
}

function getDefaultWindowLayout(appId) {
  if (window.innerWidth < 1100) return null;

  const layout = {
    projects: { x: 54, y: 58, width: 760, height: 520 },
    lab: { x: window.innerWidth - 500, y: 58, width: 460, height: 420 },
    about: { x: 86, y: 390, width: 520, height: 410 },
    contact: { x: window.innerWidth / 2 - 210, y: 392, width: 420, height: 300 },
    resume: { x: window.innerWidth - 420, y: 392, width: 360, height: 290 },
  };

  return layout[appId] || null;
}

function registerAppOpen(appId) {
  if (PRIMARY_APP_IDS.includes(appId)) {
    const discovered = markDiscovered(appId);
    if (discovered) {
      if (appId === 'projects') unlockAchievement('portfolioAccess', 'PORTFOLIO ACCESS', 'Projects unlocked.');
      if (appId === 'lab') unlockAchievement('hardwareDetected', 'HARDWARE DETECTED', 'PinkLadyZ OLED detected.');
      if (appId === 'about') unlockAchievement('systemArchitect', 'SYSTEM ARCHITECT', 'About Me unlocked.');
      if (appId === 'resume') unlockAchievement('systemArchitect', 'SYSTEM ARCHITECT', 'Resume unlocked.');
    }
  }

  if (appId === 'github') {
    unlockAchievement('sourceUnlocked', 'SOURCE UNLOCKED', 'GitHub accessed.');
  }

  if (getDiscoveryCount() === PRIMARY_APP_IDS.length && !state.achievements.fullSystemAccess) {
    unlockAchievement('fullSystemAccess', 'FULL SYSTEM ACCESS', 'All primary apps discovered.');
  }

  if (PRIMARY_APP_IDS.includes(appId) && state.discovery[appId]) {
    const icon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
    if (icon) {
      icon.classList.add('is-discovered');
    }
  }
}

function buildCommandList() {
  return [
    { command: 'help', label: 'help', description: 'Show available commands', action: () => showToast('COMMANDS', 'help, whoami, projects, lab, about, resume, contact, github, alchemize, achievements, system, status') },
    { command: 'whoami', label: 'whoami', description: 'Show system profile', action: () => showToast('JESSABEL SANTOS', 'Designer · Developer · Business Consultant') },
    { command: 'projects', label: 'projects', description: 'Open Projects', action: () => openAppWindow('projects') },
    { command: 'lab', label: 'lab', description: 'Open Lab', action: () => openAppWindow('lab') },
    { command: 'about', label: 'about', description: 'Open About', action: () => openAppWindow('about') },
    { command: 'resume', label: 'resume', description: 'Open Resume', action: () => openAppWindow('resume') },
    { command: 'contact', label: 'contact', description: 'Open Contact', action: () => openAppWindow('contact') },
    { command: 'github', label: 'github', description: 'Open GitHub', action: () => openExternalApp('github') },
    { command: 'alchemize', label: 'alchemize', description: 'Focus Alchemize project', action: () => { const detail = createProjectDetailWindow('alchemize'); if (detail) openWindow(detail); } },
    { command: 'achievements', label: 'achievements', description: 'Show achievements', action: () => showToast('ACHIEVEMENTS', Object.keys(state.achievements).length ? Object.keys(state.achievements).join(', ') : 'No achievements yet') },
    { command: 'system', label: 'system', description: 'Open system info', action: () => showAboutSystem() },
    { command: 'status', label: 'status', description: 'Open system info', action: () => showAboutSystem() },
  ];
}

function updateCommandSuggestions(value = '') {
  if (!commandSuggestions) return;
  const query = value.trim().toLowerCase();
  const commands = buildCommandList().filter((entry) => !query || entry.command.includes(query) || entry.description.toLowerCase().includes(query));

  commandSuggestions.innerHTML = commands.slice(0, 6).map((entry) => `
    <button type="button" class="command-suggestion" data-command="${entry.command}">
      <span>${entry.command}</span>
      <small>${entry.description}</small>
    </button>
  `).join('');

  commandSuggestions.querySelectorAll('.command-suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.command;
      commandInput.value = selected;
      executeCommand(selected);
    });
  });
}

function openCommandPalette() {
  if (!commandPalette || !commandInput) return;
  state.commandPaletteOpen = true;
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  updateCommandSuggestions('');
  setTimeout(() => commandInput.focus(), 20);
}

function closeCommandPalette() {
  if (!commandPalette) return;
  state.commandPaletteOpen = false;
  commandPalette.classList.add('hidden');
  commandInput.blur();
}

function showAboutSystem() {
  const panel = document.createElement('div');
  panel.className = 'app-shell app-content';
  panel.innerHTML = `
    <div class="system-panel">
      <span class="section-kicker">Jessabel OS</span>
      <h3>Version 1.0</h3>
      <p>Portfolio environment by Jessabel Santos</p>
      <div class="profile-skills compact-system-details">
        <span>Design</span>
        <span>Development</span>
        <span>Business Technology</span>
      </div>
      <div class="system-status-row">
        <span class="status-pill status-online">online</span>
      </div>
    </div>
  `;

  const homeWindow = openAppWindow('home');
  if (homeWindow) {
    homeWindow.querySelector('.window-body').innerHTML = '';
    homeWindow.querySelector('.window-body').appendChild(panel);
    focusWindow('home');
  }
}

function executeCommand(rawValue) {
  const value = (rawValue || '').trim();
  if (!value) {
    showToast('SYSTEM', 'Type a command or choose a suggestion.');
    return;
  }

  const matching = buildCommandList().find((entry) => entry.command === value.toLowerCase());
  if (matching) {
    matching.action();
    closeCommandPalette();
    return;
  }

  showToast('UNKNOWN COMMAND', 'Use help to view commands.');
}

function createDockApp(appId) {
  const app = APP_CONFIG[appId];
  if (!app) return null;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dock-app';
  button.dataset.app = appId;
  button.setAttribute('aria-label', app.name);

  const mark = document.createElement('span');
  mark.className = 'dock-app-mark';
  mark.setAttribute('aria-hidden', 'true');
  button.appendChild(mark);

  button.addEventListener('click', () => {
    if (appId === 'home') {
      const openWindowId = state.activeWindowId;
      if (openWindowId && state.windows.has(openWindowId)) {
        focusWindow(openWindowId);
      }
      return;
    }

    if (app.kind === 'external') {
      openExternalApp(appId);
      return;
    }

    const currentWindow = state.windows.get(appId);
    if (currentWindow) {
      if (state.minimized.has(appId)) {
        restoreWindow(appId);
      } else if (state.activeWindowId === appId) {
        minimizeWindow(appId);
      } else {
        focusWindow(appId);
      }
    } else {
      openAppWindow(appId);
    }
  });

  return button;
}

function renderDock() {
  dock.innerHTML = '';

  const homeButton = createDockApp('home');
  if (homeButton) dock.appendChild(homeButton);

  const openWindowIds = Array.from(state.windows.keys()).filter((windowId) => windowId !== 'home');
  openWindowIds.forEach((windowId) => {
    const appId = state.windows.get(windowId)?.appId;
    if (!appId) return;
    const item = createDockApp(appId);
    if (item) dock.appendChild(item);
  });

  updateDockState();
}

function updateDockState() {
  Array.from(dock.children).forEach((button) => {
    const appId = button.dataset.app;
    const windowRecord = state.windows.get(appId);
    const isOpenApp = Boolean(windowRecord);
    const isMinimized = Boolean(windowRecord && state.minimized.has(appId));
    const isFocused = state.activeWindowId === appId;

    button.classList.toggle('is-active', isFocused || (isOpenApp && !isMinimized));
    button.classList.toggle('is-minimized', isMinimized);
    button.setAttribute('aria-pressed', String(isFocused || isOpenApp));
  });
}

function openExternalApp(appId) {
  const app = APP_CONFIG[appId];

  if (appId === 'github') {
    if (!app.url) {
      alert('GitHub profile URL is not configured yet. Add the profile URL to APP_CONFIG.github.url.');
      return;
    }
    unlockAchievement('sourceUnlocked', 'SOURCE UNLOCKED', 'GitHub opened.');
    window.open(app.url, '_blank', 'noopener,noreferrer');
    return;
  }

  if (appId === 'projects' || appId === 'contact') {
    openAppWindow(appId);
    return;
  }
}

function buildAppContent(appId) {
  switch (appId) {
    case 'projects':
      return renderProjectsWindow();
    case 'lab':
      return renderLabWindow();
    case 'about':
      return renderAboutWindow();
    case 'resume':
      return renderResumeWindow();
    case 'contact':
      return renderContactWindow();
    default:
      return renderHomeWindow();
  }
}

function renderHomeWindow() {
  const panel = document.createElement('div');
  panel.className = 'app-shell app-content';
  panel.innerHTML = `
    <div class="window-copy-block">
      <span class="section-kicker">Desktop</span>
      <h3>Jessabel OS</h3>
      <p>Creative systems, project infrastructure, and digital direction assembled into a single operating-style portfolio workspace.</p>
      <div class="profile-skills">
        <span>Design</span>
        <span>Development</span>
        <span>Business</span>
        <span>Systems</span>
      </div>
    </div>
  `;
  return panel;
}

function renderProjectsWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="window-copy-block">
      <span class="section-kicker">Projects</span>
      <div class="projects-grid" id="projectListContainer"></div>
    </div>
  `;

  const listContainer = shell.querySelector('#projectListContainer');
  listContainer.innerHTML = PROJECTS.map((project) => {
    const projectLogo = project.logo ? `<img src="${project.logo}" alt="${project.name} logo" />` : `<span class="project-initials">${project.name.slice(0, 2).toUpperCase()}</span>`;
    const primaryAction = project.id === 'cavalry-green' ? 'Launch Site' : project.id === 'alchemize' ? 'Visit GetAlchemize.com' : 'Launch Demo';
    const featuredBadge = project.id === 'alchemize' ? '<span class="featured-badge">Featured System</span>' : '';
    return `
      <article class="project-list-item ${project.id === 'alchemize' ? 'is-featured' : ''}" tabindex="0" data-project-id="${project.id}">
        <div class="project-list-main">
          <div class="project-badge">${projectLogo}</div>
          <div class="project-meta">
            ${featuredBadge}
            <span class="project-name">${project.name}</span>
            <span class="project-type">${project.category}</span>
          </div>
        </div>
        <div class="project-actions">
          <button class="os-button project-open" type="button" data-project-id="${project.id}">Details</button>
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryAction}</a>
        </div>
      </article>
    `;
  }).join('');

  shell.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => {
      const projectId = button.dataset.projectId;
      const detailWindow = createProjectDetailWindow(projectId);
      if (detailWindow) openWindow(detailWindow);
    });
  });

  shell.querySelectorAll('.project-list-item').forEach((card) => {
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const projectId = card.dataset.projectId;
        const detailWindow = createProjectDetailWindow(projectId);
        if (detailWindow) openWindow(detailWindow);
      }
    });
  });

  return shell;
}

function createProjectDetailWindow(projectId) {
  const project = PROJECTS.find((entry) => entry.id === projectId);
  if (!project) return null;

  const windowId = `project-${project.id}`;
  const existing = state.windows.get(windowId);
  if (existing) {
    focusWindow(windowId);
    return null;
  }

  const content = document.createElement('div');
  content.className = 'app-shell app-content';

  const primaryButtonLabel = project.id === 'cavalry-green' ? 'Launch Site' : project.id === 'alchemize' ? 'Visit GetAlchemize.com' : 'Launch Demo';
  const displayBadge = project.logo
    ? `<div class="project-plate"><img src="${project.logo}" alt="${project.name} logo" /></div>`
    : `<div class="project-plate"><div class="pinkladyz-wordmark" style="font-size: 2.2rem; letter-spacing: -0.05em;">${project.name}</div></div>`;

  content.innerHTML = `
    <div class="project-detail">
      <div class="project-identity">
        ${displayBadge}
        <div class="project-summary">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <div class="project-actions">
            <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel}</a>
          </div>
        </div>
      </div>
      <div class="project-summary">
        <div class="project-plate"><div class="preview-box ${project.logo ? 'preview-image' : ''}">
          ${project.logo ? `<img src="${project.logo}" alt="${project.name} preview" />` : `<span>${project.preview}</span>`}
        </div></div>
        <ul class="meta-list">
          <li><strong>Project type:</strong> ${project.type}</li>
          <li><strong>Role:</strong> ${project.role}</li>
          <li><strong>Tools:</strong> ${project.tools.join(', ')}</li>
        </ul>
      </div>
    </div>
  `;

  const projectPreset = getDefaultWindowLayout('projects');
  const windowData = {
    id: windowId,
    appId: 'projects',
    title: project.name,
    width: projectPreset?.width || 760,
    height: projectPreset?.height || 560,
    x: projectPreset?.x || 140,
    y: projectPreset?.y || 90,
    content,
    type: 'project',
  };

  if (project.id === 'alchemize') {
    unlockAchievement('systemArchitect', 'SYSTEM ARCHITECT', 'Alchemize accessed.');
  }

  return windowData;
}

function renderLabWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="lab-layout">
      <div class="lab-copy">
        <span class="section-kicker">Experimental Hardware Project</span>
        <div class="pinkladyz-wordmark">PINKLADYZ<span class="oled">OLED</span></div>
        <div class="lab-specs">
          <span>OLED</span>
          <span>Microcontroller</span>
          <span>Interface</span>
          <span>Debug</span>
        </div>
        <div class="project-actions lab-actions">
          <a class="primary-button" href="${LAB_PROJECT.url}" target="_blank" rel="noopener noreferrer">Open Project</a>
        </div>
      </div>
      <div class="lab-visual" aria-label="PinkLadyZ OLED hardware illustration"></div>
    </div>
  `;

  return shell;
}

function renderAboutWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="profile-layout">
      <div class="portrait-column">
        <div class="portrait-frame">
          <img src="jessabel-art-portrait.PNG" alt="Jessabel portrait" />
        </div>
      </div>
      <div class="profile-copy">
        <span class="section-kicker">System Profile</span>
        <h3>Jessabel Santos</h3>
        <p>Designer, developer, and business consultant working at the intersection of design, technology, and practical business needs.</p>
        <div class="profile-skills">
          <span>Designer</span>
          <span>Developer</span>
          <span>Business Consultant</span>
        </div>
        <div class="profile-columns">
          <div>
            <h4>Capabilities</h4>
            <ul class="meta-list compact-list">
              <li>Web Design</li>
              <li>Front-End Development</li>
              <li>UI/UX</li>
              <li>Digital Systems</li>
              <li>Business Technology</li>
            </ul>
          </div>
          <div>
            <h4>Languages</h4>
            <ul class="meta-list compact-list">
              <li>English</li>
              <li>Spanish</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  return shell;
}

function renderResumeWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="resume-block">
      <span class="section-kicker">Resume</span>
      <h3>Resume file pending</h3>
      <p>A resume document can be added here later for viewing and download support.</p>
    </div>
  `;
  return shell;
}

function renderContactWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="contact-layout">
      <span class="section-kicker">Contact</span>
      <h3>Jessabel Santos</h3>
      <div class="contact-list">
        <div class="contact-item">
          <span>Email</span>
          <a href="mailto:jessabel.santos@outlook.com">jessabel.santos@outlook.com</a>
        </div>
        <div class="contact-item">
          <span>Phone</span>
          <a href="tel:+14013161522">401-316-1522</a>
        </div>
        <div class="contact-item">
          <span>Agency</span>
          <a href="https://getalchemize.com/" target="_blank" rel="noopener noreferrer">GetAlchemize.com</a>
        </div>
      </div>
    </div>
  `;
  return shell;
}

function openAppWindow(appId) {
  const appKey = appId;
  const current = state.windows.get(appKey);

  if (current) {
    focusWindow(appKey);
    return current.windowElement;
  }

  const defaultLayout = getDefaultWindowLayout(appId);
  const data = {
    id: appKey,
    appId,
    title: APP_CONFIG[appId].name,
    width: defaultLayout?.width || (appId === 'contact' ? 480 : 720),
    height: defaultLayout?.height || (appId === 'projects' ? 500 : appId === 'about' ? 430 : appId === 'lab' ? 420 : appId === 'contact' ? 340 : 360),
    x: defaultLayout?.x || (160 + state.windows.size * 12),
    y: defaultLayout?.y || (90 + state.windows.size * 12),
    content: buildAppContent(appId),
    type: 'app',
  };

  registerAppOpen(appId);
  const windowElement = openWindow(data);
  return windowElement;
}

function calculateWindowPosition(windowData) {
  const defaultLayout = getDefaultWindowLayout(windowData.appId);
  if (defaultLayout) {
    return { x: defaultLayout.x, y: defaultLayout.y };
  }

  const offsetIndex = Array.from(state.windows.values()).filter((entry) => entry.appId !== 'home').length;
  const baseX = Math.min(180 + (offsetIndex % 3) * 16, window.innerWidth - 260);
  const baseY = Math.min(100 + (offsetIndex % 3) * 14, window.innerHeight - 200);

  return {
    x: Math.max(24, baseX),
    y: Math.max(60, baseY),
  };
}

function openWindow(windowData) {
  const template = document.getElementById('windowTemplate');
  const element = template.content.firstElementChild.cloneNode(true);
  const body = element.querySelector('.window-body');
  const position = calculateWindowPosition(windowData);

  element.dataset.windowId = windowData.id;
  element.classList.add('is-active');
  element.style.width = `${windowData.width}px`;
  element.style.height = `${windowData.height}px`;
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.querySelector('.window-title-text').textContent = windowData.title;

  body.appendChild(windowData.content);

  const closeButton = element.querySelector('.window-action.close');
  const minimizeButton = element.querySelector('.window-action.minimize');
  const maximizeButton = element.querySelector('.window-action.maximize');

  closeButton.addEventListener('click', () => closeWindow(windowData.id));
  minimizeButton.addEventListener('click', () => minimizeWindow(windowData.id));
  maximizeButton.addEventListener('click', () => toggleMaximizeWindow(windowData.id));

  element.addEventListener('pointerdown', () => focusWindow(windowData.id));

  setupWindowDrag(element, windowData.id);
  windowLayer.appendChild(element);

  state.windows.set(windowData.id, { ...windowData, windowElement: element, x: position.x, y: position.y });
  state.minimized.delete(windowData.id);
  renderDock();
  focusWindow(windowData.id);
  return element;
}

function closeWindow(windowId) {
  const record = state.windows.get(windowId);
  if (!record) return;

  record.windowElement.remove();
  state.windows.delete(windowId);
  state.minimized.delete(windowId);
  if (state.activeWindowId === windowId) {
    state.activeWindowId = null;
  }
  renderDock();
  updateDockState();
}

function minimizeWindow(windowId) {
  const record = state.windows.get(windowId);
  if (!record) return;

  record.windowElement.classList.add('is-minimized');
  state.minimized.add(windowId);
  state.activeWindowId = null;
  renderDock();
  updateDockState();
}

function restoreWindow(windowId) {
  const record = state.windows.get(windowId);
  if (!record) return;

  record.windowElement.classList.remove('is-minimized');
  state.minimized.delete(windowId);
  renderDock();
  focusWindow(windowId);
}

function toggleMaximizeWindow(windowId) {
  const record = state.windows.get(windowId);
  if (!record) return;

  const element = record.windowElement;
  const alreadyMaximized = element.classList.contains('is-maximized');

  if (alreadyMaximized) {
    element.classList.remove('is-maximized');
    const previous = record.restoreBounds || {
      width: `${record.width}px`,
      height: `${record.height}px`,
      left: `${record.x}px`,
      top: `${record.y}px`,
    };

    element.style.width = previous.width;
    element.style.height = previous.height;
    element.style.left = previous.left;
    element.style.top = previous.top;
    record.restoreBounds = null;
    focusWindow(windowId);
    return;
  }

  const rect = element.getBoundingClientRect();
  record.restoreBounds = {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    top: `${rect.top}px`,
  };

  element.classList.add('is-maximized');
  element.style.width = 'calc(100vw - 1.1rem)';
  element.style.height = 'calc(100vh - 5.8rem)';
  element.style.left = '0.55rem';
  element.style.top = '3.5rem';
  focusWindow(windowId);
}

function focusWindow(windowId) {
  Array.from(windowLayer.children).forEach((windowEl) => {
    const isActive = windowEl.dataset.windowId === windowId;
    windowEl.classList.toggle('is-active', isActive);
    if (isActive) {
      windowEl.style.zIndex = '20';
    } else {
      windowEl.style.zIndex = '1';
    }
  });

  state.activeWindowId = windowId;
  renderDock();
  updateDockState();
}

function setupWindowDrag(windowEl, windowId) {
  const header = windowEl.querySelector('.window-header');
  let dragInfo = null;

  header.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.window-action')) return;
    if (windowEl.classList.contains('is-maximized')) return;

    const rect = windowEl.getBoundingClientRect();
    dragInfo = {
      id: windowId,
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    };

    windowEl.setPointerCapture(event.pointerId);
    focusWindow(windowId);
  });

  header.addEventListener('pointermove', (event) => {
    if (!dragInfo) return;
    const deltaX = event.clientX - dragInfo.pointerStartX;
    const deltaY = event.clientY - dragInfo.pointerStartY;
    const nextLeft = Math.min(Math.max(dragInfo.startLeft + deltaX, 16), window.innerWidth - 180);
    const nextTop = Math.min(Math.max(dragInfo.startTop + deltaY, 60), window.innerHeight - 160);
    windowEl.style.left = `${nextLeft}px`;
    windowEl.style.top = `${nextTop}px`;
  });

  header.addEventListener('pointerup', () => {
    dragInfo = null;
  });

  header.addEventListener('pointercancel', () => {
    dragInfo = null;
  });
}

desktopHomeButton.addEventListener('click', () => {
  state.homeMenuOpen = !state.homeMenuOpen;
  homeMenu.classList.toggle('hidden', !state.homeMenuOpen);
  if (state.homeMenuOpen) {
    closeCommandPalette();
  }
});

homeMenu?.querySelectorAll('[data-home-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.homeAction;
    if (action === 'system') {
      showAboutSystem();
    }
    if (action === 'discovery') {
      showToast('SYSTEM DISCOVERY', `${getDiscoveryCount()} / ${PRIMARY_APP_IDS.length} discovered`);
    }
    if (action === 'achievements') {
      const list = Object.keys(state.achievements).length ? Object.keys(state.achievements).join(' · ') : 'No achievements yet';
      showToast('ACHIEVEMENTS', list);
    }
    if (action === 'palette') {
      openCommandPalette();
    }
    if (action === 'about') {
      openAppWindow('about');
    }
    homeMenu.classList.add('hidden');
    state.homeMenuOpen = false;
  });
});

commandInput?.addEventListener('input', (event) => updateCommandSuggestions(event.target.value));
commandInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    executeCommand(commandInput.value);
  }
  if (event.key === 'Escape') {
    closeCommandPalette();
  }
});

document.addEventListener('keydown', (event) => {
  const isMeta = event.metaKey || event.ctrlKey;
  if (isMeta && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (state.commandPaletteOpen) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
  }

  if (event.key === 'Escape' && state.commandPaletteOpen) {
    closeCommandPalette();
  }
});

if (commandPalette) {
  commandPalette.addEventListener('click', (event) => {
    if (event.target === commandPalette) closeCommandPalette();
  });
}

loadSessionState();
renderDesktopIcons();
renderDock();
updateTime();
updateDiscoveryIndicator();
setInterval(updateTime, 30000);
bootSequence();
