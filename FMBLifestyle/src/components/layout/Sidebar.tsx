import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  BarChart2,
  Settings,
  TrendingUp,
  Target,
  PiggyBank,
  Layers,
  Home,
  ArrowLeft,
} from 'lucide-react';
import embossedLogo from '../../assets/logo/embossed-logo.png';

const overviewItems = [
  { to: '/',       label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/reports', label: 'Reports',      icon: BarChart2 },
];

const trackItems = [
  { to: '/networth',      label: 'Net Worth',       icon: TrendingUp },
  { to: '/transactions',  label: 'Transactions',    icon: ArrowLeftRight },
  { to: '/accounts',      label: 'Accounts',        icon: Layers },
];

const planItems = [
  { to: '/budget',  label: 'Monthly Budget',    icon: Wallet },
  { to: '/envelopes', label: 'Envelopes',        icon: Target },
  { to: '/buckets', label: 'Savings Buckets',    icon: PiggyBank },
  { to: '/debt',    label: 'Debt Tracker',       icon: CreditCard },
  { to: '/mortgage-readiness', label: 'Mortgage Readiness', icon: Home },
];
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src={embossedLogo} alt="FMBLifestyle logo" className="sidebar-logo-img" />
        </div>
        <div>
          <div className="sidebar-logo-text">FMBLifestyle</div>
          <div className="sidebar-logo-sub">Finance My Best Lifestyle</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        {overviewItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
        <div className="sidebar-section-label">Track</div>
        {trackItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
        <div className="sidebar-section-label">Plan</div>
        {planItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
            <Icon size={16} />{label}
          </NavLink>
        ))}
        <div className="sidebar-section-label">System</div>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}>
          <Settings size={16} />Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <a href="https://jessabel.art/" className="sidebar-portfolio-link">
          <ArrowLeft size={14} />Return to Portfolio
        </a>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '0 4px', letterSpacing: '.06em' }}>
          v2.0 • OFFLINE
        </div>
      </div>
    </aside>
  );
}

