import { useEffect, useState } from 'react';
import type { College, Analytics } from '../types';
import { fetchColleges, fetchAnalytics } from '../api';
import { useRouter } from '../router';
import SearchBar from '../components/SearchBar';
import StatsCounter from '../components/StatsCounter';
import CollegeCard from '../components/CollegeCard';
import { BookOpen, Award, Shield, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Home() {
  const { navigate } = useRouter();
  const [featuredColleges, setFeaturedColleges] = useState<College[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Fetch featured colleges
    fetchColleges({ sortBy: 'rating_desc' }).then((data) => {
      setFeaturedColleges(data.filter(c => c.featured));
    }).catch(err => console.error(err));

    // Fetch analytics data for stats
    fetchAnalytics().then((data) => {
      setAnalytics(data);
    }).catch(err => console.error(err));
  }, []);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/colleges');
    }
  };

  const nextSlide = () => {
    if (featuredColleges.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % featuredColleges.length);
  };

  const prevSlide = () => {
    if (featuredColleges.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + featuredColleges.length) % featuredColleges.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
      
      {/* 1. HERO SECTION WITH GLOW */}
      <section style={{
        position: 'relative',
        padding: '5rem 1rem 4rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        overflow: 'hidden',
        borderRadius: '2rem',
      }}>
        {/* Glow Effects */}
        <div className="glow-ambient" style={{
          top: '-10%', left: '30%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)'
        }}></div>
        <div className="glow-ambient" style={{
          bottom: '-10%', right: '20%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)'
        }}></div>

        {/* Hero Tagline */}
        <span className="badge badge-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
          🎓 Advanced College Discovery Portal
        </span>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          maxWidth: '850px',
          margin: '0 auto',
        }}>
          Find Your Dream University. <br />
          <span className="gradient-text">Shape Your Future.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 1rem',
          lineHeight: '1.6'
        }}>
          Explore top-ranked engineering, management, and design institutes. Compare course curricula, placement stats, and apply with ease.
        </p>

        {/* Search Integration */}
        <div style={{ width: '100%', zIndex: 5 }}>
          <SearchBar onSearch={handleSearchSubmit} placeholder="Search by college name, city, state, or course..." />
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
          <StatsCounter
            value={analytics?.totalColleges || 15}
            label="Accredited Colleges"
            suffix="+"
          />
          <StatsCounter
            value={analytics?.highestPackage?.value ? Math.round(analytics.highestPackage.value / 100000) : 168}
            label={`Highest Package (${analytics?.highestPackage?.college ? analytics.highestPackage.college.split('(')[1]?.replace(')', '') || 'IITB' : 'LPA'})`}
            suffix=" LPA"
          />
          <StatsCounter
            value={analytics?.totalEnquiries || 240}
            label="Successful Enquiries"
            suffix="+"
          />
          <StatsCounter
            value={Math.round((analytics?.avgRating || 4.5) * 20)}
            label="Quality Score Index"
            suffix="%"
          />
        </div>
      </section>

      {/* 3. FEATURED COLLEGES CAROUSEL / GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Curated Selections</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Institutions</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Outstanding academic records, infrastructure, and world-class placement statistics.</p>
          </div>
          
          {featuredColleges.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={prevSlide} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {featuredColleges.length > 0 ? (
          <div>
            {/* Desktop / Large Carousel */}
            <div style={{ display: 'none', position: 'relative' }} className="carousel-desktop">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '3rem',
                alignItems: 'center',
                minHeight: '400px',
                padding: '2.5rem',
                background: 'var(--bg-glass-card)',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-color)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-primary">Ranked #{featuredColleges[activeSlide].nirfRank} in India</span>
                    <span className="badge badge-cyan">{featuredColleges[activeSlide].type}</span>
                  </div>
                  <h3 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                    {featuredColleges[activeSlide].name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7', fontSize: '1.05rem' }}>
                    {featuredColleges[activeSlide].description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Established</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{featuredColleges[activeSlide].established}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Highest CTC</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>{featuredColleges[activeSlide].placementStats.highestPackage / 100000} LPA</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Overall Rating</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24' }}>
                        <Star size={16} fill="#fbbf24" style={{ color: '#fbbf24' }} /> {featuredColleges[activeSlide].rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/colleges/${featuredColleges[activeSlide].id}`)}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem' }}
                  >
                    View University Profile <ArrowRight size={18} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Key Facilities</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {featuredColleges[activeSlide].facilities.map((fac) => (
                      <span key={fac} style={{
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.85rem'
                      }}>{fac}</span>
                    ))}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Top Recruiters</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {featuredColleges[activeSlide].placementStats.topRecruiters.map((rec) => (
                      <span key={rec} style={{
                        padding: '0.4rem 0.8rem',
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: 'var(--primary-hover)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>{rec}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Featured Display (Simple Grid) */}
            <div className="carousel-mobile">
              <CollegeCard college={featuredColleges[activeSlide]} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading featured institutions...
          </div>
        )}
      </section>

      {/* 4. PLATFORM VALUE PROPOSITION */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.15)', width: '48px', height: '48px',
            borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-hover)'
          }}>
            <BookOpen size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Curriculum Focused</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Browse through detailed lists of engineering, technology, and management courses, complete with seat capacities and annual fees structure.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)', width: '48px', height: '48px',
            borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#22d3ee'
          }}>
            <Award size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Verified Placements</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Access top placement statistics including median packages, highest packages, placement percentages, and key hiring partners.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)', width: '48px', height: '48px',
            borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#34d399'
          }}>
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Direct Admissions</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Submit direct enquiries to the admissions cell. Track your lead status transparently inside our database administration systems.
          </p>
        </div>
      </section>

      {/* Styles for showing/hiding desktop/mobile carousel */}
      <style>{`
        @media (min-width: 768px) {
          .carousel-desktop {
            display: block !important;
          }
          .carousel-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
