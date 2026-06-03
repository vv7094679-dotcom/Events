import { useState, useEffect, type MouseEvent } from 'react';
import type { College } from '../types';
import { useRouter } from '../router';
import { MapPin, Calendar, Star, IndianRupee, ArrowRight, Award, GitCompare } from 'lucide-react';

interface CollegeCardProps {
  college: College;
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { navigate } = useRouter();
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    const checkCompared = () => {
      try {
        const stored = localStorage.getItem('compare_colleges');
        const ids = stored ? JSON.parse(stored) : [];
        setIsCompared(ids.includes(college.id));
      } catch (e) {
        setIsCompared(false);
      }
    };
    checkCompared();
    window.addEventListener('compare-change', checkCompared);
    return () => window.removeEventListener('compare-change', checkCompared);
  }, [college.id]);

  const handleCompareToggle = (e: MouseEvent) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('compare_colleges');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(college.id)) {
        ids = ids.filter(id => id !== college.id);
      } else {
        if (ids.length >= 3) {
          alert('You can compare a maximum of 3 colleges.');
          return;
        }
        ids.push(college.id);
      }
      localStorage.setItem('compare_colleges', JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent('compare-change'));
    } catch (err) {
      console.error(err);
    }
  };

  // Shorten recruiter names if too long
  const recruiters = college.placementStats?.topRecruiters?.slice(0, 3) || [];

  return (
    <div className="glass-panel glass-panel-interactive college-card animate-fade-in">
      {/* Card Header (Gradient & Rating/NIRF) */}
      <div className="college-card-header">
        <div className="college-card-header-content">
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Award size={12} /> NIRF #{college.nirfRank}
            </span>
            <button
              onClick={handleCompareToggle}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: isCompared ? 'var(--primary)' : 'rgba(10, 10, 20, 0.75)',
                color: isCompared ? '#ffffff' : 'var(--text-secondary)',
                border: isCompared ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.35rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title="Add to side-by-side comparison"
            >
              <GitCompare size={10} />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(10, 10, 20, 0.75)',
            padding: '0.25rem 0.6rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#fbbf24'
          }}>
            <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
            {college.rating ? college.rating.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="college-card-body">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
            {college.type}
          </span>
        </div>
        <h3 className="college-card-title">{college.name}</h3>
        
        <div className="college-card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={14} />
            <span>{college.city}, {college.state}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
            <span>Est. {college.established}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="college-card-stats">
          <div className="college-card-stat">
            <span className="college-card-stat-label">Avg Annual Fee</span>
            <span className="college-card-stat-value" style={{ display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={12} />
              {(college.fees / 100000).toFixed(1)}L
            </span>
          </div>
          <div className="college-card-stat">
            <span className="college-card-stat-label">Median package</span>
            <span className="college-card-stat-value" style={{ display: 'flex', alignItems: 'center', color: '#34d399' }}>
              <IndianRupee size={12} />
              {((college.placementStats?.medianPackage || 0) / 100000)} LPA
            </span>
          </div>
        </div>

        {/* Top Recruiters */}
        {recruiters.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Top Recruiters</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {recruiters.map((r, idx) => (
                <span key={idx} style={{
                  fontSize: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)'
                }}>{r}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="college-card-footer">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Highest Package</span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
              <IndianRupee size={13} />
              {((college.placementStats?.highestPackage || 0) / 100000)} LPA
            </span>
          </div>
          
          <button
            onClick={() => navigate(`/colleges/${college.id}`)}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Details <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
