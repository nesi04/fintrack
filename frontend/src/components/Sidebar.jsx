import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  const monthLabel = new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <aside className="sidebar">
      <div className="brand-block fade-up">
        <p className="eyebrow">FINTRACK</p>
        <h1>{user?.name || 'User'}</h1>
      </div>
      <nav className="nav-block fade-up" style={{ animationDelay: '90ms' }}>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Dashboard</NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Transactions</NavLink>
        <NavLink to="/budget" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>Budget</NavLink>
      </nav>
      <div className="profile-block fade-up" style={{ animationDelay: '180ms' }}>
        <p className="mono-small">Quick Snapshot</p>
        <h3>{user?.currency || 'USD'} Wallet</h3>
        <p className="mono-small">{monthLabel}</p>
      </div>
    </aside>
  );
}
