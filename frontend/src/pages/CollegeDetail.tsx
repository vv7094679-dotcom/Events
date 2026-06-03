import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from '../router';
import type { College, Course, Review } from '../types';
import { fetchCollege, submitReview } from '../api';
import ReviewCard from '../components/ReviewCard';
import EnquiryModal from '../components/EnquiryModal';
import { MapPin, Star, Building, IndianRupee, Trophy, GraduationCap, Users, ClipboardCheck, ArrowLeft, RefreshCw, StarOff } from 'lucide-react';

export default function CollegeDetail() {
  const { params, navigate } = useRouter();
  const collegeId = params.id;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');

  // Submit Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [ratingAcademics, setRatingAcademics] = useState(5);
  const [ratingPlacements, setRatingPlacements] = useState(5);
  const [ratingCampusLife, setRatingCampusLife] = useState(5);
  const [ratingInfrastructure, setRatingInfrastructure] = useState(5);
  
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const loadCollegeData = () => {
    if (!collegeId) return;
    setLoading(true);
    fetchCollege(collegeId)
      .then((data) => {
        setCollege(data);
      })
      .catch((err) => {
        console.error('Error fetching college detail:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCollegeData();
  }, [collegeId]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!collegeId || !reviewAuthor || !reviewComment) {
      setReviewError('Please provide your name and a brief comment.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const updatedCollege = await submitReview(collegeId, {
        author: reviewAuthor,
        comment: reviewComment,
        academics: ratingAcademics,
        placements: ratingPlacements,
        campusLife: ratingCampusLife,
        infrastructure: ratingInfrastructure,
      });

      // Update college state with new ratings and reviews
      setCollege(updatedCollege);
      
      // Reset review form fields
      setReviewAuthor('');
      setReviewComment('');
      setRatingAcademics(5);
      setRatingPlacements(5);
      setRatingCampusLife(5);
      setRatingInfrastructure(5);
    } catch (err) {
      console.error(err);
      setReviewError('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', gap: '1rem' }}>
        <RefreshCw size={42} className="spin-animation" style={{ color: 'var(--primary)' }} />
        <span style={{ color: 'var(--text-secondary)' }}>Loading university profile details...</span>
      </div>
    );
  }

  if (!college) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>College Profile Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The requested college might have been removed or doesn't exist.</p>
        <button onClick={() => navigate('/colleges')} className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Browse
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/colleges')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'color var(--transition-fast)'
          }}
          className="back-btn-hover"
        >
          <ArrowLeft size={16} />
          Back to Listings
        </button>
      </div>

      {/* 1. HERO HEADER SUMMARY */}
      <section className="glass-panel" style={{
        position: 'relative',
        padding: '3rem 2rem',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2.5rem',
        alignItems: 'center',
      }} className="college-header-panel">
        
        <div style={{
          position: 'absolute',
          top: '-10%', right: '20%', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-primary">NIRF Ranked #{college.nirfRank}</span>
            <span className="badge badge-cyan">{college.type} Institute</span>
            <span className="badge badge-success">Est. {college.established}</span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
            {college.name}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={16} />
              <span>{college.city}, {college.state}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building size={16} />
              <span>State University Code: {college.id}</span>
            </div>
          </div>
        </div>

        {/* Action Panel Right */}
        <div style={{
          zIndex: 1,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.04)',
          borderRadius: '1rem',
          padding: '1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall score</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
              <Star size={24} fill="#fbbf24" style={{ color: '#fbbf24' }} />
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{college.rating ? college.rating.toFixed(1) : '0.0'}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>/ 5.0</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on {college.reviews?.length || 0} reviews</span>
          </div>

          <button
            onClick={() => setShowEnquiry(true)}
            className="btn btn-primary"
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ClipboardCheck size={18} />
            Apply / Enquire Now
          </button>
        </div>
      </section>

      {/* 2. TABS NAVIGATION */}
      <section style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'overview', name: 'Overview & Facilities' },
          { id: 'courses', name: `Courses & Fees (${college.courses?.length || 0})` },
          { id: 'placements', name: 'Placement Stats' },
          { id: 'reviews', name: `Student Reviews (${college.reviews?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid',
              borderBottomColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary-hover)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab.name}
          </button>
        ))}
      </section>

      {/* 3. TABS CONTENT */}
      <section style={{ minHeight: '300px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }} className="details-overview-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={20} style={{ color: 'var(--primary)' }} />
                  About the Institution
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                  {college.description}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building size={18} style={{ color: 'var(--accent-cyan)' }} />
                  Facilities & Infrastructure
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {college.facilities?.map((facility) => (
                    <span
                      key={facility}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500
                      }}
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES & FEES */}
        {activeTab === 'courses' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Offered Academic Programs</h3>
            
            {college.courses && college.courses.length > 0 ? (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Duration</th>
                      <th>Seats Capacity</th>
                      <th>Annual Tuition Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses.map((course: Course) => (
                      <tr key={course.name}>
                        <td style={{ fontWeight: 600, color: '#ffffff' }}>{course.name}</td>
                        <td>{course.duration}</td>
                        <td style={{ fontFamily: 'var(--mono)' }}>{course.seats} Seats</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary-hover)', display: 'flex', alignItems: 'center', borderBottom: 'none' }}>
                          <IndianRupee size={12} />
                          {course.fees.toLocaleString('en-IN')} / Yr
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No active programs registered.</p>
            )}
          </div>
        )}

        {/* TAB 3: PLACEMENTS */}
        {activeTab === 'placements' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }} className="details-placements-grid">
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={20} style={{ color: '#fbbf24' }} />
                Salary & Placement Benchmarks
              </h3>

              {/* Placement Stats Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Placement Success Rate</span>
                    <span style={{ fontWeight: 700, color: '#ffffff' }}>{college.placementStats?.placementRate}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${college.placementStats?.placementRate || 0}%`,
                      height: '100%',
                      background: 'var(--primary-gradient)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Highest Package CTC</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <IndianRupee size={18} /> {college.placementStats?.highestPackage ? college.placementStats.highestPackage / 100000 : 0} LPA
                    </span>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Median Package CTC</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <IndianRupee size={18} /> {college.placementStats?.medianPackage ? college.placementStats.medianPackage / 100000 : 0} LPA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} style={{ color: 'var(--primary-hover)' }} />
                Prime Hiring Partners
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {college.placementStats?.topRecruiters?.map((recruiter) => (
                  <span
                    key={recruiter}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(139, 92, 246, 0.07)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      fontSize: '0.9rem',
                      color: 'var(--primary-hover)',
                      fontWeight: 600
                    }}
                  >
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem' }} className="details-reviews-grid">
            
            {/* Left: Overall Subratings + Submit Review Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Average subratings display */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Experience Ratings</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(college.subRatings || {}).map(([key, score]) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span style={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Star size={12} fill="#fbbf24" style={{ color: '#fbbf24' }} /> {score.toFixed(1)}
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${(score / 5) * 100}%`,
                          height: '100%',
                          background: 'var(--accent-cyan-gradient)',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit a review Form */}
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Write a Review</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Share your campus or placements experience.</p>

                {reviewError && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem' }}>{reviewError}</p>
                )}

                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Student / Alumni Name</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Priyan Jain"
                      className="input-field"
                    />
                  </div>

                  {/* Ratings selectors */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    background: 'rgba(255,255,255,0.01)',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)'
                  }}>
                    {[
                      { label: 'Academics', value: ratingAcademics, setter: setRatingAcademics },
                      { label: 'Placements', value: ratingPlacements, setter: setRatingPlacements },
                      { label: 'Campus Life', value: ratingCampusLife, setter: setRatingCampusLife },
                      { label: 'Infrastructure', value: ratingInfrastructure, setter: setRatingInfrastructure },
                    ].map((item) => (
                      <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                        <select
                          value={item.value}
                          onChange={(e) => item.setter(parseInt(e.target.value))}
                          className="input-field"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem', background: '#121225' }}
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} Stars</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Your Experience / Comment</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Tell future students about placements, class quality, fests, faculty..."
                      className="input-field"
                      style={{ resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      pointerEvents: reviewSubmitting ? 'none' : 'auto',
                      opacity: reviewSubmitting ? 0.7 : 1
                    }}
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Post Student Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Student Testimonials</h3>
              
              {college.reviews && college.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '700px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {college.reviews.map((review: Review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.01)' }}>
                  <StarOff size={32} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No Student Reviews Yet</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Be the first student to post a review about {college.name}!</p>
                </div>
              )}
            </div>

          </div>
        )}

      </section>

      {/* 4. ENQUIRY MODAL POPUP */}
      {showEnquiry && (
        <EnquiryModal college={college} onClose={() => setShowEnquiry(false)} />
      )}

      <style>{`
        .back-btn-hover:hover {
          color: #ffffff !important;
        }

        @media (max-width: 900px) {
          .college-header-panel {
            grid-template-columns: 1fr !important;
          }
          .details-overview-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .details-placements-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .details-reviews-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
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
