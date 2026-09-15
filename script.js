const SHOW_BOOT_EVERY_LOAD = true;
const BOOT_DURATION_MS = 2400;

const APP_CONFIG = {
  home: {
    id: 'home',
    name: 'Jessabel Home',
    icon: 'jessabel-os-logo.png',
    kind: 'desktop',
    defaultWindow: false,
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    icon: 'projects-icon.png',
    kind: 'workspace',
    defaultWindow: true,
  },
  lab: {
    id: 'lab',
    name: 'Lab',
    icon: 'lab-icon.png',
    kind: 'workspace',
    defaultWindow: true,
  },
  about: {
    id: 'about',
    name: 'About Me',
    icon: 'jessabel-art-portrait.PNG',
    iconRound: true,
    kind: 'workspace',
    defaultWindow: true,
  },
  resume: {
    id: 'resume',
    name: 'Resume',
    icon: 'resume-icon.png',
    kind: 'workspace',
    defaultWindow: true,
  },
  github: {
    id: 'github',
    name: 'GitHub',
    icon: 'github-icon.png',
    kind: 'external',
    defaultWindow: false,
    url: 'https://github.com/Jessabel-Art',
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    icon: 'contact-icon.png',
    kind: 'workspace',
    defaultWindow: true,
  },
};

const PROJECTS = [
  {
    id: 'alchemize',
    name: 'Alchemize',
    category: 'Business',
    type: 'Agency / Business Website',
    description: 'Jessabel’s broader business and agency presence, representing services and digital strategy work.',
    role: 'Brand and digital presence',
    tools: ['Branding', 'Web Design', 'Business Systems'],
    url: 'https://getalchemize.com/',
    logo: 'alchemize-emblem-light.png',
    logoDark: true,
    previewImage: 'alchemize-vup.png',
    featured: true,
  },
  {
    id: 'cavalry-green',
    name: 'Cavalry Green LLC',
    category: 'Business',
    type: 'Client Website',
    description: 'A branded client experience blending heritage, identity, and a digital-first service presence.',
    role: 'Design systems and front-end implementation',
    tools: ['Branding', 'Web Design', 'Front-End'],
    url: 'https://cavalry-green.jessabel.art/',
    logo: 'cavalry-green-logo.png',
  },
  {
    id: 'cleaning-service-demo',
    name: 'Cleaning Service Demo',
    category: 'Web Design',
    type: 'Demo Website',
    description: 'A clean service-site concept focused on clarity, trust, and conversion-focused layout structure.',
    role: 'Landing page concept and UI direction',
    tools: ['UI', 'Front-End', 'Marketing'],
    url: 'https://cleaning-service-demo.jessabel.art/',
    logo: 'cleaning-demo-icon.png',
  },
  {
    id: 'fmblifestyle',
    name: 'FMBLifestyle',
    category: 'Development',
    type: 'Portfolio',
    description: 'An external portfolio project highlighting personal creative work and selected visual storytelling.',
    role: 'Creative portfolio frontend',
    tools: ['Portfolio Design', 'Front-End'],
    url: 'https://fmbl.jessabel.art/',
    logo: 'FMBLifestyle.png',
  },
];

const PROJECT_FILTERS = ['All', 'Web Design', 'Business', 'Development'];

const LAB_PROJECT = {
  id: 'pinkladyz-oled',
  name: 'PinkLadyZ OLED',
  category: 'Experimental Hardware Project',
  description: 'Creative exploration around an OLED display interface, embedded experimentation, and playful technical identity.',
  role: 'Experimental concepting and front-end tinkering',
  tools: ['OLED', 'Microcontroller', 'Interface', 'Debug'],
  url: 'https://pinkladyz-oled.jessabel.art/',
  image: 'pinkladyz-icon.png',
};

const LAB_ACTIVITY = [
  { label: 'OLED display test', status: 'OK' },
  { label: 'UI prototype', status: 'OK' },
  { label: 'Power optimization', status: 'In Progress' },
  { label: 'Next', status: 'Interface refinement', isNote: true },
];

const PRIMARY_APP_IDS = ['projects', 'lab', 'about', 'resume', 'contact'];
const DISCOVERY_KEY = 'jessabel-os-discovery';
const ACHIEVEMENTS_KEY = 'jessabel-os-achievements';
const POT_IMAGES = ['pot-1.png', 'pot-2.png', 'pot-3.png', 'pot-4.png', 'pot-5.png', 'pot-6.png'];
const POT_LABELS = [
  'A seed just planted',
  'First sprout breaking through',
  'Young leaves unfurling',
  'Steady, healthy growth',
  'Nearly in full bloom',
  'Fully grown — fully explored',
];

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
  projectFilter: 'All',
};

const desktopIcons = document.getElementById('desktopIcons');
const dock = document.getElementById('dock');
const windowLayer = document.getElementById('windowLayer');
const bootScreen = document.getElementById('bootScreen');
const systemTime = document.getElementById('systemTime');
const desktopHomeButton = document.getElementById('desktopHomeButton');
const homeMenu = document.getElementById('homeMenu');
const commandPalette = document.getElementById('commandPalette');
const commandInput = document.getElementById('commandInput');
const commandSuggestions = document.getElementById('commandSuggestions');
const discoveryChip = document.getElementById('systemDiscovery');
const toastContainer = document.getElementById('toastContainer');
const discoveryPlantImage = document.getElementById('discoveryPlantImage');
const discoveryPlantLabel = document.getElementById('discoveryPlantLabel');
const searchTrigger = document.getElementById('searchTrigger');

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function loadPersistedState() {
  try {
    state.discovery = JSON.parse(localStorage.getItem(DISCOVERY_KEY) || '{}');
  } catch (error) {
    state.discovery = {};
  }
  try {
    state.achievements = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '{}');
  } catch (error) {
    state.achievements = {};
  }
}

function savePersistedState() {
  try {
    localStorage.setItem(DISCOVERY_KEY, JSON.stringify(state.discovery));
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state.achievements));
  } catch (error) {
    /* localStorage unavailable — progress just won't persist */
  }
}

function getDiscoveryCount() {
  return PRIMARY_APP_IDS.filter((appId) => state.discovery[appId]).length;
}

function updateDiscoveryIndicator() {
  const count = getDiscoveryCount();

  if (discoveryChip) {
    discoveryChip.innerHTML = `
      <span>System Discovery</span>
      <strong>${count} / ${PRIMARY_APP_IDS.length}</strong>
    `;
    discoveryChip.classList.toggle('is-complete', count === PRIMARY_APP_IDS.length);
  }

  if (discoveryPlantImage) {
    const stageIndex = Math.min(count, POT_IMAGES.length - 1);
    const nextSrc = POT_IMAGES[stageIndex];
    if (!discoveryPlantImage.src.endsWith(nextSrc)) {
      discoveryPlantImage.style.opacity = '0';
      setTimeout(() => {
        discoveryPlantImage.src = nextSrc;
        discoveryPlantImage.alt = POT_LABELS[stageIndex];
        discoveryPlantImage.style.opacity = '1';
      }, 160);
    }
  }

  if (discoveryPlantLabel) {
    discoveryPlantLabel.textContent = `System Discovery ${count}/${PRIMARY_APP_IDS.length}`;
  }
}

function markDiscovered(appId) {
  if (!PRIMARY_APP_IDS.includes(appId) || state.discovery[appId]) {
    return false;
  }

  state.discovery[appId] = true;
  savePersistedState();
  updateDiscoveryIndicator();

  if (getDiscoveryCount() === PRIMARY_APP_IDS.length) {
    unlockAchievement('fullSystemAccess', 'FULL SYSTEM ACCESS', 'All primary apps discovered.');
  }

  return true;
}

function unlockAchievement(id, label, body) {
  if (state.achievements[id]) return false;

  state.achievements[id] = true;
  savePersistedState();
  showToast(label, body, 'green', true);
  return true;
}

function showToast(title, detail, accent = 'blue', isAchievement = false) {
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${accent}`;
  toast.setAttribute('role', 'status');

  const indicator = isAchievement
    ? `<img class="toast-badge" src="achievement-badge.png" alt="" aria-hidden="true" />`
    : `<div class="toast-indicator" aria-hidden="true"></div>`;

  toast.innerHTML = `
    ${indicator}
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
    setTimeout(() => toast.remove(), 240);
  }, 2600);
}

function updateTime() {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: 'short' });
  systemTime.textContent = `${day} ${formatTime(now)}`;
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

  const graphic = button.querySelector('.icon-graphic');
  if (app.iconRound) graphic.classList.add('is-round');
  const img = document.createElement('img');
  img.src = app.icon;
  img.alt = '';
  img.loading = 'eager';
  img.decoding = 'async';
  graphic.appendChild(img);

  if (PRIMARY_APP_IDS.includes(appId) && state.discovery[appId]) {
    button.classList.add('is-discovered');
  }

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  button.addEventListener('click', () => {
    if (app.kind === 'external') {
      openExternalApp(appId);
      return;
    }

    if (isTouchDevice || button.classList.contains('is-selected')) {
      openAppWindow(appId);
      return;
    }

    document.querySelectorAll('.desktop-icon.is-selected').forEach((el) => el.classList.remove('is-selected'));
    button.classList.add('is-selected');
  });

  button.addEventListener('dblclick', () => {
    if (app.kind === 'external') return;
    openAppWindow(appId);
  });

  return button;
}

function renderDesktopIcons() {
  const appOrder = ['projects', 'lab', 'about', 'resume', 'contact', 'github'];
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
    projects: { x: 150, y: 66, width: 700, height: 520 },
    lab: { x: window.innerWidth - 620, y: 76, width: 560, height: 430 },
    about: { x: 150, y: 420, width: 640, height: 420 },
    contact: { x: window.innerWidth - 620, y: 430, width: 420, height: 400 },
    resume: { x: window.innerWidth - 560, y: 130, width: 400, height: 300 },
  };

  return layout[appId] || null;
}

function registerAppOpen(appId) {
  if (PRIMARY_APP_IDS.includes(appId)) {
    const discovered = markDiscovered(appId);
    if (discovered) {
      if (appId === 'projects') unlockAchievement('portfolioAccess', 'PORTFOLIO ACCESS', 'You opened the Projects app.');
      if (appId === 'lab') unlockAchievement('hardwareDetected', 'HARDWARE DETECTED', 'PinkLadyZ OLED signal found.');
      if (appId === 'about') unlockAchievement('systemArchitect', 'SYSTEM ARCHITECT', 'About Me unlocked.');
      if (appId === 'resume') unlockAchievement('paperTrail', 'PAPER TRAIL', 'Resume unlocked.');
      if (appId === 'contact') unlockAchievement('openLine', 'OPEN LINE', 'Contact channels unlocked.');
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
    <div class="window-copy-block">
      <span class="section-kicker">Jessabel OS</span>
      <h3>Version 1.0</h3>
      <p>A nature-inspired operating workspace by Jessabel Santos.</p>
      <div class="profile-skills compact-system-details">
        <span>Design</span>
        <span>Development</span>
        <span>Business Technology</span>
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

  const img = document.createElement('img');
  img.src = app.icon;
  img.alt = '';
  img.loading = 'lazy';
  button.appendChild(img);

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

  const openWindowIds = Array.from(state.windows.keys()).filter((windowId) => windowId !== 'home' && APP_CONFIG[state.windows.get(windowId)?.appId]);
  const seenApps = new Set();
  openWindowIds.forEach((windowId) => {
    const appId = state.windows.get(windowId)?.appId;
    if (!appId || seenApps.has(appId)) return;
    seenApps.add(appId);
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
      showToast('SYSTEM', 'GitHub profile URL is not configured yet.');
      return;
    }
    unlockAchievement('sourceUnlocked', 'SOURCE UNLOCKED', 'GitHub opened.');
    window.open(app.url, '_blank', 'noopener,noreferrer');
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

function getProjectPrimaryLabel(project) {
  if (project.id === 'alchemize') return 'Visit GetAlchemize.com';
  if (project.id === 'cavalry-green') return 'Launch Site';
  return 'Launch Demo';
}

function renderProjectBadge(project, isFeatured) {
  if (project.logo) {
    return `<img src="${project.logo}" alt="${project.name} logo" loading="lazy" />`;
  }
  return `<span class="project-initials">${project.name.slice(0, 2).toUpperCase()}</span>`;
}

function renderProjectsWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="window-copy-block">
      <span class="section-kicker">Projects</span>
      <div class="projects-toolbar" id="projectsToolbar" role="tablist" aria-label="Filter projects by category"></div>
      <div class="projects-grid" id="projectListContainer"></div>
      <div class="projects-footer">
        <span id="projectsCount">${PROJECTS.length} Projects</span>
        <span>Build · Design · Solve · Grow</span>
      </div>
    </div>
  `;

  const toolbar = shell.querySelector('#projectsToolbar');
  PROJECT_FILTERS.forEach((filter) => {
    const count = filter === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === filter).length;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'filter-tab';
    tab.dataset.filter = filter;
    tab.setAttribute('role', 'tab');
    tab.textContent = filter === 'All' ? `All (${count})` : filter;
    tab.classList.toggle('is-active', state.projectFilter === filter);
    tab.addEventListener('click', () => {
      state.projectFilter = filter;
      renderProjectList(shell);
    });
    toolbar.appendChild(tab);
  });

  renderProjectList(shell);
  return shell;
}

function renderProjectList(shell) {
  const listContainer = shell.querySelector('#projectListContainer');
  const countLabel = shell.querySelector('#projectsCount');
  const toolbar = shell.querySelector('#projectsToolbar');

  toolbar.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.filter === state.projectFilter);
  });

  const visible = state.projectFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter((project) => project.category === state.projectFilter);

  countLabel.textContent = `${visible.length} Project${visible.length === 1 ? '' : 's'}`;

  listContainer.innerHTML = visible.map((project) => {
    const isFeatured = Boolean(project.featured);
    const primaryAction = getProjectPrimaryLabel(project);
    const featuredBadge = isFeatured ? '<span class="featured-badge">Featured Project</span>' : '';
    return `
      <article class="project-card ${isFeatured ? 'is-featured' : ''}" tabindex="0" data-project-id="${project.id}">
        ${featuredBadge}
        <div class="project-card-main">
          <div class="project-badge">${renderProjectBadge(project, isFeatured)}</div>
          <div class="project-meta">
            <span class="project-name">${project.name}</span>
            <span class="project-type">${project.type}</span>
          </div>
        </div>
        <div class="project-card-actions">
          <button class="os-button project-open" type="button" data-project-id="${project.id}">Details</button>
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryAction}</a>
        </div>
      </article>
    `;
  }).join('') || '<p style="color:var(--text-muted); grid-column:1/-1;">No projects in this category yet.</p>';

  listContainer.querySelectorAll('.project-open').forEach((button) => {
    button.addEventListener('click', () => {
      const projectId = button.dataset.projectId;
      const detailWindow = createProjectDetailWindow(projectId);
      if (detailWindow) openWindow(detailWindow);
    });
  });

  listContainer.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const projectId = card.dataset.projectId;
        const detailWindow = createProjectDetailWindow(projectId);
        if (detailWindow) openWindow(detailWindow);
      }
    });
  });
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

  const primaryButtonLabel = getProjectPrimaryLabel(project);
  const plateClass = project.logoDark ? 'project-plate is-dark' : 'project-plate';
  const displayBadge = project.logo
    ? `<div class="${plateClass}"><img src="${project.logo}" alt="${project.name} logo" /></div>`
    : `<div class="project-plate"><div class="pinkladyz-wordmark" style="font-size: 2.2rem; letter-spacing: -0.03em; color: var(--text-dark);">${project.name}</div></div>`;

  const previewMarkup = project.previewImage
    ? `<img src="${project.previewImage}" alt="${project.name} preview" loading="lazy" />`
    : project.logo
      ? `<img src="${project.logo}" alt="${project.name} preview" loading="lazy" />`
      : `<span>${project.name}</span>`;

  content.innerHTML = `
    <div class="project-detail">
      <div class="project-identity">
        ${displayBadge}
        <div class="project-summary">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <div class="project-card-actions">
            <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel}</a>
          </div>
        </div>
      </div>
      <div class="project-summary">
        <div class="preview-box preview-image">${previewMarkup}</div>
        <ul class="meta-list">
          <li><strong>Category:</strong> ${project.category}</li>
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
    width: projectPreset?.width || 720,
    height: projectPreset?.height || 560,
    x: (projectPreset?.x || 140) + 30,
    y: (projectPreset?.y || 90) + 20,
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
    <div class="lab-shell">
      <div class="lab-layout">
        <div class="lab-copy">
          <span class="section-kicker">Experimental Hardware Project</span>
          <div class="pinkladyz-wordmark">PINKLADYZ<span class="oled">OLED</span></div>
          <p>${LAB_PROJECT.description}</p>
          <div class="lab-specs">
            ${LAB_PROJECT.tools.map((tool) => `<span>${tool}</span>`).join('')}
          </div>
          <div class="project-card-actions lab-actions">
            <a class="primary-button" href="${LAB_PROJECT.url}" target="_blank" rel="noopener noreferrer">Open Project</a>
          </div>
        </div>
        <div class="lab-visual">
          <img src="${LAB_PROJECT.image}" alt="PinkLadyZ OLED hardware, a custom circuit board with a pink pixel-heart display" />
        </div>
      </div>
      <div class="lab-log">
        <div>
          <div class="lab-log-title">Lab // Latest Activity</div>
          <ul class="lab-log-list">
            ${LAB_ACTIVITY.map((entry) => `
              <li>
                <span>${entry.label}</span>
                <span class="lab-log-status ${entry.status === 'In Progress' ? 'is-progress' : ''}">${entry.status}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="lab-quote">"Technology with intention."</div>
      </div>
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
          <img src="jessabel-art-portrait.PNG" alt="Portrait of Jessabel Santos" />
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
      <div class="resume-header">
        <img src="resume-icon.png" alt="" aria-hidden="true" />
        <div>
          <span class="section-kicker">Resume</span>
          <h3>Resume</h3>
        </div>
      </div>
      <p>A downloadable resume isn't attached to this workspace yet. Reach out directly and a current copy will be sent over.</p>
      <div class="resume-actions">
        <a class="primary-button" href="mailto:jessabel.santos@outlook.com?subject=Resume%20Request">Request a Copy</a>
      </div>
      <p class="resume-note">Looking for experience, skills, and recent work — the Contact and About Me apps cover the highlights in the meantime.</p>
    </div>
  `;
  return shell;
}

function renderContactWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="contact-layout">
      <div class="contact-header">
        <div>
          <span class="section-kicker">Contact</span>
          <h3>Let's Build Something Meaningful</h3>
          <p>Have a project, idea, or just want to connect? I'd love to hear from you.</p>
        </div>
        <img src="contact-icon.png" alt="" aria-hidden="true" />
      </div>
      <div class="contact-list">
        <div class="contact-item">
          <div class="contact-item-label">
            <span>Email</span>
            <strong>jessabel.santos@outlook.com</strong>
          </div>
          <a class="link-button" href="mailto:jessabel.santos@outlook.com">Send</a>
        </div>
        <div class="contact-item">
          <div class="contact-item-label">
            <span>Let's Talk</span>
            <strong>401-316-1522</strong>
          </div>
          <a class="link-button" href="tel:+14013161522">Call</a>
        </div>
        <div class="contact-item">
          <div class="contact-item-label">
            <span>Follow</span>
            <strong>GitHub</strong>
          </div>
          <a class="link-button" href="${APP_CONFIG.github.url}" target="_blank" rel="noopener noreferrer">Visit</a>
        </div>
        <div class="contact-item">
          <div class="contact-item-label">
            <span>Agency</span>
            <strong>GetAlchemize.com</strong>
          </div>
          <a class="link-button" href="https://getalchemize.com/" target="_blank" rel="noopener noreferrer">Visit</a>
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
    height: defaultLayout?.height || (appId === 'projects' ? 520 : appId === 'about' ? 430 : appId === 'lab' ? 460 : appId === 'contact' ? 400 : 360),
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
  const rawPosition = calculateWindowPosition(windowData);

  const maxWidth = window.innerWidth - 32;
  const maxHeight = window.innerHeight - 96;
  const safeWidth = Math.min(windowData.width, maxWidth);
  const safeHeight = Math.min(windowData.height, maxHeight);
  const position = {
    x: Math.min(Math.max(rawPosition.x, 16), Math.max(16, window.innerWidth - safeWidth - 16)),
    y: Math.min(Math.max(rawPosition.y, 46), Math.max(46, window.innerHeight - safeHeight - 16)),
  };

  element.dataset.windowId = windowData.id;
  element.classList.add('is-active');
  element.style.width = `${safeWidth}px`;
  element.style.height = `${safeHeight}px`;
  element.style.left = `${position.x}px`;
  element.style.top = `${position.y}px`;
  element.querySelector('.window-title-text').textContent = windowData.title;

  body.appendChild(windowData.content);

  const closeButton = element.querySelector('.window-action.close');
  const minimizeButton = element.querySelector('.window-action.minimize');
  const maximizeButton = element.querySelector('.window-action.maximize');
  const menuButton = element.querySelector('.window-menu-btn');

  closeButton.addEventListener('click', () => closeWindow(windowData.id));
  minimizeButton.addEventListener('click', () => minimizeWindow(windowData.id));
  maximizeButton.addEventListener('click', () => toggleMaximizeWindow(windowData.id));
  menuButton.addEventListener('click', () => toggleMaximizeWindow(windowData.id));

  element.addEventListener('pointerdown', () => focusWindow(windowData.id));

  setupWindowDrag(element, windowData.id);
  windowLayer.appendChild(element);

  state.windows.set(windowData.id, { ...windowData, windowElement: element, x: position.x, y: position.y, width: safeWidth, height: safeHeight });
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
    if (event.target.closest('.window-action') || event.target.closest('.window-menu-btn')) return;
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
    const nextTop = Math.min(Math.max(dragInfo.startTop + deltaY, 46), window.innerHeight - 160);
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

document.querySelectorAll('.system-menu-item').forEach((button) => {
  button.addEventListener('click', () => {
    const menu = button.dataset.menu;
    if (menu === 'file') {
      state.homeMenuOpen = !state.homeMenuOpen;
      homeMenu.classList.toggle('hidden', !state.homeMenuOpen);
    } else if (menu === 'edit') {
      showToast('EDIT', 'Nothing to edit here — this is a living portfolio.');
    } else if (menu === 'view') {
      showToast('VIEW', 'Try Ctrl/Cmd + K for the command palette.');
    } else if (menu === 'window') {
      const openCount = state.windows.size;
      showToast('WINDOW', openCount ? `${openCount} window${openCount === 1 ? '' : 's'} open.` : 'No windows open yet.');
    } else if (menu === 'help') {
      openCommandPalette();
    }
  });
});

searchTrigger?.addEventListener('click', () => {
  if (state.commandPaletteOpen) {
    closeCommandPalette();
  } else {
    openCommandPalette();
  }
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

  if (event.key === 'Escape' && state.homeMenuOpen) {
    homeMenu.classList.add('hidden');
    state.homeMenuOpen = false;
  }
});

if (commandPalette) {
  commandPalette.addEventListener('click', (event) => {
    if (event.target === commandPalette) closeCommandPalette();
  });
}

document.addEventListener('click', (event) => {
  if (!state.homeMenuOpen) return;
  if (event.target.closest('#homeMenu') || event.target.closest('#desktopHomeButton')) return;
  homeMenu.classList.add('hidden');
  state.homeMenuOpen = false;
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.desktop-icon')) return;
  document.querySelectorAll('.desktop-icon.is-selected').forEach((el) => el.classList.remove('is-selected'));
});

loadPersistedState();
renderDesktopIcons();
renderDock();
updateTime();
updateDiscoveryIndicator();
setInterval(updateTime, 15000);
bootSequence();
