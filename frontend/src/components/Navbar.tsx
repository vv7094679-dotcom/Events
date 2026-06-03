import { useRouter } from '../router';
import { School, LayoutDashboard, Compass, Menu, X, GitCompare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { path, navigate } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('compare_colleges');
        setCompareCount(stored ? JSON.parse(stored).length : 0);
      } catch (e) {
        setCompareCount(0);
      }
    };
    updateCount();
    window.addEventListener('compare-change', updateCount);
    return () => window.removeEventListener('compare-change', updateCount);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: School },
    { name: 'Colleges', path: '/colleges', icon: Compass },
    { name: 'Compare', path: '/compare', icon: GitCompare, badge: compareCount },
    { name: 'Admin Portal', path: '/admin', icon: LayoutDashboard },
  ];

  return (
    <header className="glass-panel" style={{
      borderRadius: '0 0 1rem 1rem',
      borderTop: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 20, 0.8)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.03em'
        }}>
          <div style={{
            background: 'var(--primary-gradient)',
            padding: '0.5rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
          }}>
            <School size={24} style={{ color: '#fff' }} />
          </div>
          <span className="gradient-text">EduSphere</span>
        </a>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav-container">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.path || (link.path === '/colleges' && path.startsWith('/colleges/'));
            return (
              <a
                key={link.name}
                href={`#${link.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent'
                }}
                className="nav-link-hover"
              >
                <Icon size={16} />
                <span>{link.name}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    lineHeight: 1
                  }}>
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}
          className="mobile-menu-btn"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div style={{
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(10, 10, 20, 0.95)',
          animation: 'fadeIn var(--transition-fast) forwards'
        }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.path || (link.path === '/colleges' && path.startsWith('/colleges/'));
            return (
              <a
                key={link.name}
                href={`#${link.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.path);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent'
                }}
              >
                <Icon size={18} />
                <span>{link.name}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    lineHeight: 1
                  }}>
                    {link.badge}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      )}

      {/* CSS injection for responsive classes */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav-container {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        .nav-link-hover:hover {
          color: var(--text-primary) !important;
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </header>
  );
}
