const SHOW_BOOT_EVERY_LOAD = true;
const BOOT_DURATION_MS = 2400;

const NO_DRAG_SELECTOR = 'button, a, input, select, textarea, [role="button"], [data-no-drag], .window-traffic, .window-menu-btn';
const DRAG_MOVE_THRESHOLD = 4;

function isApplePlatform() {
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

function getPrimaryModifierLabel() {
  return isApplePlatform() ? '⌘' : 'Ctrl';
}

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
    cardClassification: 'Business Operations Platform',
    classification: 'Business Operations & Service Delivery Platform',
    extended: true,
    overview: [
      'Alchemize Business Services is a professional-services company supported by a custom business operations platform designed around the full service lifecycle.',
      'Rather than treating the public website, clients, services, pricing, invoicing, and billing as disconnected features, the platform is structured around shared business data and a centralized service architecture.',
      'The result is a system designed to support both the customer-facing experience and the operational infrastructure required to manage and scale the business.',
    ],
    roleTitle: 'Founder · Product Architect · Business Systems Designer · UI/UX & Implementation Lead',
    role: 'I defined the business requirements, service architecture, pricing logic, administrative workflows, data relationships, user experience, and implementation direction for the platform.',
    problem: 'A service business can quickly accumulate disconnected pricing sheets, client records, invoices, service definitions, and administrative workflows. Alchemize was designed to establish a single operational foundation instead of allowing those systems to evolve independently.',
    architectureFlow: [
      { layer: 'Public Experience', items: ['Services', 'Service discovery', 'Business positioning', 'Customer-facing experience'] },
      { layer: 'Service Catalog', items: ['Canonical service definitions', 'Service categories', 'Pricing types', 'Service status', 'Add-ons / tiers', 'Pricing rules'] },
      { layer: 'Client Operations', items: ['Client records', 'Assigned services', 'Administrative workflows', 'Client portal foundation (in progress)'] },
      { layer: 'Billing', items: ['Invoice generation', 'Service-linked line items', 'Payments', 'Recurring billing readiness'] },
    ],
    architectureFuture: { layer: 'Future System Extensions', items: ['Proposals / SOWs', 'Expanded client portal views', 'Deeper automation', 'Additional recurring workflows'] },
    canonicalService: {
      intro: 'The Services module is designed as the canonical source of truth for the platform rather than duplicating service and pricing logic across individual screens.',
      hub: 'Service Catalog',
      branches: ['Clients', 'Invoices', 'Billing'],
      future: 'Future Platform\nProposals · Portal · Automation',
      supports: ['Service identity', 'Category', 'Description', 'Availability / status', 'Pricing methodology', 'Tiers', 'Add-ons', 'Client assignment', 'Invoice generation', 'Future recurring billing'],
    },
    pricingModels: ['Fixed', 'Formula-Based', 'Starting At', 'Custom SOW', 'Manual Review', 'Pending Authorization', 'Future Expansion / Not Offered'],
    pricingNote: 'Different professional services require different commercial rules, so the platform’s data model was designed to accommodate those differences centrally rather than one-off, per-screen.',
    adminOperations: ['Service catalog management', 'Client records', 'Service assignment', 'Pricing', 'Invoice workflows', 'Payments / billing', 'Financial & operational records', 'Administrative control of service availability'],
    systemDesign: 'Alchemize is structured so that core business objects relate to one another instead of existing as isolated UI features. Services and pricing can flow into client records and billing workflows, creating a foundation that can be extended without rebuilding the same business logic in each module.',
    techImplementation: [
      { label: 'Front End', items: ['React 19', 'React Router', 'Vite build tooling', 'Component-based architecture', 'Multi-language (i18n) support'] },
      { label: 'Back End', items: ['PHP API (versioned endpoints)', 'Composer-managed dependencies', 'PHPMailer for transactional email'] },
      { label: 'Data', items: ['Relational database, 40+ versioned SQL migrations', 'Canonical service catalog schema', 'Domain model spanning leads → clients → services → invoices → payments'] },
      { label: 'Application', items: ['Role-based admin accounts & invitations', 'Client portal foundation', 'Stripe & PayPal payment integration', 'Google Calendar & Drive sync'] },
      { label: 'Deployment', items: ['Apache-hosted (.htaccess)', 'GitHub Actions CI', 'Automated a11y/security checks (Playwright, axe-core)', 'Scripted deploy verification'] },
    ],
    designDecisions: [
      { title: 'One Service Source of Truth', body: 'Pricing and service definitions should not be independently recreated inside Clients, Billing, Invoices, or future modules.' },
      { title: 'Business Rules Belong in the System', body: 'Different services require different pricing and authorization behaviors, so those rules are represented structurally rather than being buried only in interface copy.' },
      { title: 'Designed for Extension', body: 'The architecture is intended to allow proposals, recurring billing, client-facing service views, and other future modules to consume the same underlying service model.' },
    ],
    scopeSummary: {
      type: 'Business Operations Platform',
      role: 'Founder / Product Architecture / Business Systems / UI/UX / Implementation',
      focus: ['Service Operations', 'Business Systems', 'Data Architecture', 'Administrative UX'],
      status: 'Active Development',
    },
    outcomeStatement: 'One operational foundation connecting service definitions, pricing logic, client records, invoicing, payments, and future platform capabilities.',
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
    cardClassification: 'Client Website + Lead Intake',
    classification: 'Client Website + Lead Intake System',
    template: 'cavalry',
    ownership: 'Client branding and logo were supplied. My responsibility was translating that existing identity into the digital experience and designing and implementing the website and supporting business workflow.',
    overview: [
      'Cavalry Green LLC is a production website and digital quote-intake system for a veteran-owned lawn care and property-services company serving communities in North Carolina.',
      'The business needed more than an online service brochure. The website needed to establish a professional web presence while giving prospective customers a structured way to explain a job, identify the services they need, provide contact preferences, and submit photos before the business follows up.',
    ],
    role: 'Website strategy, UI/UX, frontend development, quote-workflow architecture, backend implementation, database integration, deployment, and technical SEO.',
    roleItems: ['Website Strategy', 'UI/UX', 'Frontend Development', 'Quote Workflow Architecture', 'Backend Implementation', 'Database Integration', 'Deployment', 'Technical SEO'],
    problem: 'A generic contact form cannot adequately capture what a property-service business needs in order to evaluate a job. Lawn care, cleanup, landscaping, hauling, and storm-cleanup requests all carry different details, so the system was designed to turn an unstructured inquiry into an organized, actionable quote request.',
    problemServices: ['Lawn Care', 'Landscaping', 'Property Cleanups', 'Hauling & Debris Removal', 'Storm Cleanup', 'Recurring Maintenance'],
    journey: ['Discover Services', 'Understand Service Area', 'Request Quote', 'Select Services', 'Describe Job', 'Upload Photos', 'Choose Contact Method', 'Business Notification'],
    architectureFlow: ['Customer', 'Quote Request Form', 'PHP Endpoint', 'Server Validation', 'MariaDB'],
    architectureBranches: ['Quote Request Record', 'Job Photo Records', 'Email Notification'],
    architectureNote: 'The public quote form is connected to a server-side workflow. Submissions are validated, stored as structured quote-request records, associated job photos are processed separately, and the business receives a notification containing the information needed to follow up.',
    photoFormats: ['JPEG', 'PNG', 'WebP', 'HEIC', 'HEIF'],
    photoLimits: [
      { label: 'Max Photos', value: '5 per request' },
      { label: 'Max File Size', value: '10 MB per photo' },
      { label: 'Max Request Size', value: '25 MB total' },
    ],
    photoSafeguards: ['Server-side MIME detection', 'Extension assigned from validated MIME — not client input', 'Safe, randomly generated filenames', 'Directory-traversal protection', 'Photos recorded separately from the quote request', 'Quote + photo records written in a single database transaction'],
    photoNote: 'Customers can provide useful visual context while the server retains full control over what files are accepted and how they are stored.',
    notificationNote: 'A successful submission generates a business notification containing the information needed to follow up quickly.',
    notificationFields: ['Request ID', 'Customer Name', 'Phone', 'Email', 'Address', 'Requested Services', 'Preferred Contact Method', 'Job Details', 'Submission Timestamp', 'Photo Count'],
    notificationTech: ['PHPMailer', 'SMTP'],
    seoGroups: [
      { label: 'Deployment', items: ['Responsive interface', 'Production deployment', 'Custom production domain', 'Hostinger deployment'] },
      { label: 'Search & Discoverability', items: ['Sitemap', 'robots.txt', 'Canonical metadata', 'Open Graph metadata', 'Structured data', 'Search Console / indexing prep'] },
    ],
    techGroups: [
      { label: 'Frontend / Delivery', items: ['Responsive public website', 'Static / Next.js export'] },
      { label: 'Backend', items: ['PHP endpoint', 'Server-side validation'] },
      { label: 'Data', items: ['MariaDB', 'quote_requests', 'quote_request_photos'] },
      { label: 'Notifications', items: ['PHPMailer', 'SMTP'] },
      { label: 'Infrastructure', items: ['Hostinger', 'Production domain'] },
    ],
    outcomeStatement: 'A production business website that functions as both a public presence and the first stage of Cavalry Green’s customer-acquisition workflow — turning an unstructured “contact us” interaction into organized, actionable quote requests.',
    outcomeRelation: ['Public Website', 'Quote Requests', 'Business Follow-Up'],
    liveUrl: 'https://cavalrygreenllc.com/',
    url: 'https://cavalry-green.jessabel.art/',
    logo: 'cavalry-green-logo.png',
  },
  {
    id: 'cleaning-service-demo',
    name: 'Cleaning Service Demo',
    category: 'Web Design',
    cardClassification: 'Full-Service Business Platform',
    classification: 'Full-Service Business Operations Platform',
    template: 'cleaning',
    ownership: 'Built as a demo based on a real client engagement — not the client’s live production system.',
    overview: [
      'A complete operations platform designed around the lifecycle of a residential service business — connecting dynamic estimates, scheduling, booking, customer records, deposits, payments, invoicing, and administrative workflows through shared business logic.',
    ],
    roleTitle: 'Product Architecture · UI/UX · Frontend Development · Booking & Business-Rule Logic',
    role: 'Pricing architecture, booking and availability logic, payment and deposit workflow design, administrative tooling, and deployment.',
    lifecycle: ['Service Request', 'Estimate', 'Availability', 'Booking', 'Payment', 'Operations', 'Invoice / Reporting'],
    problem: 'A service business needs more than a booking form. Availability, pricing, deposits, customer history, appointments, payments, invoices, and administrative controls all affect one another. The system was designed so those workflows operate as connected business processes rather than isolated screens.',
    compareBefore: ['Estimate', 'Calendar', 'Customer', 'Payment', 'Invoice'],
    compareAfter: ['Estimate', 'Booking', 'Customer', 'Payment', 'Operations'],
    journey: [
      { title: 'Configure Service', body: 'The customer provides property details and selects a service type.' },
      { title: 'Estimate', body: 'Pricing logic calculates an estimate from the configured business rules.' },
      { title: 'Select Availability', body: 'Available times are shown based on operating hours and day-closure rules.' },
      { title: 'Book', body: 'The appointment is created through the booking flow’s validated form logic.' },
      { title: 'Deposit & Policy', body: 'Deposit, hold-window, and cancellation policy are presented before confirmation.' },
      { title: 'Service Record', body: 'The booking becomes part of the operational and administrative workflow.' },
    ],
    pricingInputs: [
      { label: 'Property', items: ['Bedrooms', 'Bathrooms', 'Square footage (office/commercial)'] },
      { label: 'Service', items: ['Service type', 'Deep-clean duration multiplier', 'Move-in / move-out multiplier'] },
      { label: 'Condition', items: ['Property condition — light / standard / heavy', 'Pets on site'] },
      { label: 'Options', items: ['Add-ons', 'Service frequency', 'Frequency discount', 'Promo code support'] },
    ],
    pricingFlow: ['Property', 'Service Type', 'Condition', 'Add-Ons', 'Frequency'],
    pricingNote: 'The estimate engine combines service configuration and business rules through one shared pricing module, rather than recalculating price logic in more than one place across the app.',
    bookingPipeline: ['Requested Date', 'Operating Hours', 'Day-Closure Rules', 'Time-Slot Selection', 'Form & Policy Validation', 'Confirmed Booking'],
    adminModules: [
      { label: 'Dashboard', body: 'Operational overview of bookings and activity.' },
      { label: 'Bookings', body: 'Appointment records and booking management.' },
      { label: 'Calendar', body: 'Operational scheduling visibility.' },
      { label: 'Clients', body: 'Customer records with lifetime-value segmentation.' },
      { label: 'Payments & Invoicing', body: 'Invoice ledger, balances, and CSV export.' },
      { label: 'Reports', body: 'Revenue-by-service and booking-status reporting.' },
      { label: 'Reviews', body: 'Customer review and testimonial visibility.' },
      { label: 'Maintenance', body: 'Local data and demo-environment health status.' },
    ],
    paymentFlow: ['Booking Submitted', 'Estimate Total', '$50 Deposit Policy', 'Payment Instructions', 'Invoice Record'],
    paymentPolicies: ['$50 non-refundable deposit', 'Due within 24 hours or the slot may release', 'One reschedule allowed with 48 hours notice', 'Cancelling within 48 hours forfeits the deposit'],
    canonicalIntro: 'Pricing, booking, and invoice values were aligned around one shared data and rules layer so the customer-facing and administrative views never independently calculate or duplicate the same record.',
    canonicalFlow: ['Estimate', 'Booking', 'Invoice'],
    canonicalPrinciples: ['Canonical Pricing Rules', 'Shared Booking & Invoice Data', 'Admin / Client Parity', 'Consistent Form Validation'],
    accessNote: 'Authentication in this public demo is a local, role-based session used to separate the customer and admin experiences. Production identity, data, and payment integrations were intentionally scoped out of the public repository and designed to sit behind a server-side boundary rather than ship real credentials or backend access inside a portfolio demo.',
    accessDetails: [
      { label: 'Session Roles', value: 'Client / Admin demo roles' },
      { label: 'Route Separation', value: '/portal vs. /admin' },
      { label: 'Repo Boundary', value: 'No production secrets or backend config committed' },
      { label: 'Production Path', value: 'Real integrations designed for a server-side boundary' },
    ],
    architectureFlow: ['Customer UI — React + Vite', 'Booking Form + Estimate Engine', 'Local Demo Data Layer'],
    architectureBranches: ['Admin Portal — Bookings · Calendar · Clients · Reports', 'Client Portal — Appointments · Payment Center · Profile'],
    techGroups: [
      { label: 'Front End', items: ['React 18', 'Vite', 'React Router', 'Tailwind CSS'] },
      { label: 'UI System', items: ['Radix UI primitives', 'shadcn-style components', 'Framer Motion', 'Lucide icons'] },
      { label: 'Business Logic', items: ['Canonical estimate / pricing module', 'Booking + invoice generation', 'Role-based demo sessions'] },
      { label: 'Admin Tooling', items: ['react-big-calendar', 'Recharts reporting', 'CSV export'] },
      { label: 'Data & State', items: ['Local demo datasets', 'sessionStorage pending bookings', 'Shared records across customer & admin views'] },
    ],
    designDecisions: [
      { title: 'Shared Estimate Logic', body: 'One pricing rules module is used everywhere an estimate is calculated, so customer and admin views can’t drift into inconsistent numbers.' },
      { title: 'Designed Against Double-Booking', body: 'Time-slot selection is scoped to operating-hours and closure rules the same way a production system would enforce availability server-side.' },
      { title: 'Role-Separated Access', body: 'Customer and admin experiences are gated by distinct session roles and routes rather than one view with hidden admin controls.' },
      { title: 'Shared Data Across Surfaces', body: 'Bookings, invoices, and reports all read from the same underlying records instead of independently recalculating customer-facing data.' },
    ],
    outcomeStatement: 'A connected service-business platform where customer booking, pricing, scheduling, payment, and administrative operations operate as parts of the same workflow.',
    outcomeRelation: ['Customer Experience', 'Booking Engine', 'Business Logic', 'Payments + Data', 'Admin Operations'],
    tech: ['React', 'Vite', 'Tailwind CSS', 'Radix UI', 'Framer Motion', 'react-big-calendar', 'Recharts'],
    url: 'https://cleaning-service-demo.jessabel.art/',
    logo: 'cleaning-demo-icon.png',
  },
  {
    id: 'fmblifestyle',
    name: 'FMBLifestyle',
    category: 'Development',
    cardClassification: 'Personal Finance App',
    classification: 'Personal Finance Application — Interactive Demo',
    template: 'fmb',
    overview: [
      'FMBLifestyle — Finance My Best Lifestyle — explores how multiple parts of personal financial planning can be brought into one coherent interface.',
      'Instead of treating budgeting, assets, debt, savings goals, and mortgage readiness as separate tools, the application organizes them around a consolidated view of financial position and progress.',
    ],
    role: 'Product concept · Information architecture · UI/UX · Frontend implementation · Financial dashboard design',
    problem: 'Personal financial information is often fragmented across bank accounts, budgeting tools, debt statements, investment accounts, savings goals, and long-term planning tools. FMBLifestyle explores a unified interface where those areas can be understood as parts of one financial picture.',
    architectureInputs: ['Income', 'Spending', 'Assets', 'Liabilities'],
    architectureHub: 'Financial Dashboard',
    architectureModules: ['Net Worth', 'Accounts', 'Budget', 'Debt', 'Savings', 'Mortgage Readiness'],
    coreExperiences: [
      { title: 'Dashboard', body: 'Consolidated overview of income, expenses, savings rate, balances, and recent transactions.' },
      { title: 'Net Worth & Accounts', body: 'Checking, savings, investment, vehicle, and real-estate balances alongside liabilities in one net-worth view.' },
      { title: 'Budgeting', body: 'Monthly category budgeting with spending visibility.' },
      { title: 'Savings / Envelopes', body: 'Goal-oriented savings buckets that separate financial objectives from general account balances.' },
      { title: 'Debt', body: 'Outstanding balances, APR, and payoff progress — including snowball/avalanche payoff planning — made visible alongside the rest of the financial picture.' },
      { title: 'Mortgage Readiness', body: 'A planning workspace for a future home purchase — readiness scoring, debt-to-income modeling, and loan-program comparisons. Not a lending qualification or approval tool.' },
    ],
    demoNote: 'The portfolio version uses sample financial data and a local/offline-first data model. It demonstrates the product experience without connecting to real financial accounts or exposing personal financial information.',
    techGroups: [
      { label: 'Front End', items: ['React 19', 'TypeScript', 'Vite', 'React Router'] },
      { label: 'UI & Visualization', items: ['Component-based UI', 'Recharts data visualization', 'lucide-react icons', 'Responsive dashboard layout'] },
      { label: 'Data', items: ['Local data service (localStorage)', 'Offline-first, sample dataset', 'Single-page application'] },
      { label: 'Forward Path', items: ['Desktop-packaging groundwork (Tauri) present in the repository — not active in the web demo'] },
    ],
    flowSteps: ['Financial Data', 'Local Data Service', 'Dashboard + Planning Views'],
    flowModules: ['Accounts', 'Budget', 'Debt', 'Savings', 'Net Worth', 'Mortgage Readiness'],
    outcomeStatement: 'A unified financial-planning interface demonstrating how budgeting, net worth, debt, savings, and long-term financial goals can be presented as one connected financial picture.',
    outcomeRelation: ['Net Worth', 'Accounts', 'Budget', 'Debt', 'Savings', 'Mortgage Readiness'],
    tech: ['React 19', 'TypeScript', 'Vite', 'React Router', 'Recharts', 'Local Data Service'],
    url: 'https://fmbl.jessabel.art/',
    logo: 'FMBLifestyle.png',
  },
  {
    id: 'santos-formworks',
    name: 'Santos FormWorks',
    category: 'Business',
    cardClassification: '3D-Printing Storefront',
    classification: '3D-Printing Storefront & Custom Order Platform',
    template: 'santos',
    status: 'in-development',
    statusLabel: 'In Development · Early Stage',
    statusNote: 'Santos FormWorks is an active product build currently in the early stages of development. This portfolio entry documents the system as it exists today — implemented functionality, emerging structure, and the direction of the product as development continues.',
    overview: [
      'Santos FormWorks is a responsive storefront concept for a 3D-printing business — a catalog of ready-made printed products alongside a structured path for customers to request a custom print.',
      'The build is exploring how a small print shop can present its work, let customers browse and filter a catalog, and turn a custom idea into an organized request, ahead of the ordering, payment, and production workflow planned for a later stage.',
    ],
    role: 'Product concept · Product architecture · UI/UX · Frontend development · System design',
    currentBuild: [
      { title: 'Product Catalog', status: 'Implemented', body: 'Browsable catalog with category, color, material, and price-range filters, plus favorites — all running client-side against a typed product dataset.' },
      { title: 'Cart & Favorites', status: 'Implemented', body: 'In-memory cart and favorites state shared across pages for the current session.' },
      { title: 'Custom Order Request', status: 'Implemented', body: 'A multi-step request form — project details, reference file upload, print preferences — that validates input and produces a local request preview.' },
      { title: 'File Upload & Validation', status: 'Implemented', body: 'Drag-and-drop upload accepting 3D-model and reference formats, with client-side size, count, and type validation.' },
      { title: 'Core Site Pages', status: 'Implemented', body: 'Home, Shop, Custom Orders, About, FAQ, and Contact, sharing a common layout, navigation, and footer.' },
      { title: 'Ordering, Accounts & Payments', status: 'Planned', body: 'Real inventory, customer accounts, checkout with Stripe/PayPal, shipping and pickup scheduling, and order tracking are the next-phase scope — not part of the current build.' },
    ],
    structureNodes: ['Storefront Pages', 'Shared Components & Catalog Data', 'Custom Order Form + Local Preview'],
    structureNote: 'Today the product is a single Next.js front end: the storefront pages, a shared catalog/cart layer, and the custom-order form all run client-side against a typed local dataset — there is no live backend or database yet.',
    techGroups: [
      { label: 'Front End', items: ['Next.js 16 (App Router)', 'React 19', 'TypeScript'] },
      { label: 'Styling', items: ['Tailwind CSS 4', 'Custom design tokens', 'Responsive breakpoints'] },
      { label: 'Data (Current)', items: ['Typed local product catalog', 'In-memory cart / favorites state', 'Client-side form + file validation'] },
      { label: 'Deployment', items: ['GitHub Actions CI (lint, typecheck, build)', 'Node.js runtime target', 'Live staging build on Hostinger'] },
    ],
    activeFocus: ['Rounding out the storefront UI and custom-order flow', 'Refining the live staging build'],
    nextStage: ['Real product inventory & checkout', 'Customer accounts', 'Payments (Stripe / PayPal)', 'Shipping & pickup scheduling', 'Order tracking & email', 'Secure file storage for production files'],
    url: 'https://linen-buffalo-819897.hostingersite.com/',
    githubUrl: 'https://github.com/Jessabel-Art/Santos-FormWorks',
    logo: 'santos-formworks-logo.png',
    logoDark: true,
    logoWide: true,
  },
];

const PROJECT_FILTERS = ['All', 'Web Design', 'Business', 'Development'];

const LAB_PROJECT = {
  id: 'pinkladyz-oled',
  name: 'PinkLadyZ OLED',
  category: 'ESP32 Embedded Display System',
  description: 'Custom ESP32 firmware driving a 128×64 SSD1306 OLED through a boot/dashboard/idle state machine — blending hand-converted bitmap scenes with live clock and weather data pulled over Wi-Fi.',
  techStack: ['ESP32', 'C++', 'Arduino', 'SSD1306', 'Adafruit GFX', 'I²C', 'PROGMEM', 'Bitmap Graphics'],
  hardware: 'ESP32 development board · SSD1306 128×64 OLED · I²C @ 0x3C (SDA → GPIO 21, SCL → GPIO 22, 3.3V/GND)',
  firmware: [
    { label: 'Language', value: 'C++, Arduino framework (Arduino IDE)' },
    { label: 'Display', value: 'Adafruit_SSD1306 + Adafruit_GFX over Wire (I²C)' },
    { label: 'Connectivity', value: 'WiFi + HTTPClient + ArduinoJson — NTP time sync and Open-Meteo weather' },
  ],
  graphicsPipeline: '13 custom 128×64 monochrome scenes (car, garage, glitch transitions, hello card) were converted to byte arrays and stored in PROGMEM flash, then blitted into the SSD1306 framebuffer with Adafruit GFX’s drawBitmap() — layered under stars, rain, snow, moonlight, and a vaporwave grid drawn pixel-by-pixel with GFX primitives.',
  displayLogic: 'A six-state machine (boot, dashboard, cruise, night, garage, shutdown) runs on an ~80ms frame timer. Boot and shutdown play scripted, elapsed-time-gated sequences; the idle states loop weather-reactive effects around the bitmap scenes; a serial command interface (p / b / g / d / n / c / w) triggers any state directly for development.',
  installSteps: [
    'Install Adafruit GFX, Adafruit SSD1306, and ArduinoJson via the Arduino IDE Library Manager.',
    'Wire the SSD1306 to the ESP32 over I²C (SDA → GPIO 21, SCL → GPIO 22).',
    'Copy config.example.h to config.h and add Wi-Fi credentials and coordinates (config.h is git-ignored).',
    'Select the ESP32 board profile and upload PinkLadyZ-OLED.ino.',
  ],
  flowNodes: ['PROGMEM Bitmaps', 'Arduino Firmware', 'Adafruit GFX', 'SSD1306 (I²C)', '128×64 OLED'],
  metadata: [
    { label: 'MCU', value: 'ESP32' },
    { label: 'Language', value: 'C++' },
    { label: 'Display', value: 'SSD1306 128×64 (I²C)' },
    { label: 'Graphics', value: 'Monochrome Bitmap / PROGMEM' },
    { label: 'Framework', value: 'Arduino' },
    { label: 'Source', value: 'GitHub' },
  ],
  url: 'https://pinkladyz-oled.jessabel.art/',
  githubUrl: 'https://github.com/Jessabel-Art/PinkLadyZ-OLED-Display',
  image: 'pinkladyz-icon.png',
};

const PRIMARY_APP_IDS = ['projects', 'lab', 'about', 'resume', 'contact'];
const DISCOVERY_KEY = 'jessabel-os-discovery';
const ACHIEVEMENTS_KEY = 'jessabel-os-achievements';
const RECENT_KEY = 'jessabel-os-recent';
const PREFERENCES_KEY = 'jessabel-os-preferences';
const MAX_RECENT_ITEMS = 5;
const POT_IMAGES = ['pot-1.png', 'pot-2.png', 'pot-3.png', 'pot-4.png', 'pot-5.png', 'pot-6.png'];
const POT_LABELS = [
  'A seed just planted',
  'First sprout breaking through',
  'Young leaves unfurling',
  'Steady, healthy growth',
  'Nearly in full bloom',
  'Fully grown — fully explored',
];

const CONTACT_EMAIL = 'hello@getalchemize.com';
const RESUME_REQUEST_URL = `mailto:${CONTACT_EMAIL}?subject=Resume%20Request`;

const DEFAULT_PREFERENCES = {
  desktopIcons: true,
  discoveryWidget: true,
  dock: true,
  reduceMotion: false,
};

const ACHIEVEMENT_DEFINITIONS = {
  portfolioAccess: { label: 'PORTFOLIO ACCESS', body: 'You opened the Projects app.' },
  hardwareDetected: { label: 'HARDWARE DETECTED', body: 'PinkLadyZ OLED signal found.' },
  systemArchitect: { label: 'SYSTEM ARCHITECT', body: 'About Me unlocked.' },
  paperTrail: { label: 'PAPER TRAIL', body: 'Resume unlocked.' },
  openLine: { label: 'OPEN LINE', body: 'Contact channels unlocked.' },
  sourceUnlocked: { label: 'SOURCE UNLOCKED', body: 'GitHub accessed.' },
  fullSystemAccess: { label: 'FULL SYSTEM ACCESS', body: 'All primary apps discovered.' },
};

// Aliases resolve to either a PROJECTS id, or the sentinel below for the Lab/PinkLadyZ app.
const LAB_ALIAS = '__lab__';
const PROJECT_ALIASES = {
  alchemize: 'alchemize',
  'cavalry': 'cavalry-green',
  'cavalrygreen': 'cavalry-green',
  'cavalry-green': 'cavalry-green',
  'cavalrygreenllc': 'cavalry-green',
  'cleaning': 'cleaning-service-demo',
  'cleaningservice': 'cleaning-service-demo',
  'cleaningservicedemo': 'cleaning-service-demo',
  'fmblifestyle': 'fmblifestyle',
  'fmb': 'fmblifestyle',
  'santos': 'santos-formworks',
  'santosformworks': 'santos-formworks',
  'santos-formworks': 'santos-formworks',
  'formworks': 'santos-formworks',
  'pinkladyz': LAB_ALIAS,
  'pinkladyzoled': LAB_ALIAS,
  'oled': LAB_ALIAS,
};

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
  recent: [],
  preferences: { ...DEFAULT_PREFERENCES },
  activeDropdown: null,
  focusMode: false,
  focusModeSuppressed: [],
  commandHistory: [],
  commandHistoryIndex: -1,
  commandLog: [],
  submenuOpen: null,
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
const commandOutput = document.getElementById('commandOutput');
const systemDropdown = document.getElementById('systemDropdown');
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

function loadRecent() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    state.recent = Array.isArray(saved) ? saved.slice(0, MAX_RECENT_ITEMS) : [];
  } catch (error) {
    state.recent = [];
  }
}

function saveRecent() {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(state.recent));
  } catch (error) {
    /* localStorage unavailable — recent history just won't persist */
  }
}

// Records a genuinely visitor-opened app/project. This is the single place
// "recent" entries are written, so File → Open Recent, the `recent` command,
// and any future surface all read the same real history — nothing fabricated.
function recordRecent({ type, id, name }) {
  if (!id) return;
  state.recent = state.recent.filter((entry) => !(entry.type === type && entry.id === id));
  state.recent.unshift({ type, id, name, at: Date.now() });
  state.recent = state.recent.slice(0, MAX_RECENT_ITEMS);
  saveRecent();
}

function loadPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    state.preferences = { ...DEFAULT_PREFERENCES, ...saved };
  } catch (error) {
    state.preferences = { ...DEFAULT_PREFERENCES };
  }
}

function savePreferences() {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(state.preferences));
  } catch (error) {
    /* localStorage unavailable — preferences just won't persist */
  }
}

function applyPreferences() {
  document.body.classList.toggle('pref-icons-off', !state.preferences.desktopIcons);
  document.body.classList.toggle('pref-discovery-off', !state.preferences.discoveryWidget);
  document.body.classList.toggle('pref-dock-off', !state.preferences.dock);
  document.body.classList.toggle('pref-reduce-motion', !!state.preferences.reduceMotion);
}

// Shared setter used by both the Preferences window and the View menu
// checkboxes, so the two surfaces can never drift out of sync.
function setPreference(key, value) {
  if (!(key in DEFAULT_PREFERENCES)) return;
  state.preferences[key] = value;
  savePreferences();
  applyPreferences();
  refreshOpenPreferencesWindow();
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
    unlockAchievement('fullSystemAccess');
  }

  return true;
}

function unlockAchievement(id) {
  if (state.achievements[id]) return false;
  const definition = ACHIEVEMENT_DEFINITIONS[id];
  if (!definition) return false;

  state.achievements[id] = true;
  savePersistedState();
  showToast(definition.label, definition.body, 'green', true);
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
    lab: { x: window.innerWidth - 700, y: 76, width: 640, height: 560 },
    about: { x: 130, y: 56, width: 860, height: 680 },
    contact: { x: window.innerWidth - 620, y: 430, width: 420, height: 400 },
    resume: { x: window.innerWidth - 560, y: 130, width: 400, height: 300 },
  };

  return layout[appId] || null;
}

function registerAppOpen(appId) {
  if (PRIMARY_APP_IDS.includes(appId)) {
    const discovered = markDiscovered(appId);
    if (discovered) {
      if (appId === 'projects') unlockAchievement('portfolioAccess');
      if (appId === 'lab') unlockAchievement('hardwareDetected');
      if (appId === 'about') unlockAchievement('systemArchitect');
      if (appId === 'resume') unlockAchievement('paperTrail');
      if (appId === 'contact') unlockAchievement('openLine');
    }
  }

  if (appId === 'github') {
    unlockAchievement('sourceUnlocked');
  }

  if (getDiscoveryCount() === PRIMARY_APP_IDS.length && !state.achievements.fullSystemAccess) {
    unlockAchievement('fullSystemAccess');
  }

  if (PRIMARY_APP_IDS.includes(appId) && state.discovery[appId]) {
    const icon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
    if (icon) {
      icon.classList.add('is-discovered');
    }
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function appendCommandLog(promptText, lines, isError = false) {
  state.commandLog.push({ promptText, lines, isError });
  state.commandLog = state.commandLog.slice(-12);
  renderCommandOutput();
}

function clearCommandLog() {
  state.commandLog = [];
  renderCommandOutput();
}

function renderCommandOutput() {
  if (!commandOutput) return;
  if (!state.commandLog.length) {
    commandOutput.classList.add('hidden');
    commandOutput.innerHTML = '';
    return;
  }

  commandOutput.classList.remove('hidden');
  commandOutput.innerHTML = state.commandLog.map((entry) => `
    <div class="command-log-entry">
      <p class="command-log-line command-log-echo">&gt; ${escapeHtml(entry.promptText)}</p>
      ${entry.lines.map((line) => `<p class="command-log-line ${entry.isError ? 'command-log-error' : ''}">${escapeHtml(line)}</p>`).join('')}
    </div>
  `).join('');
  commandOutput.scrollTop = commandOutput.scrollHeight;
}

function getWhoamiLines() {
  return [
    'JESSABEL SANTOS',
    'Business Consultant · Designer · Technology Builder',
    '',
    'FOCUS',
    'Web Design · UI/UX · Front-End Development',
    'Business Consulting · Process Design · Digital Operations',
    'Systems Implementation · Automation · Business Technology',
    '',
    'CURRENT ENVIRONMENT',
    'Jessabel OS — Portfolio Edition',
  ];
}

function getDiscoverLines() {
  const count = getDiscoveryCount();
  const total = PRIMARY_APP_IDS.length;
  const barWidth = 20;
  const filled = Math.round((count / total) * barWidth);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);

  const rows = PRIMARY_APP_IDS.map((appId) => {
    const name = getAppDisplayName(appId) === LAB_PROJECT.name ? APP_CONFIG.lab.name : getAppDisplayName(appId);
    const label = name.padEnd(14, ' ');
    return `${label} ${state.discovery[appId] ? 'DISCOVERED' : 'UNDISCOVERED'}`;
  });

  return ['SYSTEM DISCOVERY', '', `${bar}  ${count} / ${total}`, '', ...rows];
}

function getAchievementsLines() {
  const unlocked = Object.keys(state.achievements).filter((id) => ACHIEVEMENT_DEFINITIONS[id]);
  if (!unlocked.length) return ['No achievements unlocked yet.'];
  return unlocked.map((id) => `${ACHIEVEMENT_DEFINITIONS[id].label} — ${ACHIEVEMENT_DEFINITIONS[id].body}`);
}

function getWindowsLines() {
  const ids = Array.from(state.windows.keys());
  if (!ids.length) return ['No windows open.'];
  const rows = ids.map((id, index) => `${String(index + 1).padStart(2, '0')}  ${state.windows.get(id).title}`);
  return ['ACTIVE WINDOWS', '', ...rows, '', `${ids.length} window${ids.length === 1 ? '' : 's'} active.`];
}

function getRecentLines() {
  if (!state.recent.length) return ['No recent activity.'];
  const rows = state.recent.map((entry, index) => `${String(index + 1).padStart(2, '0')}  ${entry.name}`);
  return ['RECENT', '', ...rows];
}

function getHelpLines() {
  return [
    'SYSTEM',
    'help, whoami, clear',
    '',
    'APPS',
    'projects, lab, about, resume, contact',
    '',
    'PROJECTS',
    'open [project], recent',
    '',
    'WINDOWS',
    'windows, arrange, minimize, close, desktop',
    '',
    'DISCOVERY',
    'discover, achievements',
  ];
}

function resolveProjectAlias(rawTarget) {
  const key = (rawTarget || '').trim().toLowerCase().replace(/[\s_]+/g, '');
  return PROJECT_ALIASES[key] || null;
}

// Every executable command funnels into the same shared actions
// (openAppWindow / openProject / arrangeWindows / etc.) used by the rest of
// the UI — the command interface has no parallel implementation of its own.
const COMMAND_DEFINITIONS = [
  { command: 'help', description: 'Show available commands', type: 'info', run: () => getHelpLines() },
  { command: 'whoami', description: 'Show system profile', type: 'info', run: () => getWhoamiLines() },
  { command: 'discover', description: 'Show discovery progress', type: 'info', run: () => getDiscoverLines() },
  { command: 'achievements', description: 'Show unlocked achievements', type: 'info', run: () => getAchievementsLines() },
  { command: 'windows', description: 'List open windows', type: 'info', run: () => getWindowsLines() },
  { command: 'recent', description: 'Show recently opened items', type: 'info', run: () => getRecentLines() },
  { command: 'clear', description: 'Clear command output', type: 'info', run: () => { clearCommandLog(); return null; } },
  { command: 'projects', description: 'Open Projects', type: 'action', run: () => { openAppWindow('projects'); return 'Opening Projects...'; } },
  { command: 'lab', description: 'Open Lab', type: 'action', run: () => { openAppWindow('lab'); return 'Opening Lab...'; } },
  { command: 'about', description: 'Open About Me', type: 'action', run: () => { openAppWindow('about'); return 'Opening About Me...'; } },
  { command: 'resume', description: 'Open Resume', type: 'action', run: () => { openAppWindow('resume'); return 'Opening Resume...'; } },
  { command: 'contact', description: 'Open Contact', type: 'action', run: () => { openAppWindow('contact'); return 'Opening Contact...'; } },
  { command: 'github', description: 'Open GitHub', type: 'action', run: () => { openExternalApp('github'); return 'Opening GitHub...'; } },
  { command: 'system', description: 'Open system info', type: 'action', run: () => { showAboutSystem(); return null; } },
  { command: 'status', description: 'Open system info', type: 'action', run: () => { showAboutSystem(); return null; } },
  { command: 'arrange', description: 'Arrange open windows', type: 'action', run: () => (arrangeWindows() ? 'Windows arranged.' : 'No windows to arrange.') },
  { command: 'minimize', description: 'Minimize the active window', type: 'action', run: () => (minimizeActiveWindow() ? 'Window minimized.' : 'No active window.') },
  { command: 'close', description: 'Close the active window', type: 'action', run: () => (closeActiveWindow() ? 'Window closed.' : 'No active window.') },
  { command: 'desktop', description: 'Show the desktop', type: 'action', run: () => { showDesktop(); return 'Showing desktop.'; } },
];

function updateCommandSuggestions(value = '') {
  if (!commandSuggestions) return;
  const query = value.trim().toLowerCase();
  const commands = COMMAND_DEFINITIONS.filter((entry) => !query || entry.command.includes(query) || entry.description.toLowerCase().includes(query));

  const openHint = !query || 'open'.includes(query) || query.startsWith('open')
    ? [{ command: 'open [project]', description: 'Launch a project by name', isTemplate: true }]
    : [];

  const combined = [...openHint, ...commands].slice(0, 6);

  commandSuggestions.innerHTML = combined.map((entry) => `
    <button type="button" class="command-suggestion" data-command="${entry.command}" ${entry.isTemplate ? 'data-template="true"' : ''}>
      <span>${entry.command}</span>
      <small>${entry.description}</small>
    </button>
  `).join('');

  commandSuggestions.querySelectorAll('.command-suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.template) {
        commandInput.value = 'open ';
        commandInput.focus();
        return;
      }
      const selected = button.dataset.command;
      commandInput.value = selected;
      executeCommand(selected);
    });
  });
}

function openCommandPalette() {
  if (!commandPalette || !commandInput) return;
  closeSystemDropdown();
  homeMenu.classList.add('hidden');
  state.homeMenuOpen = false;
  state.commandPaletteOpen = true;
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  state.commandHistoryIndex = state.commandHistory.length;
  updateCommandSuggestions('');
  renderCommandOutput();
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
  if (!value) return;

  state.commandHistory.push(value);
  state.commandHistory = state.commandHistory.slice(-50);
  state.commandHistoryIndex = state.commandHistory.length;

  const [word, ...rest] = value.split(/\s+/);
  const lower = word.toLowerCase();

  if (lower === 'open') {
    const target = rest.join(' ');
    const resolved = resolveProjectAlias(target);

    if (!target) {
      appendCommandLog(value, ['Usage: open [project]', 'Try: open alchemize, open cavalry, open cleaning, open fmblifestyle, open santos, open pinkladyz'], true);
    } else if (!resolved) {
      appendCommandLog(value, [`No project found matching "${target}".`, 'Type "help" to view available commands.'], true);
    } else if (resolved === LAB_ALIAS) {
      appendCommandLog(value, [`Opening ${LAB_PROJECT.name}...`]);
      openAppWindow('lab');
      commandInput.value = '';
      closeCommandPalette();
    } else {
      const project = PROJECTS.find((entry) => entry.id === resolved);
      appendCommandLog(value, [`Opening ${project.name}...`]);
      openProject(resolved);
      commandInput.value = '';
      closeCommandPalette();
    }
    return;
  }

  const matching = COMMAND_DEFINITIONS.find((entry) => entry.command === lower);
  if (!matching) {
    appendCommandLog(value, [`Command not found: ${value}`, 'Type "help" to view available commands.'], true);
    commandInput.value = '';
    updateCommandSuggestions('');
    return;
  }

  const result = matching.run();

  if (matching.type === 'info') {
    if (result) appendCommandLog(value, result);
    commandInput.value = '';
    updateCommandSuggestions('');
    return;
  }

  if (result) appendCommandLog(value, [result]);
  commandInput.value = '';
  closeCommandPalette();
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
    unlockAchievement('sourceUnlocked');
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
  if (project.id === 'santos-formworks') return 'Launch Demo';
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
    const badgeClass = `project-badge${project.logoDark ? ' is-dark' : ''}`;
    const statusPill = project.status === 'in-development'
      ? '<span class="status-pill is-development"><span class="status-dot" aria-hidden="true"></span>In Development · Early Stage</span>'
      : '';
    return `
      <article class="project-card ${isFeatured ? 'is-featured' : ''}" tabindex="0" data-project-id="${project.id}">
        ${featuredBadge}
        <div class="project-card-main">
          <div class="${badgeClass}">${renderProjectBadge(project, isFeatured)}</div>
          <div class="project-meta">
            <span class="project-name">${project.name}</span>
            <span class="project-type">${project.cardClassification}</span>
            ${statusPill}
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
      openProject(button.dataset.projectId);
    });
  });

  listContainer.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProject(card.dataset.projectId);
      }
    });
  });
}

// The original shared project-detail template. Cavalry Green, Cleaning
// Service Demo, and FMBLifestyle continue to render through this — untouched.
function renderStandardProjectDetail(project, displayBadge, primaryButtonLabel) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const capabilityGroupsMarkup = project.capabilityGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">
        ${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const techChipsMarkup = project.tech.map((item) => `<span class="chip tech-chip">${item}</span>`).join('');

  return `
    <div class="project-detail-grid">
      <div class="project-detail-left">
        ${displayBadge}
        <h3>${project.name}</h3>
        <span class="project-classification">${project.classification}</span>
        ${project.ownership ? `<p class="project-ownership-note">${project.ownership}</p>` : ''}
        <div class="project-overview">${overviewMarkup}</div>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel}</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text">${project.role}</p>
        </div>
        <div class="detail-section">
          <span class="section-kicker">System / Capabilities</span>
          ${capabilityGroupsMarkup}
        </div>
        <div class="detail-section">
          <span class="section-kicker">Tech / Implementation</span>
          <div class="chip-row">${techChipsMarkup}</div>
        </div>
      </div>
    </div>
  `;
}

// Alchemize-only extended case-study template. Nothing here is shared with
// (or affects) the standard project-detail renderer above.
const ARCH_FORK_SVG = '<svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M100 0 L26 40 M100 0 L174 40" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

function renderExtendedProjectDetail(project, displayBadge, primaryButtonLabel) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const renderArchNode = (layer, extraClass = '', chipClass = 'chip') => `
    <div class="arch-layer ${extraClass}">
      <span class="arch-layer-title">${layer.layer}</span>
      <div class="chip-row">${layer.items.map((item) => `<span class="${chipClass}">${item}</span>`).join('')}</div>
    </div>
  `;

  const [publicExperience, serviceCatalog, clientOperations, billing] = project.architectureFlow;
  const archDiagramLabel = [publicExperience, serviceCatalog, clientOperations, billing, project.architectureFuture]
    .filter(Boolean).map((layer) => layer.layer).join(' → ');

  const archDiagramMarkup = `
    <div class="arch-diagram" aria-label="System architecture: ${archDiagramLabel}">
      <div class="arch-tier">${renderArchNode(publicExperience)}</div>
      <div class="arch-arrow" aria-hidden="true">↓</div>
      <div class="arch-tier">${renderArchNode(serviceCatalog, 'arch-layer-hub')}</div>
      <div class="arch-fork-fallback arch-arrow" aria-hidden="true">↓</div>
      <div class="arch-fork" aria-hidden="true">${ARCH_FORK_SVG}</div>
      <div class="arch-tier arch-tier-split">
        ${renderArchNode(clientOperations)}
        ${renderArchNode(billing)}
      </div>
      ${project.architectureFuture ? `
        <div class="arch-fork-fallback arch-arrow" aria-hidden="true">↓</div>
        <div class="arch-fork arch-fork-merge" aria-hidden="true">${ARCH_FORK_SVG}</div>
        ${renderArchNode(project.architectureFuture, 'arch-layer-future', 'chip chip-future')}
      ` : ''}
    </div>
  `;

  const cs = project.canonicalService;
  const canonicalMarkup = cs ? `
    <div class="canonical-arch-grid">
      <div class="canonical-arch-left">
        <p class="detail-role-text">${cs.intro}</p>
        <div class="chip-row">${cs.supports.map((item) => `<span class="chip">${item}</span>`).join('')}</div>
      </div>
      <div class="canonical-arch-right">
        <div class="service-tree">
          <div class="service-tree-hub">${cs.hub}</div>
          <div class="service-tree-trunk" aria-hidden="true"></div>
          <div class="service-tree-branches">
            ${cs.branches.map((branch) => `
              <div class="service-tree-branch">
                <div class="service-tree-tick" aria-hidden="true"></div>
                <div class="service-tree-node">${branch}</div>
              </div>
            `).join('')}
          </div>
          <div class="service-tree-trunk" aria-hidden="true"></div>
          <div class="service-tree-node service-tree-future">${cs.future.split('\n').map((line) => `<span>${line}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  ` : '';

  const pricingMarkup = project.pricingModels ? `
    <div class="pricing-logic-row">${project.pricingModels.map((model) => `<span class="pricing-chip">${model}</span>`).join('')}</div>
    <p class="detail-role-text">${project.pricingNote}</p>
  ` : '';

  const adminOpsMarkup = project.adminOperations
    ? `<div class="chip-row">${project.adminOperations.map((item) => `<span class="chip">${item}</span>`).join('')}</div>`
    : '';

  const techImplMarkup = project.techImplementation ? project.techImplementation.map((group) => `
    <div class="tech-matrix-cell">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip tech-chip">${item}</span>`).join('')}</div>
    </div>
  `).join('') : '';

  const decisionsMarkup = project.designDecisions ? project.designDecisions.map((decision, index) => `
    <div class="decision-card">
      <span class="decision-number">${String(index + 1).padStart(2, '0')}</span>
      <strong class="decision-title">${decision.title}</strong>
      <p>${decision.body}</p>
    </div>
  `).join('') : '';

  const scope = project.scopeSummary;
  const metaStripMarkup = scope ? `
    <div class="meta-strip">
      <div class="meta-strip-item"><span>System Type</span><strong>${scope.type}</strong></div>
      <div class="meta-strip-item"><span>Status</span><strong>${scope.status}</strong></div>
      <div class="meta-strip-item spans-full"><span>Focus</span><strong>${scope.focus.join(' · ')}</strong></div>
    </div>
  ` : '';

  const relationNodes = ['Services', 'Client Records', 'Invoicing', 'Payments'];
  const relationDiagramMarkup = `
    <div class="relation-diagram" aria-label="Relationship: ${relationNodes.join(' → ')}, on a shared business logic foundation">
      ${relationNodes.map((node, index, arr) => `
        <div class="relation-node">${node}</div>
        ${index < arr.length - 1 ? '<div class="relation-tick" aria-hidden="true"></div>' : ''}
      `).join('')}
      <div class="relation-foundation">Shared Business Logic</div>
    </div>
  `;

  const outcomeSequence = project.architectureFuture
    ? [serviceCatalog.layer, clientOperations.layer, billing.layer, 'Extensible Platform']
    : null;
  const outcomeFlowMarkup = outcomeSequence ? outcomeSequence.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('') : '';

  return `
    <div class="case-study-wrap">
    <div class="project-detail-grid">
      <div class="project-detail-left has-identity-group">
        <div class="project-identity-group">
          ${displayBadge}
          <h3>${project.name}</h3>
          <span class="project-classification">${project.classification}</span>
        </div>
        <div class="project-overview">${overviewMarkup}</div>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel}</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section editorial-block">
          <span class="section-kicker">The Problem</span>
          <p class="detail-role-text">${project.problem}</p>
        </div>
        <div class="detail-section editorial-block">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text detail-role-title">${project.roleTitle}</p>
          <p class="detail-role-text">${project.role}</p>
        </div>
        ${metaStripMarkup}
      </div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">System Architecture</span>
      ${archDiagramMarkup}
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Canonical Service Architecture</span>
      ${canonicalMarkup}
    </div>

    <div class="detail-full-section section-tone-panel">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Business Logic — Pricing Engine</span>
          ${pricingMarkup}
        </div>
        <div class="module-card">
          <span class="section-kicker">Admin Operations</span>
          ${adminOpsMarkup}
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">System Design</span>
      <div class="system-design-grid">
        <p class="detail-role-text">${project.systemDesign}</p>
        ${relationDiagramMarkup}
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Technical Implementation</span>
      <div class="tech-matrix">${techImplMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">Design Decisions</span>
      <div class="decision-list">${decisionsMarkup}</div>
    </div>
    </div>

    ${project.outcomeStatement ? `
      <div class="outcome-panel">
        <div class="outcome-panel-inner">
          <span class="section-kicker">System Outcome</span>
          <p class="outcome-statement">${project.outcomeStatement}</p>
          ${outcomeFlowMarkup ? `<div class="flow-chain">${outcomeFlowMarkup}</div>` : ''}
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel} &rarr;</a>
        </div>
      </div>
    ` : ''}
  `;
}

// Cleaning Service Demo — extended case-study template. Deliberately distinct
// from the Alchemize template above: this case study is built around
// workflow/transaction/lifecycle diagrams rather than org-chart-style system
// architecture, per its own design direction.
function renderCleaningServiceDetail(project, displayBadge, primaryButtonLabel) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const lifecycleMarkup = project.lifecycle.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const beforePillsMarkup = project.compareBefore.map((item) => `<span class="chip">${item}</span>`).join('');
  const afterChainMarkup = project.compareAfter.map((item, index, arr) => `
    <span class="chip">${item}</span>
    ${index < arr.length - 1 ? '<span class="compare-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const journeyMarkup = project.journey.map((step, index) => `
    <div class="journey-card">
      <span class="journey-step-number">${index + 1}</span>
      <strong class="journey-step-title">${step.title}</strong>
      <p>${step.body}</p>
    </div>
  `).join('');

  const pricingInputsMarkup = project.pricingInputs.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const pricingFlowInputsMarkup = project.pricingFlow.map((item, index, arr) => `
    <span class="chip">${item}</span>
    ${index < arr.length - 1 ? '<span class="mini-flow-plus" aria-hidden="true">+</span>' : ''}
  `).join('');

  const bookingPipelineMarkup = project.bookingPipeline.map((step, index, arr) => `
    <div class="pipeline-node ${index === arr.length - 1 ? 'is-final' : ''}">${step}</div>
    ${index < arr.length - 1 ? '<div class="arch-arrow" aria-hidden="true">&darr;</div>' : ''}
  `).join('');

  const adminModulesMarkup = project.adminModules.map((module) => `
    <div class="admin-module-card">
      <strong>${module.label}</strong>
      <p>${module.body}</p>
    </div>
  `).join('');

  const paymentFlowMarkup = project.paymentFlow.map((step, index, arr) => `
    <div class="pipeline-node ${index === arr.length - 1 ? 'is-final' : ''}">${step}</div>
    ${index < arr.length - 1 ? '<div class="arch-arrow" aria-hidden="true">&darr;</div>' : ''}
  `).join('');

  const paymentPoliciesMarkup = project.paymentPolicies.map((item) => `<span class="chip">${item}</span>`).join('');

  const canonicalChainMarkup = project.canonicalFlow.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const canonicalPrinciplesMarkup = project.canonicalPrinciples.map((item) => `<span class="chip">${item}</span>`).join('');

  const accessDetailsMarkup = project.accessDetails.map((item) => `
    <div class="meta-strip-item"><span>${item.label}</span><strong>${item.value}</strong></div>
  `).join('');

  const architectureFlowMarkup = project.architectureFlow.map((step, index, arr) => `
    <div class="pipeline-node">${step}</div>
    ${index < arr.length - 1 ? '<div class="arch-arrow" aria-hidden="true">&darr;</div>' : ''}
  `).join('');

  const architectureBranchesMarkup = project.architectureBranches.map((branch) => `<div class="pipeline-node">${branch}</div>`).join('');

  const techGroupsMarkup = project.techGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip tech-chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const decisionsMarkup = project.designDecisions.map((decision, index) => `
    <div class="decision-card">
      <span class="decision-number">${String(index + 1).padStart(2, '0')}</span>
      <strong class="decision-title">${decision.title}</strong>
      <p>${decision.body}</p>
    </div>
  `).join('');

  const outcomeRelationMarkup = project.outcomeRelation.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="arch-arrow outcome-relation-arrow" aria-hidden="true">&#8597;</span>' : ''}
  `).join('');

  return `
    <div class="case-study-wrap cleaning-case-study">
    <div class="project-detail-grid">
      <div class="project-detail-left has-identity-group">
        <div class="project-identity-group">
          ${displayBadge}
          <h3>${project.name}</h3>
          <span class="project-classification">${project.classification}</span>
        </div>
        <div class="project-overview">${overviewMarkup}</div>
        ${project.ownership ? `<p class="project-ownership-note">${project.ownership}</p>` : ''}
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">${primaryButtonLabel}</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section editorial-block">
          <span class="section-kicker">The System</span>
          <div class="flow-chain lifecycle-strip">${lifecycleMarkup}</div>
        </div>
        <div class="detail-section editorial-block">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text detail-role-title">${project.roleTitle}</p>
          <p class="detail-role-text">${project.role}</p>
        </div>
      </div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">The Business Problem</span>
      <div class="problem-compare-grid">
        <p class="detail-role-text">${project.problem}</p>
        <div class="compare-block">
          <div class="compare-column is-before">
            <span class="compare-label">Disconnected Process</span>
            <div class="compare-pills">${beforePillsMarkup}</div>
          </div>
          <div class="compare-column is-after">
            <span class="compare-label">Connected Platform</span>
            <div class="compare-chain">${afterChainMarkup}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Customer Journey</span>
      <div class="journey-grid">${journeyMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-panel">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Business Logic — Estimate Engine</span>
          <p class="detail-role-text">${project.pricingNote}</p>
          <div class="pricing-inputs-grid">${pricingInputsMarkup}</div>
          <div class="mini-flow">
            <div class="mini-flow-inputs">${pricingFlowInputsMarkup}</div>
            <div class="arch-arrow" aria-hidden="true">&darr;</div>
            <div class="mini-flow-engine">Estimate Rules Module</div>
            <div class="arch-arrow" aria-hidden="true">&darr;</div>
            <div class="mini-flow-engine is-result">Estimate Total</div>
          </div>
        </div>
        <div class="module-card">
          <span class="section-kicker">Booking &amp; Availability Engine</span>
          <div class="pipeline-flow">${bookingPipelineMarkup}</div>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Admin Operations</span>
      <div class="admin-module-grid">${adminModulesMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Payment Workflow</span>
          <div class="pipeline-flow">${paymentFlowMarkup}</div>
          <div class="chip-row">${paymentPoliciesMarkup}</div>
        </div>
        <div class="module-card">
          <span class="section-kicker">One Source of Business Truth</span>
          <p class="detail-role-text">${project.canonicalIntro}</p>
          <div class="canonical-mini">
            <span class="pricing-chip">Pricing Rules</span>
            <div class="arch-arrow" aria-hidden="true">&darr;</div>
            <div class="flow-chain">${canonicalChainMarkup}</div>
            <div class="arch-arrow" aria-hidden="true">&darr;</div>
            <span class="pricing-chip">Admin Records</span>
          </div>
          <div class="chip-row">${canonicalPrinciplesMarkup}</div>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Access &amp; Demo Boundaries</span>
          <p class="detail-role-text">${project.accessNote}</p>
          <div class="meta-strip">${accessDetailsMarkup}</div>
        </div>
        <div class="module-card">
          <span class="section-kicker">Technical Architecture</span>
          <div class="pipeline-flow">
            ${architectureFlowMarkup}
            <div class="arch-arrow" aria-hidden="true">&darr;</div>
            <div class="pipeline-split">${architectureBranchesMarkup}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Tech Stack</span>
      <div class="tech-groups-grid">${techGroupsMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">Engineering Decisions</span>
      <div class="decision-list is-quad">${decisionsMarkup}</div>
    </div>
    </div>

    <div class="outcome-panel">
      <div class="outcome-panel-inner">
        <span class="section-kicker">System Outcome</span>
        <p class="outcome-statement">${project.outcomeStatement}</p>
        <div class="outcome-relation-stack">${outcomeRelationMarkup}</div>
        <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Demo &rarr;</a>
      </div>
    </div>
  `;
}

// Cavalry Green LLC — extended case-study template. Signature visual is the
// customer-acquisition / quote-intake pipeline (workflow + transactions +
// backend processing), distinct from Alchemize's system architecture and
// Cleaning Service Demo's lifecycle/booking framing.
function renderCavalryDetail(project) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');
  const roleItemsMarkup = project.roleItems.map((item) => `<span class="chip">${item}</span>`).join('');
  const problemServicesMarkup = project.problemServices.map((item) => `<span class="chip">${item}</span>`).join('');

  const journeyMarkup = project.journey.map((step, index, arr) => {
    const isFinal = index === arr.length - 1;
    return `
      <span class="pipeline-step ${isFinal ? 'is-final' : ''}">
        <span class="pipeline-step-number">${index + 1}</span>
        <span class="pipeline-step-label">${step}</span>
      </span>
      ${index < arr.length - 1 ? '<span class="pipeline-step-arrow" aria-hidden="true">&rarr;</span>' : ''}
    `;
  }).join('');

  const architectureFlowMarkup = project.architectureFlow.map((step, index, arr) => `
    <div class="pipeline-node">${step}</div>
    ${index < arr.length - 1 ? '<div class="arch-arrow" aria-hidden="true">&darr;</div>' : ''}
  `).join('');

  const architectureBranchesMarkup = project.architectureBranches.map((branch) => `<div class="pipeline-node">${branch}</div>`).join('');

  const photoFormatsMarkup = project.photoFormats.map((item) => `<span class="chip">${item}</span>`).join('');
  const photoLimitsMarkup = project.photoLimits.map((item) => `
    <div class="meta-strip-item"><span>${item.label}</span><strong>${item.value}</strong></div>
  `).join('');
  const photoSafeguardsMarkup = project.photoSafeguards.map((item) => `<span class="chip">${item}</span>`).join('');

  const notificationFieldsMarkup = project.notificationFields.map((item) => `<span class="chip">${item}</span>`).join('');
  const notificationTechMarkup = project.notificationTech.map((item) => `<span class="chip tech-chip">${item}</span>`).join('');

  const seoGroupsMarkup = project.seoGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const techGroupsMarkup = project.techGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip tech-chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const outcomeRelationMarkup = project.outcomeRelation.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const plateClass = project.logoDark ? 'project-plate is-dark' : 'project-plate';
  const displayBadge = `<div class="${plateClass}"><img src="${project.logo}" alt="${project.name} logo" /></div>`;

  return `
    <div class="case-study-wrap cavalry-case-study">
    <div class="project-detail-grid">
      <div class="project-detail-left has-identity-group">
        <div class="project-identity-group">
          ${displayBadge}
          <h3>${project.name}</h3>
          <span class="project-classification">${project.classification}</span>
        </div>
        <div class="project-overview">${overviewMarkup}</div>
        ${project.ownership ? `<p class="project-ownership-note">${project.ownership}</p>` : ''}
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">View Portfolio Demo</a>
          <a class="os-button" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Site</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section editorial-block">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text">${project.role}</p>
          <div class="chip-row">${roleItemsMarkup}</div>
        </div>
      </div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">The Need</span>
      <p class="detail-role-text">${project.problem}</p>
      <div class="chip-row">${problemServicesMarkup}</div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Customer Journey</span>
      <div class="pipeline-steps">${journeyMarkup}</div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Quote Intake Architecture</span>
      <p class="detail-role-text">${project.architectureNote}</p>
      <div class="pipeline-flow">
        ${architectureFlowMarkup}
        <div class="arch-arrow" aria-hidden="true">&darr;</div>
        <div class="pipeline-split">${architectureBranchesMarkup}</div>
      </div>
    </div>

    <div class="detail-full-section section-tone-panel">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Photo Upload Pipeline</span>
          <p class="detail-role-text">${project.photoNote}</p>
          <div class="meta-strip">${photoLimitsMarkup}</div>
          <div class="detail-capability-group">
            <span class="detail-capability-label">Accepted Formats</span>
            <div class="chip-row">${photoFormatsMarkup}</div>
          </div>
          <div class="detail-capability-group">
            <span class="detail-capability-label">Server-Side Safeguards</span>
            <div class="chip-row">${photoSafeguardsMarkup}</div>
          </div>
        </div>
        <div class="module-card">
          <span class="section-kicker">Business Notification</span>
          <p class="detail-role-text">${project.notificationNote}</p>
          <div class="chip-row">${notificationFieldsMarkup}</div>
          <div class="detail-capability-group">
            <span class="detail-capability-label">Technology</span>
            <div class="chip-row">${notificationTechMarkup}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Production &amp; Search</span>
          ${seoGroupsMarkup}
        </div>
        <div class="module-card">
          <span class="section-kicker">Technology</span>
          ${techGroupsMarkup}
        </div>
      </div>
    </div>
    </div>

    <div class="outcome-panel">
      <div class="outcome-panel-inner">
        <span class="section-kicker">System Outcome</span>
        <p class="outcome-statement">${project.outcomeStatement}</p>
        <div class="flow-chain">${outcomeRelationMarkup}</div>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">View Portfolio Demo</a>
          <a class="os-button" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit Live Site &rarr;</a>
        </div>
      </div>
    </div>
  `;
}

// FMBLifestyle — extended case-study template. Signature visual is the
// financial information architecture (connected product modules feeding a
// consolidated dashboard), distinct from Cavalry's transaction pipeline.
function renderFMBDetail(project, displayBadge) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const architectureInputsMarkup = project.architectureInputs.map((item, index, arr) => `
    <span class="chip">${item}</span>
    ${index < arr.length - 1 ? '<span class="mini-flow-plus" aria-hidden="true">+</span>' : ''}
  `).join('');

  const architectureModulesMarkup = project.architectureModules.map((item) => `<div class="pipeline-node">${item}</div>`).join('');

  const coreExperiencesMarkup = project.coreExperiences.map((card) => `
    <div class="admin-module-card">
      <strong>${card.title}</strong>
      <p>${card.body}</p>
    </div>
  `).join('');

  const techGroupsMarkup = project.techGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip tech-chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const flowStepsMarkup = project.flowSteps.map((step, index, arr) => `
    <div class="pipeline-node ${index === arr.length - 1 ? 'is-final' : ''}">${step}</div>
    ${index < arr.length - 1 ? '<div class="arch-arrow" aria-hidden="true">&darr;</div>' : ''}
  `).join('');

  const flowModulesMarkup = project.flowModules.map((item) => `<span class="chip">${item}</span>`).join('');

  const outcomeRelationMarkup = project.outcomeRelation.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  return `
    <div class="case-study-wrap fmb-case-study">
    <div class="project-detail-grid">
      <div class="project-detail-left has-identity-group">
        <div class="project-identity-group">
          ${displayBadge}
          <h3>${project.name}</h3>
          <span class="project-classification">${project.classification}</span>
        </div>
        <div class="project-overview">${overviewMarkup}</div>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Demo</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section editorial-block">
          <span class="section-kicker">Product Goal</span>
          <p class="detail-role-text">${project.problem}</p>
        </div>
        <div class="detail-section editorial-block">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text detail-role-title">${project.role}</p>
        </div>
      </div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">Financial Information Architecture</span>
      <div class="mini-flow">
        <div class="mini-flow-inputs">${architectureInputsMarkup}</div>
        <div class="arch-arrow" aria-hidden="true">&darr;</div>
        <div class="mini-flow-engine">${project.architectureHub}</div>
        <div class="arch-arrow" aria-hidden="true">&darr;</div>
        <div class="pipeline-branch-grid">${architectureModulesMarkup}</div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Core Experiences</span>
      <div class="pipeline-branch-grid">${coreExperiencesMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-panel">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Demo Boundary</span>
          <p class="detail-role-text">${project.demoNote}</p>
        </div>
        <div class="module-card">
          <span class="section-kicker">Implementation</span>
          <div class="tech-groups-grid">${techGroupsMarkup}</div>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Product Flow</span>
      <div class="pipeline-flow">${flowStepsMarkup}</div>
      <div class="chip-row">${flowModulesMarkup}</div>
    </div>
    </div>

    <div class="outcome-panel">
      <div class="outcome-panel-inner">
        <span class="section-kicker">Product Outcome</span>
        <p class="outcome-statement">${project.outcomeStatement}</p>
        <div class="flow-chain">${outcomeRelationMarkup}</div>
        <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Demo &rarr;</a>
      </div>
    </div>
  `;
}

// Santos FormWorks — extended case-study template for an early-stage,
// actively-developed project. Deliberately lighter-weight than the completed
// case studies: it documents current build state rather than a finished
// system, and closes without claiming a resolved outcome.
function renderSantosDetail(project, displayBadge) {
  const overviewMarkup = project.overview.map((paragraph) => `<p>${paragraph}</p>`).join('');

  const statusSlug = (label) => `is-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

  const currentBuildMarkup = project.currentBuild.map((item) => `
    <div class="admin-module-card">
      <div class="module-card-head">
        <strong>${item.title}</strong>
        <span class="status-pill ${statusSlug(item.status)}">${item.status}</span>
      </div>
      <p>${item.body}</p>
    </div>
  `).join('');

  const structureMarkup = project.structureNodes.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const techGroupsMarkup = project.techGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip tech-chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const activeFocusMarkup = project.activeFocus.map((item) => `<span class="chip">${item}</span>`).join('');
  const nextStageMarkup = project.nextStage.map((item) => `<span class="chip chip-future">${item}</span>`).join('');

  return `
    <div class="case-study-wrap santos-case-study">
    <div class="project-detail-grid">
      <div class="project-detail-left has-identity-group">
        <div class="project-identity-group">
          ${displayBadge}
          <h3>${project.name}</h3>
          <span class="project-classification">${project.classification}</span>
        </div>
        <div class="project-overview">${overviewMarkup}</div>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Demo</a>
          <a class="os-button" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">View Code on GitHub</a>
        </div>
      </div>
      <div class="project-detail-right">
        <div class="detail-section editorial-block">
          <span class="section-kicker">Status</span>
          <span class="status-pill is-development">
            <span class="status-dot" aria-hidden="true"></span>${project.statusLabel}
          </span>
          <p class="detail-role-text">${project.statusNote}</p>
        </div>
        <div class="detail-section editorial-block">
          <span class="section-kicker">My Role</span>
          <p class="detail-role-text">${project.role}</p>
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Current Build</span>
      <div class="admin-module-grid">${currentBuildMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-warm">
      <span class="section-kicker">Current Product Structure</span>
      <p class="detail-role-text">${project.structureNote}</p>
      <div class="flow-chain">${structureMarkup}</div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">Tech / Implementation</span>
      <div class="tech-groups-grid">${techGroupsMarkup}</div>
    </div>

    <div class="detail-full-section section-tone-panel">
      <div class="dual-module-grid">
        <div class="module-card">
          <span class="section-kicker">Active Development — Current Focus</span>
          <div class="chip-row">${activeFocusMarkup}</div>
        </div>
        <div class="module-card">
          <span class="section-kicker">Next-Stage Architecture</span>
          <div class="chip-row">${nextStageMarkup}</div>
        </div>
      </div>
    </div>
    </div>

    <div class="outcome-panel">
      <div class="outcome-panel-inner">
        <span class="section-kicker">Follow the Build</span>
        <p class="outcome-statement">Santos FormWorks is being developed in the open. A live staging build is available to explore while development continues, alongside the public source.</p>
        <div class="project-card-actions">
          <a class="primary-button" href="${project.url}" target="_blank" rel="noopener noreferrer">Launch Demo &rarr;</a>
          <a class="os-button" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer">View Code on GitHub</a>
        </div>
      </div>
    </div>
  `;
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
  const plateClass = ['project-plate', project.logoDark && 'is-dark', project.logoWide && 'is-wide'].filter(Boolean).join(' ');
  const displayBadge = project.logo
    ? `<div class="${plateClass}"><img src="${project.logo}" alt="${project.name} logo" /></div>`
    : `<div class="project-plate"><div class="pinkladyz-wordmark" style="font-size: 2.2rem; letter-spacing: -0.03em; color: var(--text-dark);">${project.name}</div></div>`;

  const isCaseStudy = Boolean(project.extended || project.template);
  const renderers = {
    cleaning: () => renderCleaningServiceDetail(project, displayBadge, primaryButtonLabel),
    cavalry: () => renderCavalryDetail(project),
    fmb: () => renderFMBDetail(project, displayBadge),
    santos: () => renderSantosDetail(project, displayBadge),
  };
  content.innerHTML = renderers[project.template]
    ? renderers[project.template]()
    : project.extended
      ? renderExtendedProjectDetail(project, displayBadge, primaryButtonLabel)
      : renderStandardProjectDetail(project, displayBadge, primaryButtonLabel);

  const projectPreset = getDefaultWindowLayout('projects');
  // Extended case-study windows (Alchemize, Cleaning Service Demo) use the
  // available desktop width — the horizontal diagrams and multi-column
  // grids need real room on 1440–1920px displays, not a fixed card size.
  const extendedWidth = Math.min(Math.max(window.innerWidth - 220, 860), 1200);
  const extendedHeight = Math.min(Math.max(window.innerHeight - 170, 600), 760);
  const windowData = {
    id: windowId,
    appId: 'projects',
    title: project.name,
    width: isCaseStudy ? extendedWidth : (projectPreset?.width || 760),
    height: isCaseStudy ? extendedHeight : (projectPreset?.height || 600),
    x: (projectPreset?.x || 140) + 30,
    y: (projectPreset?.y || 90) + 20,
    content,
    type: 'project',
  };

  if (project.id === 'alchemize') {
    unlockAchievement('systemArchitect');
  }

  return windowData;
}

// Shared entry point for launching a project detail window — used by project
// cards, the command interface, recent items, and the File menu alike so
// there is exactly one "open a project" implementation.
function openProject(projectId) {
  const project = PROJECTS.find((entry) => entry.id === projectId);
  if (!project) return false;

  const windowId = `project-${projectId}`;
  if (state.windows.has(windowId)) {
    focusWindow(windowId);
  } else {
    const detailWindow = createProjectDetailWindow(projectId);
    if (detailWindow) openWindow(detailWindow);
  }

  recordRecent({ type: 'project', id: projectId, name: project.name });
  return true;
}

function renderLabWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';

  const flowMarkup = LAB_PROJECT.flowNodes.map((node, index) => {
    const arrow = index < LAB_PROJECT.flowNodes.length - 1 ? '<span class="lab-flow-arrow" aria-hidden="true">&darr;</span>' : '';
    return `<span>${node}</span>${arrow}`;
  }).join('');

  shell.innerHTML = `
    <div class="lab-shell">
      <div class="lab-grid">
        <div class="lab-col-left">
          <div class="lab-identity">
            <span class="section-kicker">${LAB_PROJECT.category}</span>
            <div class="pinkladyz-wordmark">PINKLADYZ<span class="oled">OLED</span></div>
            <p>${LAB_PROJECT.description}</p>
            <div class="lab-specs">
              ${LAB_PROJECT.techStack.map((tool) => `<span>${tool}</span>`).join('')}
            </div>
          </div>

          <div class="lab-manifest">
            <span class="lab-manifest-title">Build Manifest</span>
            <div class="lab-manifest-group">
              <span class="lab-manifest-label">Hardware</span>
              <p>${LAB_PROJECT.hardware}</p>
            </div>
            <div class="lab-manifest-group">
              <span class="lab-manifest-label">Firmware</span>
              ${LAB_PROJECT.firmware.map((row) => `<p><strong>${row.label}:</strong> ${row.value}</p>`).join('')}
            </div>
            <div class="lab-manifest-group">
              <span class="lab-manifest-label">Graphics Pipeline</span>
              <p>${LAB_PROJECT.graphicsPipeline}</p>
            </div>
            <div class="lab-manifest-group">
              <span class="lab-manifest-label">Display Logic</span>
              <p>${LAB_PROJECT.displayLogic}</p>
            </div>
            <div class="lab-manifest-group">
              <span class="lab-manifest-label">Install / Run</span>
              <ol class="lab-manifest-steps">
                ${LAB_PROJECT.installSteps.map((step) => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          </div>

          <div class="project-card-actions lab-actions">
            <a class="primary-button" href="${LAB_PROJECT.url}" target="_blank" rel="noopener noreferrer">View Project</a>
            <a class="os-button" href="${LAB_PROJECT.githubUrl}" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          </div>
        </div>

        <div class="lab-col-right">
          <div class="lab-visual">
            <img src="${LAB_PROJECT.image}" alt="PinkLadyZ OLED hardware, a custom circuit board with a pink pixel-heart display" />
          </div>

          <div class="lab-flow">
            <span class="lab-flow-title">System Flow</span>
            <div class="lab-flow-diagram" aria-label="System flow: ${LAB_PROJECT.flowNodes.join(' to ')}">
              ${flowMarkup}
            </div>
          </div>

          <div class="lab-metadata">
            ${LAB_PROJECT.metadata.map((item) => `
              <div class="lab-metadata-item">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  return shell;
}

// Content for the About window's five-section professional profile.
// Kept as data so the render function below stays a straightforward template.
const ABOUT_PROFILE = {
  badges: ['Business Systems', 'Digital Operations', 'UX & Development'],
  statementPrimary: 'I build technology around how businesses actually operate.',
  statementBody: [
    'My work sits at the intersection of business operations, technology, and user experience. I translate processes, service models, and operational requirements into practical digital systems—from public-facing experiences to the workflows, data, automation, and administrative tools behind them.',
    'My background spans business operations, HR technology, service delivery, analytics, and customer operations, giving me experience with the business problems technology is ultimately supposed to solve. I pair that operational perspective with hands-on design and development to build systems that are both usable and functional.',
  ],
  foundation: [
    {
      label: 'Business & Operations',
      lead: 'MBA',
      sub: '15+ years of professional experience spanning:',
      items: ['Business operations', 'HR services', 'Benefits', 'Insurance operations', 'Sales operations', 'Financial services', 'Customer operations'],
    },
    {
      label: 'Design & User Experience',
      lead: 'UX Certificate — Full Sail University',
      sub: 'Fundamentals of User Interface Design, applied through:',
      items: ['UI/UX', 'Information architecture', 'Responsive design', 'User-centered digital experiences'],
    },
    {
      label: 'Technology & Systems',
      lead: null,
      sub: 'Hands-on capability spanning:',
      items: ['Web development', 'Business systems', 'Workflow architecture', 'Data structures', 'Automation', 'Integrations', 'Production deployment'],
    },
  ],
  foundationSynthesis: 'Business understanding + design training + technical implementation.',
  techGroups: [
    { label: 'Business Platforms', items: ['Workday', 'UKG Pro', 'SAP SuccessFactors', 'ADP Workforce Now', 'Salesforce', 'ServiceNow'] },
    { label: 'Development', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Vite', 'SQL', 'Python'] },
    { label: 'Backend & Infrastructure', items: ['Firebase', 'Firestore', 'Authentication', 'APIs', 'PHP', 'MariaDB', 'Git / GitHub', 'Production hosting'] },
    { label: 'Business Integrations', items: ['Stripe', 'Payment workflows', 'Booking systems', 'Email / SMTP', 'CRM workflows', 'Invoicing', 'Reporting'] },
    { label: 'Data & Analytics', items: ['Excel', 'Power BI', 'Tableau', 'SQL', 'Data modeling', 'Operational reporting'] },
  ],
  whyLede: 'My advantage isn’t technology in isolation. It’s understanding the business on the other side of it.',
  whyBody: [
    'Years spent working inside operational environments exposed me to the systems businesses depend on every day—employee platforms, customer records, billing, service workflows, reporting, case management, data, and the processes connecting them.',
    'That experience now informs how I design and build. I approach a project by asking not only what the interface should look like, but what happens after someone clicks the button: where the information goes, who needs it, what action follows, what should be automated, and how the system supports the business over time.',
  ],
  flowChain: ['Business Need', 'System Design', 'Implementation', 'Operation'],
  founderCopy: 'I apply this approach through Alchemize Business Services, where business strategy, service architecture, digital experiences, administrative operations, pricing, client management, billing, and automation are developed as connected parts of a broader business platform.',
  systemWork: [
    { kind: 'project', id: 'alchemize', name: 'Alchemize', descriptor: 'Business operations platform' },
    { kind: 'project', id: 'cleaning-service-demo', name: 'Cleaning Service Demo', descriptor: 'Service operations, CRM, booking, payments, invoicing & administration' },
    { kind: 'project', id: 'cavalry-green', name: 'Cavalry Green LLC', descriptor: 'Production client website & quote-request workflow' },
    { kind: 'lab', id: null, name: 'PinkLadyZ OLED', descriptor: 'ESP32 embedded display system' },
    { kind: 'system', id: null, name: 'Jessabel OS', descriptor: 'Interactive portfolio system' },
  ],
};

function renderAboutWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';

  const foundationMarkup = ABOUT_PROFILE.foundation.map((card) => `
    <div class="foundation-card">
      <span class="detail-capability-label">${card.label}</span>
      ${card.lead ? `<p class="foundation-lead">${card.lead}</p>` : ''}
      <p class="foundation-sub">${card.sub}</p>
      <ul class="foundation-list">
        ${card.items.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const techGroupsMarkup = ABOUT_PROFILE.techGroups.map((group) => `
    <div class="detail-capability-group">
      <span class="detail-capability-label">${group.label}</span>
      <div class="chip-row">${group.items.map((item) => `<span class="chip">${item}</span>`).join('')}</div>
    </div>
  `).join('');

  const flowChainMarkup = ABOUT_PROFILE.flowChain.map((node, index, arr) => `
    <span class="flow-chain-node">${node}</span>
    ${index < arr.length - 1 ? '<span class="flow-chain-arrow" aria-hidden="true">&rarr;</span>' : ''}
  `).join('');

  const systemWorkMarkup = ABOUT_PROFILE.systemWork.map((entry) => {
    const attr = entry.kind === 'project' ? `data-project-id="${entry.id}"` : `data-open-app="${entry.kind}"`;
    return `
      <button type="button" class="system-work-item" ${attr}>
        <span class="system-work-item-label">
          <strong>${entry.name}</strong>
          <span>${entry.descriptor}</span>
        </span>
        <span class="system-work-item-arrow" aria-hidden="true">&rarr;</span>
      </button>
    `;
  }).join('');

  shell.innerHTML = `
    <div class="profile-layout">
      <div class="portrait-column">
        <div class="portrait-frame">
          <img src="jessabel-art-portrait.PNG" alt="Portrait of Jessabel Santos" />
        </div>
      </div>
      <div class="profile-copy">
        <span class="section-kicker">01 / System Profile</span>
        <h3>Jessabel Santos</h3>
        <div class="profile-skills">
          ${ABOUT_PROFILE.badges.map((badge) => `<span>${badge}</span>`).join('')}
        </div>
        <div class="profile-statement">
          <p class="statement-primary">${ABOUT_PROFILE.statementPrimary}</p>
          ${ABOUT_PROFILE.statementBody.map((paragraph) => `<p class="statement-secondary">${paragraph}</p>`).join('')}
        </div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">02 / Professional Foundation</span>
      <div class="foundation-grid">${foundationMarkup}</div>
      <p class="foundation-synthesis">${ABOUT_PROFILE.foundationSynthesis}</p>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">03 / Systems &amp; Technology</span>
      <p class="detail-role-text">Grouped by where each fits inside a business platform — not a ranking of individual proficiency.</p>
      <div class="tech-groups-grid">${techGroupsMarkup}</div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">04 / Why Business Technology</span>
      <div class="why-panel">
        <p class="why-lede">${ABOUT_PROFILE.whyLede}</p>
        ${ABOUT_PROFILE.whyBody.map((paragraph) => `<p class="detail-role-text">${paragraph}</p>`).join('')}
        <div class="flow-chain">${flowChainMarkup}</div>
      </div>
    </div>

    <div class="detail-full-section">
      <span class="section-kicker">05 / In Practice</span>
      <div class="founder-module is-featured">
        <div class="founder-badge">
          <img src="alchemize-emblem-light.png" alt="Alchemize logo" />
        </div>
        <div class="founder-copy">
          <span class="section-kicker">Founder / Systems Practice</span>
          <strong>Alchemize Business Services</strong>
          <p>${ABOUT_PROFILE.founderCopy}</p>
          <button type="button" class="primary-button founder-cta" data-project-id="alchemize">Explore Alchemize &rarr;</button>
        </div>
      </div>

      <div class="system-work-block">
        <span class="detail-capability-label">Selected System Work</span>
        <div class="system-work-list">${systemWorkMarkup}</div>
      </div>

      <div class="languages-inline">
        <span class="section-kicker">Languages</span>
        <p>English · Spanish</p>
      </div>
    </div>
  `;

  shell.querySelectorAll('[data-project-id]').forEach((el) => {
    el.addEventListener('click', () => openProject(el.dataset.projectId));
  });

  shell.querySelectorAll('[data-open-app]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.dataset.openApp === 'lab') openAppWindow('lab');
      if (el.dataset.openApp === 'system') showAboutSystem();
    });
  });

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
        <a class="primary-button" href="${RESUME_REQUEST_URL}">Request a Copy</a>
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
            <strong>${CONTACT_EMAIL}</strong>
          </div>
          <a class="link-button" href="mailto:${CONTACT_EMAIL}">Send</a>
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

// Shared entry point for launching/focusing a built-in Jessabel OS app.
// Desktop icons, the dock, the system menus, and the command interface all
// call this same function rather than keeping separate implementations.
function openAppWindow(appId) {
  const appKey = appId;
  const current = state.windows.get(appKey);

  if (current) {
    focusWindow(appKey);
    recordRecent({ type: 'app', id: appId, name: getAppDisplayName(appId) });
    return current.windowElement;
  }

  const defaultLayout = getDefaultWindowLayout(appId);
  const data = {
    id: appKey,
    appId,
    title: APP_CONFIG[appId].name,
    width: defaultLayout?.width || (appId === 'contact' ? 480 : 720),
    height: defaultLayout?.height || (appId === 'projects' ? 520 : appId === 'about' ? 640 : appId === 'lab' ? 560 : appId === 'contact' ? 400 : 360),
    x: defaultLayout?.x || (160 + state.windows.size * 12),
    y: defaultLayout?.y || (90 + state.windows.size * 12),
    content: buildAppContent(appId),
    type: 'app',
  };

  registerAppOpen(appId);
  const windowElement = openWindow(data);
  recordRecent({ type: 'app', id: appId, name: getAppDisplayName(appId) });
  return windowElement;
}

const openApp = openAppWindow;

// Lab's window shows the PinkLadyZ project specifically, so recent/whoami-style
// surfaces reference it by its real project name rather than the generic app label.
function getAppDisplayName(appId) {
  if (appId === 'lab') return LAB_PROJECT.name;
  return APP_CONFIG[appId]?.name || appId;
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

function setMaximizeControlLabel(element, isMaximized) {
  const maximizeButton = element.querySelector('.window-action.maximize');
  const menuButton = element.querySelector('.window-menu-btn');
  const label = isMaximized ? 'Restore window' : 'Maximize window';
  maximizeButton?.setAttribute('aria-label', label);
  maximizeButton?.setAttribute('aria-pressed', String(isMaximized));
  menuButton?.setAttribute('aria-label', isMaximized ? 'Restore window size' : 'Toggle window size');
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
    setMaximizeControlLabel(element, false);
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
  setMaximizeControlLabel(element, true);
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

// ============================================================
// SHARED WINDOW-ACTION ARCHITECTURE
//
// Everything below operates on state.windows / state.activeWindowId and is
// the single implementation each interface (desktop icons, dock, the File /
// View / Window menus, the command interface, and keyboard shortcuts) calls
// into — there is intentionally no separate "menu version" of these actions.
// ============================================================

function getUsableDesktopRect() {
  const dockEl = document.getElementById('dock');
  const dockReserve = state.preferences.dock && dockEl && !dockEl.classList.contains('hidden') ? 84 : 20;
  return {
    top: 48,
    left: 16,
    right: window.innerWidth - 16,
    bottom: window.innerHeight - dockReserve,
  };
}

function closeActiveWindow() {
  if (!state.activeWindowId) return false;
  closeWindow(state.activeWindowId);
  return true;
}

function minimizeActiveWindow() {
  if (!state.activeWindowId) return false;
  minimizeWindow(state.activeWindowId);
  return true;
}

function toggleMaximizeActiveWindow() {
  if (!state.activeWindowId) return false;
  toggleMaximizeWindow(state.activeWindowId);
  return true;
}

function closeAllWindows() {
  Array.from(state.windows.keys()).forEach((windowId) => closeWindow(windowId));
}

// Shared by View → Show Desktop and View → Minimize All: both reveal the
// desktop by minimizing every open window without closing anything.
function minimizeAllWindows() {
  Array.from(state.windows.keys()).forEach((windowId) => {
    if (!state.minimized.has(windowId)) minimizeWindow(windowId);
  });
}

function centerWindow(windowId) {
  const record = state.windows.get(windowId);
  if (!record) return;
  const element = record.windowElement;
  if (element.classList.contains('is-maximized')) return;

  const usable = getUsableDesktopRect();
  const rect = element.getBoundingClientRect();
  const width = Math.min(rect.width, usable.right - usable.left);
  const height = Math.min(rect.height, usable.bottom - usable.top);
  const left = usable.left + Math.max(0, (usable.right - usable.left - width) / 2);
  const top = usable.top + Math.max(0, (usable.bottom - usable.top - height) / 2);

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  record.x = left;
  record.y = top;
  focusWindow(windowId);
}

function tileWindow(windowId, side) {
  const record = state.windows.get(windowId);
  if (!record) return;
  const element = record.windowElement;
  if (element.classList.contains('is-maximized')) {
    element.classList.remove('is-maximized');
    setMaximizeControlLabel(element, false);
  }

  const usable = getUsableDesktopRect();
  const gap = 10;
  const halfWidth = (usable.right - usable.left - gap) / 2;
  const height = usable.bottom - usable.top;
  const left = side === 'left' ? usable.left : usable.left + halfWidth + gap;

  element.style.left = `${left}px`;
  element.style.top = `${usable.top}px`;
  element.style.width = `${halfWidth}px`;
  element.style.height = `${height}px`;

  record.x = left;
  record.y = usable.top;
  record.width = halfWidth;
  record.height = height;
  record.restoreBounds = null;
  focusWindow(windowId);
}

// Repositions every open, non-minimized window into a readable, non-chaotic
// grid inside the current usable desktop area. Used by View → Arrange
// Windows and the `arrange` command — the same function, not two.
function arrangeWindows() {
  const usable = getUsableDesktopRect();
  const ids = Array.from(state.windows.keys()).filter((id) => !state.minimized.has(id));
  if (!ids.length) return false;

  const gap = 12;
  const columns = Math.min(ids.length, Math.ceil(Math.sqrt(ids.length)));
  const rows = Math.ceil(ids.length / columns);

  const areaWidth = usable.right - usable.left;
  const areaHeight = usable.bottom - usable.top;
  const cellWidth = Math.max(280, (areaWidth - gap * (columns - 1)) / columns);
  const cellHeight = Math.max(220, (areaHeight - gap * (rows - 1)) / rows);

  ids.forEach((windowId, index) => {
    const record = state.windows.get(windowId);
    const element = record.windowElement;
    if (element.classList.contains('is-maximized')) {
      element.classList.remove('is-maximized');
      setMaximizeControlLabel(element, false);
    }

    const col = index % columns;
    const row = Math.floor(index / columns);
    const left = usable.left + col * (cellWidth + gap);
    const top = usable.top + row * (cellHeight + gap);
    const width = Math.min(cellWidth, usable.right - left);
    const height = Math.min(cellHeight, usable.bottom - top);

    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    record.x = left;
    record.y = top;
    record.width = width;
    record.height = height;
    record.restoreBounds = null;
  });

  if (state.activeWindowId) focusWindow(state.activeWindowId);
  return true;
}

const SPLIT_VIEW_MIN_WIDTH = 900;
const SPLIT_CANDIDATE_APP_IDS = ['projects', 'lab', 'about', 'resume', 'contact'];

function isSplitViewSupported() {
  return window.innerWidth >= SPLIT_VIEW_MIN_WIDTH;
}

function getSplitViewCandidates() {
  const activeAppId = state.windows.get(state.activeWindowId)?.appId;
  return SPLIT_CANDIDATE_APP_IDS.filter((appId) => appId !== activeAppId).map((appId) => ({
    appId,
    name: getAppDisplayName(appId),
  }));
}

// Splits the active window against another app: opens/focuses the target,
// then tiles the two side by side.
function splitView(targetAppId) {
  if (!isSplitViewSupported() || !state.activeWindowId) return false;
  const activeId = state.activeWindowId;

  openAppWindow(targetAppId);
  tileWindow(activeId, 'left');
  tileWindow(targetAppId, 'right');
  focusWindow(targetAppId);
  return true;
}

// Show Desktop / Minimize All both delegate to minimizeAllWindows() above —
// this alias exists purely so call sites can read as intent.
function showDesktop() {
  minimizeAllWindows();
}

function setFocusMode(enable) {
  state.focusMode = enable;
  const desktopIconsEl = document.getElementById('desktopIcons');

  if (enable) {
    state.focusModeSuppressed = [];
    Array.from(state.windows.keys()).forEach((windowId) => {
      if (windowId !== state.activeWindowId && !state.minimized.has(windowId)) {
        minimizeWindow(windowId);
        state.focusModeSuppressed.push(windowId);
      }
    });
    desktopIconsEl?.classList.add('is-focus-dimmed');
  } else {
    state.focusModeSuppressed.forEach((windowId) => {
      if (state.windows.has(windowId)) restoreWindow(windowId);
    });
    state.focusModeSuppressed = [];
    desktopIconsEl?.classList.remove('is-focus-dimmed');
  }
}

function isFullScreenActive() {
  return Boolean(document.fullscreenElement);
}

function toggleFullScreen() {
  if (!document.documentElement.requestFullscreen && !document.exitFullscreen) {
    showToast('FULL SCREEN', 'Full screen isn’t supported in this browser.');
    return;
  }

  if (isFullScreenActive()) {
    document.exitFullscreen?.().catch(() => {});
  } else {
    document.documentElement.requestFullscreen?.().catch(() => {
      showToast('FULL SCREEN', 'Full screen was blocked by the browser.');
    });
  }
}

const PREFERENCE_ROWS = [
  { key: 'desktopIcons', label: 'Desktop Icons', hint: 'Show the app launcher icons on the desktop.' },
  { key: 'discoveryWidget', label: 'Discovery Widget', hint: 'Show the growing-plant discovery indicator.' },
  { key: 'dock', label: 'Dock', hint: 'Show the application dock.' },
  { key: 'reduceMotion', label: 'Reduce Motion', hint: 'Minimize transitions and animation.' },
];

function renderPreferencesWindow() {
  const shell = document.createElement('div');
  shell.className = 'app-shell app-content';
  shell.innerHTML = `
    <div class="window-copy-block">
      <span class="section-kicker">Jessabel OS</span>
      <h3>Preferences</h3>
      <div class="preferences-list">
        ${PREFERENCE_ROWS.map((row) => `
          <div class="preferences-row">
            <div class="preferences-row-label">
              <strong>${row.label}</strong>
              <span>${row.hint}</span>
            </div>
            <button
              type="button"
              class="os-button pref-toggle"
              data-pref-key="${row.key}"
              aria-pressed="${state.preferences[row.key] ? 'true' : 'false'}"
            >${state.preferences[row.key] ? 'On' : 'Off'}</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  shell.querySelectorAll('[data-pref-key]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.prefKey;
      setPreference(key, !state.preferences[key]);
    });
  });

  return shell;
}

function openPreferencesWindow() {
  const existing = state.windows.get('preferences');
  if (existing) {
    focusWindow('preferences');
    return;
  }

  openWindow({
    id: 'preferences',
    appId: 'preferences',
    title: 'Preferences',
    width: 380,
    height: 360,
    x: window.innerWidth / 2 - 190,
    y: 120,
    content: renderPreferencesWindow(),
    type: 'app',
  });
}

// Keeps an already-open Preferences window's toggle states in sync when a
// preference changes from elsewhere (e.g. the View menu checkboxes).
function refreshOpenPreferencesWindow() {
  const record = state.windows.get('preferences');
  if (!record) return;
  const body = record.windowElement.querySelector('.window-body');
  body.innerHTML = '';
  body.appendChild(renderPreferencesWindow());
}

function setupWindowDrag(windowEl, windowId) {
  const header = windowEl.querySelector('.window-header');
  let dragInfo = null;

  header.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest(NO_DRAG_SELECTOR)) return;
    if (windowEl.classList.contains('is-maximized')) return;

    const rect = windowEl.getBoundingClientRect();
    dragInfo = {
      pointerId: event.pointerId,
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      isDragging: false,
    };

    // Capture on the same element that owns the move/up listeners so
    // retargeted pointer events (per the Pointer Events capture spec)
    // still reach these handlers instead of bubbling past them.
    header.setPointerCapture(event.pointerId);
    focusWindow(windowId);
  });

  header.addEventListener('pointermove', (event) => {
    if (!dragInfo || event.pointerId !== dragInfo.pointerId) return;

    const deltaX = event.clientX - dragInfo.pointerStartX;
    const deltaY = event.clientY - dragInfo.pointerStartY;

    if (!dragInfo.isDragging) {
      if (Math.abs(deltaX) < DRAG_MOVE_THRESHOLD && Math.abs(deltaY) < DRAG_MOVE_THRESHOLD) return;
      dragInfo.isDragging = true;
      header.classList.add('is-dragging');
    }

    const nextLeft = Math.min(Math.max(dragInfo.startLeft + deltaX, 16), window.innerWidth - 180);
    const nextTop = Math.min(Math.max(dragInfo.startTop + deltaY, 46), window.innerHeight - 160);
    windowEl.style.left = `${nextLeft}px`;
    windowEl.style.top = `${nextTop}px`;
  });

  function endDrag(event) {
    if (!dragInfo || (event && event.pointerId !== dragInfo.pointerId)) return;
    header.classList.remove('is-dragging');
    try {
      header.releasePointerCapture(dragInfo.pointerId);
    } catch (error) {
      /* capture may already be released by the browser */
    }
    dragInfo = null;
  }

  header.addEventListener('pointerup', endDrag);
  header.addEventListener('pointercancel', endDrag);
}

desktopHomeButton.addEventListener('click', () => {
  state.homeMenuOpen = !state.homeMenuOpen;
  homeMenu.classList.toggle('hidden', !state.homeMenuOpen);
  if (state.homeMenuOpen) {
    closeCommandPalette();
    closeSystemDropdown();
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

// ============================================================
// SYSTEM MENU DROPDOWNS (File / Edit / View / Window)
//
// One shared dropdown element is repositioned/repopulated per menu. Every
// item's onClick calls the same shared actions used elsewhere in the file —
// desktop icons, dock, keyboard shortcuts, and the command interface.
// ============================================================

let dropdownActionMap = new Map();

function downloadResume() {
  showToast('RESUME', 'No resume file on record yet — opening an email request instead.');
  const link = document.createElement('a');
  link.href = RESUME_REQUEST_URL;
  link.rel = 'noopener';
  link.click();
}

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopyToClipboard(text));
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  } catch (error) {
    /* clipboard unavailable in this browser */
  }
}

function copyPortfolioUrl() {
  const url = `${window.location.origin}${window.location.pathname}`;
  copyToClipboard(url);
  showToast('Copied Portfolio URL', url);
}

function copyEmail() {
  copyToClipboard(CONTACT_EMAIL);
  showToast('Copied Email', CONTACT_EMAIL);
}

function buildFileMenuItems() {
  const hasActive = Boolean(state.activeWindowId);
  const hasAnyWindow = state.windows.size > 0;

  return [
    { label: 'Open Projects', onClick: () => openAppWindow('projects') },
    { label: 'Open Lab', onClick: () => openAppWindow('lab') },
    { label: 'Open Resume', onClick: () => openAppWindow('resume') },
    { separator: true },
    {
      submenu: true,
      key: 'recent',
      label: 'Open Recent',
      items: state.recent.length
        ? state.recent.map((entry) => ({
          label: entry.name,
          onClick: () => (entry.type === 'project' ? openProject(entry.id) : openAppWindow(entry.id)),
        }))
        : [{ label: 'No Recent Items', disabled: true }],
    },
    { separator: true },
    { label: 'Download Resume', onClick: () => downloadResume() },
    { separator: true },
    { label: 'Close Window', shortcut: `${getPrimaryModifierLabel()} W`, disabled: !hasActive, onClick: () => closeActiveWindow() },
    { label: 'Close All Windows', disabled: !hasAnyWindow, onClick: () => closeAllWindows() },
  ];
}

function buildEditMenuItems() {
  return [
    { label: 'Copy Portfolio URL', onClick: () => copyPortfolioUrl() },
    { label: 'Copy Email', onClick: () => copyEmail() },
    { separator: true },
    { label: 'Preferences…', onClick: () => openPreferencesWindow() },
  ];
}

function buildViewMenuItems() {
  return [
    { label: 'Show Desktop', onClick: () => showDesktop() },
    { separator: true },
    { label: 'Arrange Windows', onClick: () => arrangeWindows() },
    { label: 'Minimize All', onClick: () => minimizeAllWindows() },
    { separator: true },
    {
      label: 'Focus Mode',
      checked: state.focusMode,
      disabled: !state.activeWindowId && !state.focusMode,
      stayOpen: true,
      onClick: () => setFocusMode(!state.focusMode),
    },
    { separator: true },
    { label: 'Show Desktop Icons', checked: state.preferences.desktopIcons, stayOpen: true, onClick: () => setPreference('desktopIcons', !state.preferences.desktopIcons) },
    { label: 'Show Discovery', checked: state.preferences.discoveryWidget, stayOpen: true, onClick: () => setPreference('discoveryWidget', !state.preferences.discoveryWidget) },
    { label: 'Show Dock', checked: state.preferences.dock, stayOpen: true, onClick: () => setPreference('dock', !state.preferences.dock) },
    { separator: true },
    { label: isFullScreenActive() ? 'Exit Full Screen' : 'Enter Full Screen', onClick: () => toggleFullScreen() },
  ];
}

function buildWindowMenuItems() {
  const hasActive = Boolean(state.activeWindowId);
  const activeRecord = hasActive ? state.windows.get(state.activeWindowId) : null;
  const isMaximized = Boolean(activeRecord?.windowElement.classList.contains('is-maximized'));
  const splitSupported = isSplitViewSupported() && hasActive;
  const candidates = hasActive ? getSplitViewCandidates() : [];

  const windowList = Array.from(state.windows.keys()).map((id) => ({
    label: state.windows.get(id).title,
    checked: id === state.activeWindowId,
    onClick: () => (state.minimized.has(id) ? restoreWindow(id) : focusWindow(id)),
  }));

  const splitItems = !splitSupported
    ? [{ label: window.innerWidth < SPLIT_VIEW_MIN_WIDTH ? 'Unavailable at this window size' : 'Open a window first', disabled: true }]
    : candidates.length
      ? candidates.map((candidate) => ({ label: `Split with ${candidate.name}`, onClick: () => splitView(candidate.appId) }))
      : [{ label: 'No other apps to split with', disabled: true }];

  return [
    { label: 'Minimize', disabled: !hasActive, shortcut: `${getPrimaryModifierLabel()} M`, onClick: () => minimizeActiveWindow() },
    { label: isMaximized ? 'Restore' : 'Maximize', disabled: !hasActive, onClick: () => toggleMaximizeActiveWindow() },
    { label: 'Center', disabled: !hasActive, onClick: () => centerWindow(state.activeWindowId) },
    { separator: true },
    { label: 'Tile Left', disabled: !hasActive, onClick: () => tileWindow(state.activeWindowId, 'left') },
    { label: 'Tile Right', disabled: !hasActive, onClick: () => tileWindow(state.activeWindowId, 'right') },
    { separator: true },
    { submenu: true, key: 'split', label: 'Split View', disabled: !splitSupported, items: splitItems },
    ...(windowList.length ? [{ separator: true }, ...windowList] : []),
  ];
}

function getMenuItems(menuKey) {
  if (menuKey === 'file') return buildFileMenuItems();
  if (menuKey === 'edit') return buildEditMenuItems();
  if (menuKey === 'view') return buildViewMenuItems();
  if (menuKey === 'window') return buildWindowMenuItems();
  return [];
}

function renderDropdownItemsHtml(items) {
  return items.map((item) => {
    if (item.separator) return '<hr class="dropdown-separator" />';

    const id = dropdownActionMap.size + 1;

    if (item.submenu) {
      dropdownActionMap.set(id, item);
      const expanded = state.submenuOpen === item.key;
      return `
        <button type="button" class="dropdown-item" data-action-id="${id}" ${item.disabled ? 'disabled' : ''} aria-haspopup="true" aria-expanded="${expanded}">
          <span class="dropdown-check"></span>
          <span class="dropdown-label">${item.label}</span>
          <span class="dropdown-caret">${expanded ? '▾' : '▸'}</span>
        </button>
        <div class="dropdown-submenu ${expanded ? '' : 'hidden'}">
          ${expanded ? renderDropdownItemsHtml(item.items) : ''}
        </div>
      `;
    }

    dropdownActionMap.set(id, item);
    return `
      <button type="button" class="dropdown-item" data-action-id="${id}" ${item.disabled ? 'disabled' : ''} role="menuitemcheckbox" aria-checked="${item.checked ? 'true' : 'false'}">
        <span class="dropdown-check">${item.checked ? '✓' : ''}</span>
        <span class="dropdown-label">${item.label}</span>
        ${item.shortcut ? `<span class="dropdown-shortcut">${item.shortcut}</span>` : ''}
      </button>
    `;
  }).join('');
}

function renderSystemDropdown(menuKey) {
  dropdownActionMap = new Map();
  systemDropdown.innerHTML = renderDropdownItemsHtml(getMenuItems(menuKey));
}

function positionSystemDropdown(buttonEl) {
  const rect = buttonEl.getBoundingClientRect();
  systemDropdown.style.left = `${rect.left}px`;
  systemDropdown.style.right = 'auto';
  systemDropdown.style.top = `${rect.bottom + 4}px`;

  requestAnimationFrame(() => {
    const menuRect = systemDropdown.getBoundingClientRect();
    if (menuRect.right > window.innerWidth - 8) {
      systemDropdown.style.left = 'auto';
      systemDropdown.style.right = `${Math.max(8, window.innerWidth - rect.right)}px`;
    }
  });
}

function openSystemDropdown(menuKey, buttonEl) {
  closeCommandPalette();
  homeMenu.classList.add('hidden');
  state.homeMenuOpen = false;
  state.submenuOpen = null;
  state.activeDropdown = menuKey;

  renderSystemDropdown(menuKey);
  systemDropdown.classList.remove('hidden');
  document.querySelectorAll('.system-menu-item').forEach((btn) => {
    btn.setAttribute('aria-expanded', String(btn === buttonEl));
  });
  positionSystemDropdown(buttonEl);

  const firstItem = systemDropdown.querySelector('.dropdown-item:not([disabled])');
  firstItem?.focus();
}

function closeSystemDropdown() {
  if (!state.activeDropdown) return;
  state.activeDropdown = null;
  state.submenuOpen = null;
  systemDropdown.classList.add('hidden');
  document.querySelectorAll('.system-menu-item[aria-expanded]').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
}

systemDropdown?.addEventListener('click', (event) => {
  const button = event.target.closest('.dropdown-item');
  if (!button || button.disabled) return;

  // Stop this click from also reaching the document-level "click outside
  // closes the dropdown" listener below: renderSystemDropdown() replaces
  // systemDropdown's contents synchronously, which detaches the original
  // event.target from the DOM before the event finishes bubbling — a
  // detached node's closest('#systemDropdown') returns null, so without
  // this the outer listener would misread every in-menu click (submenu
  // toggles, stayOpen checkboxes) as an outside click and close the menu.
  event.stopPropagation();

  const item = dropdownActionMap.get(Number(button.dataset.actionId));
  if (!item) return;

  if (item.submenu) {
    state.submenuOpen = state.submenuOpen === item.key ? null : item.key;
    renderSystemDropdown(state.activeDropdown);
    return;
  }

  item.onClick?.();

  if (item.stayOpen) {
    renderSystemDropdown(state.activeDropdown);
  } else {
    closeSystemDropdown();
  }
});

systemDropdown?.addEventListener('keydown', (event) => {
  const items = Array.from(systemDropdown.querySelectorAll('.dropdown-item:not([disabled])'));
  const currentIndex = items.indexOf(document.activeElement);

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    items[(currentIndex + 1) % items.length]?.focus();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    items[(currentIndex - 1 + items.length) % items.length]?.focus();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    const menuKey = state.activeDropdown;
    closeSystemDropdown();
    document.querySelector(`.system-menu-item[data-menu="${menuKey}"]`)?.focus();
  }
});

document.querySelectorAll('.system-menu-item').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const menu = button.dataset.menu;

    if (menu === 'help') {
      closeSystemDropdown();
      openCommandPalette();
      return;
    }

    if (state.activeDropdown === menu) {
      closeSystemDropdown();
    } else {
      openSystemDropdown(menu, button);
    }
  });
});

document.addEventListener('click', (event) => {
  if (!state.activeDropdown) return;
  if (event.target.closest('#systemDropdown') || event.target.closest('.system-menu-item')) return;
  closeSystemDropdown();
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
  } else if (event.key === 'Escape') {
    closeCommandPalette();
  } else if (event.key === 'ArrowUp') {
    if (!state.commandHistory.length) return;
    event.preventDefault();
    state.commandHistoryIndex = Math.max(0, state.commandHistoryIndex - 1);
    commandInput.value = state.commandHistory[state.commandHistoryIndex] || '';
  } else if (event.key === 'ArrowDown') {
    if (!state.commandHistory.length) return;
    event.preventDefault();
    state.commandHistoryIndex = Math.min(state.commandHistory.length, state.commandHistoryIndex + 1);
    commandInput.value = state.commandHistory[state.commandHistoryIndex] || '';
  }
});

// ============================================================
// GLOBAL KEYBOARD SHORTCUTS — Windows/Linux Ctrl and macOS Cmd both work.
// ============================================================

document.addEventListener('keydown', (event) => {
  const primaryModifier = event.ctrlKey || event.metaKey;
  const isTypingContext = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;

  if (primaryModifier && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (state.commandPaletteOpen) {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
    return;
  }

  if (primaryModifier && event.key.toLowerCase() === 'w' && state.activeWindowId && !state.commandPaletteOpen) {
    event.preventDefault();
    closeActiveWindow();
    return;
  }

  if (primaryModifier && event.key.toLowerCase() === 'm' && state.activeWindowId && !state.commandPaletteOpen && !isTypingContext) {
    event.preventDefault();
    minimizeActiveWindow();
    return;
  }

  if (event.key === 'Escape') {
    if (state.activeDropdown) {
      closeSystemDropdown();
      return;
    }
    if (state.commandPaletteOpen) {
      closeCommandPalette();
      return;
    }
    if (state.homeMenuOpen) {
      homeMenu.classList.add('hidden');
      state.homeMenuOpen = false;
    }
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

if (searchTrigger) {
  searchTrigger.setAttribute('aria-label', `Open command palette (${getPrimaryModifierLabel()} + K)`);
}

loadPersistedState();
loadRecent();
loadPreferences();
applyPreferences();
renderDesktopIcons();
renderDock();
updateTime();
updateDiscoveryIndicator();
setInterval(updateTime, 15000);
bootSequence();
