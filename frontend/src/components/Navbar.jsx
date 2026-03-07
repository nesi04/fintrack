import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <header className="topbar fade-up">
      <div>
        <p className="eyebrow">Overview</p>
        <h2>Financial Command Center</h2>
      </div>
      <button onClick={logout} className="ghost-btn">Logout</button>
    </header>
  );
}
