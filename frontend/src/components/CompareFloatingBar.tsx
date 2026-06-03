import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from '../router';
import { fetchColleges } from '../api';
import type { College } from '../types';
import { X, GitCompare, ArrowRight } from 'lucide-react';

export default function CompareFloatingBar() {
  const { navigate } = useRouter();
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);

  const loadCompared = () => {
    try {
      const stored = localStorage.getItem('compare_colleges');
      if (stored) {
        setComparedIds(JSON.parse(stored));
      } else {
        setComparedIds([]);
      }
    } catch (e) {
      console.error(e);
      setComparedIds([]);
    }
  };

  useEffect(() => {
    loadCompared();
    const handleCompareChange = () => loadCompared();
    window.addEventListener('compare-change', handleCompareChange);
    return () => window.removeEventListener('compare-change', handleCompareChange);
  }, []);

  // Fetch all colleges to map IDs to names
  useEffect(() => {
    if (comparedIds.length > 0) {
      fetchColleges().then(data => {
        const filtered = data.filter(c => comparedIds.includes(c.id));
        setColleges(filtered);
      }).catch(err => console.error(err));
    } else {
      setColleges([]);
    }
  }, [comparedIds]);

  const handleRemove = (id: string) => {
    const updated = comparedIds.filter(x => x !== id);
    localStorage.setItem('compare_colleges', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('compare-change'));
  };

  const handleClear = () => {
    localStorage.removeItem('compare_colleges');
    window.dispatchEvent(new CustomEvent('compare-change'));
  };

  if (comparedIds.length === 0) return null;

  return (
    <div style={containerStyle} className="compare-bar-animate">
      <div style={contentStyle}>
        {/* Left info */}
        <div style={infoStyle}>
          <div style={iconBadgeStyle}>
            <GitCompare size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>Compare Colleges</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {comparedIds.length} of 3 selected
            </p>
          </div>
        </div>

        {/* Selected List */}
        <div style={listStyle}>
          {colleges.map(college => (
            <div key={college.id} style={itemStyle}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '140px' }}>
                <span style={nameStyle} title={college.name}>{college.name}</span>
                <span style={locStyle}>{college.city}, {college.state}</span>
              </div>
              <button onClick={() => handleRemove(college.id)} style={removeBtnStyle}>
                <X size={12} />
              </button>
            </div>
          ))}
          {comparedIds.length < 3 && (
            <div style={placeholderStyle}>
              <span>+ Add College</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={actionContainerStyle}>
          <button onClick={handleClear} style={clearStyle}>
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={comparedIds.length < 2}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              opacity: comparedIds.length < 2 ? 0.6 : 1,
              pointerEvents: comparedIds.length < 2 ? 'none' : 'auto'
            }}
          >
            <span>Compare Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .compare-bar-animate {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  width: 'calc(100% - 32px)',
  maxWidth: '850px',
};

const contentStyle: CSSProperties = {
  background: 'rgba(15, 15, 30, 0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '1.25rem',
  padding: '1rem 1.5rem',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.15)',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
};

const infoStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const iconBadgeStyle: CSSProperties = {
  background: 'rgba(139, 92, 246, 0.15)',
  color: 'var(--primary-hover)',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
};

const itemStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid var(--border-color)',
  padding: '0.35rem 0.75rem',
  borderRadius: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const nameStyle: CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#ffffff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const locStyle: CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
};

const removeBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  padding: '0.1rem',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '50%',
  transition: 'background var(--transition-fast)',
};

const placeholderStyle: CSSProperties = {
  border: '1px dashed rgba(255, 255, 255, 0.15)',
  padding: '0.35rem 0.75rem',
  borderRadius: '0.75rem',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  display: 'flex',
  alignItems: 'center',
};

const actionContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const clearStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 500,
};
