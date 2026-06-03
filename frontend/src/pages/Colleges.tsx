import { useEffect, useState } from 'react';
import type { College } from '../types';
import { fetchColleges, type CollegeFilters } from '../api';
import CollegeCard from '../components/CollegeCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import { SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';

export default function Colleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse initial query params from hash location
  const getInitialFilters = (): CollegeFilters => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return { sortBy: 'rank_asc' };
    
    const params = new URLSearchParams(hash.substring(qIdx));
    return {
      search: params.get('search') || undefined,
      state: params.get('state') || undefined,
      city: params.get('city') || undefined,
      type: params.get('type') || undefined,
      maxFees: params.get('maxFees') ? parseInt(params.get('maxFees')!) : undefined,
      minPackage: params.get('minPackage') ? parseInt(params.get('minPackage')!) : undefined,
      minRating: params.get('minRating') ? parseFloat(params.get('minRating')!) : undefined,
      sortBy: params.get('sortBy') || 'rank_asc',
    };
  };

  const [filters, setFilters] = useState<CollegeFilters>(getInitialFilters);

  // Sync state when hash changes directly
  useEffect(() => {
    const handleHashChange = () => {
      setFilters(getInitialFilters());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch all colleges once to populate dynamic filters
  useEffect(() => {
    fetchColleges()
      .then((data) => {
        setColleges(data);
      })
      .catch((err) => console.error('Error fetching colleges:', err));
  }, []);

  // Fetch filtered colleges whenever filters change
  useEffect(() => {
    setLoading(true);
    fetchColleges(filters)
      .then((data) => {
        setFilteredColleges(data);
      })
      .catch((err) => console.error('Error filtering colleges:', err))
      .finally(() => setLoading(false));

    // Update URL hash to reflect active filters without triggering reload loop
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const basePath = window.location.hash.split('?')[0] || '#/colleges';
    const newHash = basePath + (queryString ? '?' + queryString : '');
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [filters]);

  const handleFilterChange = (newFilters: CollegeFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchQuery: string) => {
    setFilters((prev) => ({ ...prev, search: searchQuery || undefined }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          Explore <span className="gradient-text-cyan">Colleges & Universities</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Compare fees, NIRF rankings, courses, and placement parameters. Apply directly in minutes.
        </p>
      </div>

      {/* Top Controls: Search and Mobile Filter Toggle */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SearchBar initialValue={filters.search} onSearch={handleSearch} placeholder="Search by name, city, state, course..." />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="btn btn-secondary mobile-filter-toggle"
            style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(18, 18, 35, 0.45)',
            border: '1px solid var(--border-color)',
            padding: '0.4rem 0.8rem',
            borderRadius: '0.75rem',
            cursor: 'pointer'
          }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={filters.sortBy || 'rank_asc'}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="rank_asc" style={{ background: '#0a0a14' }}>Sort: NIRF Rank</option>
              <option value="rating_desc" style={{ background: '#0a0a14' }}>Sort: Rating (High to Low)</option>
              <option value="fees_asc" style={{ background: '#0a0a14' }}>Sort: Fees (Low to High)</option>
              <option value="fees_desc" style={{ background: '#0a0a14' }}>Sort: Fees (High to Low)</option>
              <option value="package_desc" style={{ background: '#0a0a14' }}>Sort: Highest Package</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2rem',
        position: 'relative'
      }} className="colleges-layout-grid">
        
        {/* Desktop Sidebar Filters */}
        <div className="filters-sidebar-desktop">
          <FilterSidebar colleges={colleges} filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="filters-sidebar-mobile-overlay" onClick={() => setShowMobileFilters(false)}>
            <div className="filters-sidebar-mobile-content" onClick={(e) => e.stopPropagation()}>
              <FilterSidebar colleges={colleges} filters={filters} onFilterChange={handleFilterChange} />
              <button
                className="btn btn-primary"
                onClick={() => setShowMobileFilters(false)}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Grid and Listing Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Showing <strong>{filteredColleges.length}</strong> college{filteredColleges.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 0',
              gap: '1rem',
              color: 'var(--text-secondary)'
            }}>
              <RefreshCw size={36} className="spin-animation" style={{ color: 'var(--primary)' }} />
              <span>Filtering college registry database...</span>
            </div>
          ) : filteredColleges.length > 0 ? (
            <div className="college-grid">
              {filteredColleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.01)'
            }}>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff' }}>No Colleges Match Your Filters</p>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Try relaxing your search terms or expanding filter limits like maximum fees, min package, or regions.
              </p>
              <button
                onClick={() => setFilters({ sortBy: 'rank_asc' })}
                className="btn btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .colleges-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .filters-sidebar-desktop {
            display: none !important;
          }
          .mobile-filter-toggle {
            display: inline-flex !important;
          }
        }

        .filters-sidebar-mobile-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(2, 2, 5, 0.85);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .filters-sidebar-mobile-content {
          background: var(--bg-surface);
          width: 320px;
          height: 100vh;
          overflow-y: auto;
          padding: 1.5rem;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
