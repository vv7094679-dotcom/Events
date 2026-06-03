import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { College } from '../types';
import type { CollegeFilters } from '../api';
import { Filter, RotateCcw, ChevronDown, ChevronUp, Check, Star } from 'lucide-react';

interface FilterSidebarProps {
  colleges: College[];
  filters: CollegeFilters;
  onFilterChange: (filters: CollegeFilters) => void;
}

export default function FilterSidebar({ colleges, filters, onFilterChange }: FilterSidebarProps) {
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  // Accordion open/close states
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    state: true,
    city: true,
    type: true,
    fees: true,
    placement: true,
    rating: true
  });

  // Extract unique filters from colleges list
  useEffect(() => {
    if (colleges.length > 0) {
      const uniqueStates = Array.from(new Set(colleges.map(c => c.state))).filter(Boolean).sort();
      const uniqueCities = Array.from(new Set(colleges.map(c => c.city))).filter(Boolean).sort();
      const uniqueTypes = Array.from(new Set(colleges.map(c => c.type))).filter(Boolean).sort();
      
      setStates(uniqueStates);
      setCities(uniqueCities);
      setTypes(uniqueTypes);
    }
  }, [colleges]);

  const toggleSection = (section: string) => {
    setOpenSection(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleStateToggle = (stateName: string) => {
    const activeStates = filters.state ? filters.state.split(',') : [];
    let updated: string[];
    if (activeStates.includes(stateName)) {
      updated = activeStates.filter(s => s !== stateName);
    } else {
      updated = [...activeStates, stateName];
    }
    onFilterChange({ ...filters, state: updated.join(',') });
  };

  const handleCityToggle = (cityName: string) => {
    const activeCities = filters.city ? filters.city.split(',') : [];
    let updated: string[];
    if (activeCities.includes(cityName)) {
      updated = activeCities.filter(c => c !== cityName);
    } else {
      updated = [...activeCities, cityName];
    }
    onFilterChange({ ...filters, city: updated.join(',') });
  };

  const handleTypeToggle = (typeName: string) => {
    const activeTypes = filters.type ? filters.type.split(',') : [];
    let updated: string[];
    if (activeTypes.includes(typeName)) {
      updated = activeTypes.filter(t => t !== typeName);
    } else {
      updated = [...activeTypes, typeName];
    }
    onFilterChange({ ...filters, type: updated.join(',') });
  };

  const handleRangeChange = (key: 'maxFees' | 'minPackage', value: number) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const handleRatingSelect = (rating: number | undefined) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const handleReset = () => {
    onFilterChange({
      search: filters.search, // Preserve text search query
      state: undefined,
      city: undefined,
      type: undefined,
      maxFees: undefined,
      minPackage: undefined,
      minRating: undefined,
      sortBy: filters.sortBy // Preserve active sorting
    });
  };

  const activeStates = filters.state ? filters.state.split(',') : [];
  const activeCities = filters.city ? filters.city.split(',') : [];
  const activeTypes = filters.type ? filters.type.split(',') : [];

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      height: 'fit-content',
      position: 'sticky',
      top: '90px'
    }}>
      {/* Sidebar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <span>Filters</span>
        </div>
        <button
          onClick={handleReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color var(--transition-fast)'
          }}
          className="reset-btn-hover"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* FILTER SECTION: STATE */}
      {states.length > 0 && (
        <div style={sectionStyle}>
          <button onClick={() => toggleSection('state')} style={sectionHeaderStyle}>
            <span>State</span>
            {openSection.state ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection.state && (
            <div style={sectionBodyStyle}>
              {states.map(stateName => (
                <label key={stateName} style={checkboxLabelStyle} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeStates.includes(stateName)}
                    onChange={() => handleStateToggle(stateName)}
                    style={{ display: 'none' }}
                  />
                  <div style={checkboxBoxStyle(activeStates.includes(stateName))}>
                    {activeStates.includes(stateName) && <Check size={12} style={{ color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{stateName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILTER SECTION: CITY */}
      {cities.length > 0 && (
        <div style={sectionStyle}>
          <button onClick={() => toggleSection('city')} style={sectionHeaderStyle}>
            <span>City</span>
            {openSection.city ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection.city && (
            <div style={sectionBodyStyle}>
              {cities.map(cityName => (
                <label key={cityName} style={checkboxLabelStyle} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeCities.includes(cityName)}
                    onChange={() => handleCityToggle(cityName)}
                    style={{ display: 'none' }}
                  />
                  <div style={checkboxBoxStyle(activeCities.includes(cityName))}>
                    {activeCities.includes(cityName) && <Check size={12} style={{ color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{cityName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILTER SECTION: TYPE */}
      {types.length > 0 && (
        <div style={sectionStyle}>
          <button onClick={() => toggleSection('type')} style={sectionHeaderStyle}>
            <span>Institution Type</span>
            {openSection.type ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSection.type && (
            <div style={sectionBodyStyle}>
              {types.map(typeName => (
                <label key={typeName} style={checkboxLabelStyle} className="filter-checkbox-label">
                  <input
                    type="checkbox"
                    checked={activeTypes.includes(typeName)}
                    onChange={() => handleTypeToggle(typeName)}
                    style={{ display: 'none' }}
                  />
                  <div style={checkboxBoxStyle(activeTypes.includes(typeName))}>
                    {activeTypes.includes(typeName) && <Check size={12} style={{ color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>{typeName}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FILTER SECTION: FEES */}
      <div style={sectionStyle}>
        <button onClick={() => toggleSection('fees')} style={sectionHeaderStyle}>
          <span>Max Annual Fees</span>
          {openSection.fees ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSection.fees && (
          <div style={sectionBodyStyle}>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={filters.maxFees || 1000000}
              onChange={(e) => handleRangeChange('maxFees', parseInt(e.target.value))}
              style={{
                accentColor: 'var(--primary)',
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                height: '6px',
                borderRadius: '3px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>₹50K</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>
                {filters.maxFees ? `₹${(filters.maxFees / 100000).toFixed(2)} Lakh` : 'Any Fee'}
              </span>
              <span>₹10L</span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER SECTION: PLACEMENTS */}
      <div style={sectionStyle}>
        <button onClick={() => toggleSection('placement')} style={sectionHeaderStyle}>
          <span>Min Placement Package</span>
          {openSection.placement ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSection.placement && (
          <div style={sectionBodyStyle}>
            <input
              type="range"
              min="0"
              max="30"
              step="2"
              value={filters.minPackage || 0}
              onChange={(e) => handleRangeChange('minPackage', parseInt(e.target.value))}
              style={{
                accentColor: 'var(--accent-cyan)',
                width: '100%',
                background: 'rgba(255,255,255,0.1)',
                height: '6px',
                borderRadius: '3px',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>0 LPA</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>
                {filters.minPackage ? `${filters.minPackage} LPA` : 'Any Package'}
              </span>
              <span>30 LPA</span>
            </div>
          </div>
        )}
      </div>

      {/* FILTER SECTION: RATING */}
      <div style={sectionStyle}>
        <button onClick={() => toggleSection('rating')} style={sectionHeaderStyle}>
          <span>Minimum Rating</span>
          {openSection.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openSection.rating && (
          <div style={{ ...sectionBodyStyle, gap: '0.5rem' }}>
            {[4.5, 4.0, 3.5, 3.0].map((ratingVal) => (
              <button
                key={ratingVal}
                onClick={() => handleRatingSelect(filters.minRating === ratingVal ? undefined : ratingVal)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: filters.minRating === ratingVal ? 'var(--primary)' : 'var(--border-color)',
                  background: filters.minRating === ratingVal ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                  color: filters.minRating === ratingVal ? 'var(--primary-hover)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', color: '#fbbf24', gap: '2px' }}>
                  <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                </div>
                <span>{ratingVal.toFixed(1)} & Above</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .reset-btn-hover:hover {
          color: #ffffff !important;
        }
        .filter-checkbox-label:hover {
          color: #ffffff;
          cursor: pointer;
        }
        .filter-checkbox-label:hover > div {
          border-color: var(--primary) !important;
        }
      `}</style>
    </div>
  );
}

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  paddingBottom: '1rem'
};

const sectionHeaderStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  padding: '0.25rem 0',
  color: '#ffffff',
  textAlign: 'left'
};

const sectionBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  paddingLeft: '0.25rem'
};

const checkboxLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  color: 'var(--text-secondary)',
  transition: 'color var(--transition-fast)'
};

const checkboxBoxStyle = (checked: boolean): CSSProperties => ({
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  border: '1px solid',
  borderColor: checked ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
  background: checked ? 'var(--primary)' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all var(--transition-fast)'
});
