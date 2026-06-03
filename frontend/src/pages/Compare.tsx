import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from '../router';
import { fetchColleges } from '../api';
import type { College } from '../types';
import { Trash2, ArrowLeft, GitCompare, Star, Check, X, Award } from 'lucide-react';

export default function Compare() {
  const { navigate } = useRouter();
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (comparedIds.length > 0) {
      setLoading(true);
      fetchColleges()
        .then((data) => {
          const filtered = data.filter((c) => comparedIds.includes(c.id));
          // Sort to match the order in comparedIds
          const sorted = comparedIds
            .map((id) => filtered.find((c) => c.id === id))
            .filter(Boolean) as College[];
          setColleges(sorted);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setColleges([]);
      setLoading(false);
    }
  }, [comparedIds]);

  const handleRemove = (id: string) => {
    const updated = comparedIds.filter((x) => x !== id);
    localStorage.setItem('compare_colleges', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('compare-change'));
  };

  const handleClear = () => {
    localStorage.removeItem('compare_colleges');
    window.dispatchEvent(new CustomEvent('compare-change'));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', gap: '1rem' }}>
        <div className="spin-animation" style={{ color: 'var(--primary)', fontSize: '2rem' }}>
          <GitCompare size={42} />
        </div>
        <span style={{ color: 'var(--text-secondary)' }}>Comparing academic credentials...</span>
      </div>
    );
  }

  if (colleges.length < 2) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <button onClick={() => navigate('/colleges')} style={backBtnStyle} className="back-btn-hover">
            <ArrowLeft size={16} /> Back to Browse
          </button>
        </div>

        <div className="glass-panel" style={emptyContainerStyle}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.12)',
            padding: '1.5rem',
            borderRadius: '50%',
            color: 'var(--primary-hover)',
            marginBottom: '1rem',
            display: 'inline-flex'
          }}>
            <GitCompare size={48} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Add Colleges to Compare</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0.75rem auto 1.75rem', lineHeight: '1.6' }}>
            Select 2 or 3 colleges from the listings catalog to see a detailed, side-by-side comparison of fees, placements, ratings, and course structures.
          </p>
          <button onClick={() => navigate('/colleges')} className="btn btn-primary">
            Browse College Listings Catalog
          </button>
        </div>
      </div>
    );
  }

  // Helper lists to map sub-ratings
  const ratingKeys = [
    { key: 'academics', label: 'Academics Quality' },
    { key: 'placements', label: 'Placement Performance' },
    { key: 'campusLife', label: 'Campus Life & Culture' },
    { key: 'infrastructure', label: 'Infrastructure & Labs' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '5rem' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/colleges')} style={backBtnStyle} className="back-btn-hover">
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
            Compare <span className="gradient-text">Colleges</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Comparing {colleges.length} selected institutes side-by-side</p>
        </div>

        <button onClick={handleClear} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Trash2 size={14} /> Clear Selection
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '1.5rem' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, width: '220px' }}>Core Metrics</th>
              {colleges.map((college) => (
                <th key={college.id} style={collegeHeaderStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{college.type}</span>
                      <button onClick={() => handleRemove(college.id)} style={cellRemoveBtnStyle} title="Remove from comparison">
                        <X size={14} />
                      </button>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#ffffff', lineHeight: 1.3 }}>
                      {college.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{college.city}, {college.state}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            
            {/* 1. ACADEMIC RANKINGS */}
            <tr>
              <td style={sectionHeaderStyle} colSpan={colleges.length + 1}>Rankings & Ratings</td>
            </tr>
            <tr>
              <td style={rowLabelStyle}>NIRF Ranking</td>
              {colleges.map((c) => (
                <td key={c.id} style={{ ...valueCellStyle, fontWeight: 700 }}>
                  <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Award size={14} /> NIRF #{c.nirfRank}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td style={rowLabelStyle}>Overall Rating</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 800 }}>
                    <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                    {c.rating ? c.rating.toFixed(1) : 'N/A'}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 400 }}>/5.0</span>
                  </div>
                </td>
              ))}
            </tr>
            {ratingKeys.map((item) => (
              <tr key={item.key}>
                <td style={{ ...rowLabelStyle, paddingLeft: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.label}
                </td>
                {colleges.map((c) => {
                  const score = c.subRatings?.[item.key as keyof typeof c.subRatings] || 0;
                  return (
                    <td key={c.id} style={valueCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{score.toFixed(1)}</span>
                        <div style={{ flex: 1, minWidth: '80px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '2px' }}></div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* 2. COSTS & FINANCIALS */}
            <tr>
              <td style={sectionHeaderStyle} colSpan={colleges.length + 1}>Tuition Fees</td>
            </tr>
            <tr>
              <td style={rowLabelStyle}>Avg Annual Fee</td>
              {colleges.map((c) => (
                <td key={c.id} style={{ ...valueCellStyle, fontWeight: 700, color: 'var(--primary-hover)' }}>
                  ₹{(c.fees / 100000).toFixed(2)} Lakh / Yr
                </td>
              ))}
            </tr>
            <tr>
              <td style={rowLabelStyle}>Course Offerings</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 700 }}>{c.courses?.length || 0} Programs Available</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Min course fee: ₹{Math.min(...(c.courses?.map(curr => curr.fees) || [c.fees])).toLocaleString()} / Yr
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* 3. PLACEMENT METRICS */}
            <tr>
              <td style={sectionHeaderStyle} colSpan={colleges.length + 1}>Placement Records</td>
            </tr>
            <tr>
              <td style={rowLabelStyle}>Highest Package</td>
              {colleges.map((c) => (
                <td key={c.id} style={{ ...valueCellStyle, fontWeight: 800, color: '#34d399' }}>
                  {c.placementStats?.highestPackage ? (c.placementStats.highestPackage / 100000) : 0} LPA
                </td>
              ))}
            </tr>
            <tr>
              <td style={rowLabelStyle}>Median Package</td>
              {colleges.map((c) => (
                <td key={c.id} style={{ ...valueCellStyle, fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {c.placementStats?.medianPackage ? (c.placementStats.medianPackage / 100000) : 0} LPA
                </td>
              ))}
            </tr>
            <tr>
              <td style={rowLabelStyle}>Placement Rate</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>{c.placementStats?.placementRate || 0}%</span>
                    <div style={{ flex: 1, minWidth: '60px', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${c.placementStats?.placementRate || 0}%`, height: '100%', background: '#34d399', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>

            {/* 4. FACILITIES & INFRASTRUCTURE */}
            <tr>
              <td style={sectionHeaderStyle} colSpan={colleges.length + 1}>Facilities Comparison</td>
            </tr>
            <tr>
              <td style={rowLabelStyle}>Campus Facilities</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {c.facilities?.map((f) => (
                      <span key={f} style={facilityTagStyle}>
                        <Check size={10} style={{ color: '#22d3ee' }} /> {f}
                      </span>
                    )) || <span style={{ color: 'var(--text-muted)' }}>None registered</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* 5. GENERAL METRICS */}
            <tr>
              <td style={sectionHeaderStyle} colSpan={colleges.length + 1}>General Credentials</td>
            </tr>
            <tr>
              <td style={rowLabelStyle}>Established Year</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  {c.established} (Age: {new Date().getFullYear() - c.established} years)
                </td>
              ))}
            </tr>
            <tr>
              <td style={rowLabelStyle}>Actions</td>
              {colleges.map((c) => (
                <td key={c.id} style={valueCellStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate(`/colleges/${c.id}`)} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      View Details
                    </button>
                    <button onClick={() => handleRemove(c.id)} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--danger)' }}>
                      Remove
                    </button>
                  </div>
                </td>
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}

const backBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  transition: 'color var(--transition-fast)',
};

const emptyContainerStyle: CSSProperties = {
  textAlign: 'center',
  padding: '6rem 2rem',
  background: 'rgba(255, 255, 255, 0.01)',
};

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
};

const headerCellStyle: CSSProperties = {
  padding: '1rem',
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border-color)',
};

const collegeHeaderStyle: CSSProperties = {
  padding: '1rem',
  borderBottom: '1px solid var(--border-color)',
  borderLeft: '1px solid var(--border-color)',
};

const cellRemoveBtnStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: 'none',
  borderRadius: '50%',
  color: 'var(--text-secondary)',
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const sectionHeaderStyle: CSSProperties = {
  padding: '1rem 0.75rem 0.5rem',
  fontSize: '1rem',
  fontWeight: 800,
  color: '#ffffff',
  background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.08) 0%, transparent 100%)',
  borderBottom: '1px solid var(--border-color)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const rowLabelStyle: CSSProperties = {
  padding: '0.9rem 1rem',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
};

const valueCellStyle: CSSProperties = {
  padding: '0.9rem 1rem',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid rgba(255,255,255,0.03)',
  borderLeft: '1px solid var(--border-color)',
};

const facilityTagStyle: CSSProperties = {
  fontSize: '0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  padding: '0.15rem 0.45rem',
  borderRadius: '0.25rem',
  border: '1px solid rgba(255,255,255,0.05)',
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
};
