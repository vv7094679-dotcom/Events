import type { CSSProperties } from 'react';
import { School, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { useRouter } from '../router';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="glass-panel" style={{
      borderRadius: '1rem 1rem 0 0',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      marginTop: 'auto',
      background: 'rgba(10, 10, 20, 0.5)',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1.5rem 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
          textAlign: 'left'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                background: 'var(--primary-gradient)',
                padding: '0.4rem',
                borderRadius: '0.5rem',
                display: 'flex'
              }}>
                <School size={20} style={{ color: '#fff' }} />
              </div>
              <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>EduSphere</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Empowering students to explore, evaluate, and choose their ideal path to higher education. Comprehensive databases and real student experiences.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="social-icon-btn" style={socialBtnStyle}><Twitter size={18} /></a>
              <a href="#" className="social-icon-btn" style={socialBtnStyle}><Github size={18} /></a>
              <a href="#" className="social-icon-btn" style={socialBtnStyle}><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Explore Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={linkStyle}>
                  Home Landing
                </a>
              </li>
              <li>
                <a href="#/colleges" onClick={(e) => { e.preventDefault(); navigate('/colleges'); }} style={linkStyle}>
                  Browse Colleges
                </a>
              </li>
              <li>
                <a href="#/admin" onClick={(e) => { e.preventDefault(); navigate('/admin'); }} style={linkStyle}>
                  Admin Control Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ marginBottom: '1.25rem', fontSize: '1.1rem' }}>Contact & Support</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Email: support@edusphere.edu
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Phone: +1 (555) 019-2834
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Address: 100 Tech Innovation Plaza, Silicon Valley, CA
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '1.5rem' }}></div>

        {/* Bottom copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <p>© {new Date().getFullYear()} EduSphere Inc. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with <Heart size={14} style={{ color: '#ef4444' }} /> for future scholars.
          </p>
        </div>
      </div>
      <style>{`
        .social-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: var(--primary-hover) !important;
          border-color: rgba(139, 92, 246, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}

const socialBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: '1px solid var(--border-color)',
  background: 'rgba(255,255,255,0.02)',
  color: 'var(--text-secondary)',
  transition: 'all var(--transition-fast)'
};

const linkStyle: CSSProperties = {
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  transition: 'all var(--transition-fast)'
};
