import { useEffect, useState, type FormEvent } from 'react';
import type { College, Enquiry, Analytics } from '../types';
import {
  fetchColleges,
  createCollege,
  updateCollege,
  deleteCollege,
  fetchEnquiries,
  updateEnquiryStatus,
  fetchAnalytics
} from '../api';
import {
  LayoutDashboard,
  School,
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Check,
  RefreshCw,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  AlertCircle,
  X
} from 'lucide-react';

export default function Admin() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'colleges' | 'enquiries'>('dashboard');

  // CRUD College Modal Form States
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);
  
  const [colName, setColName] = useState('');
  const [colCity, setColCity] = useState('');
  const [colState, setColState] = useState('');
  const [colEstablished, setColEstablished] = useState(2000);
  const [colType, setColType] = useState('Private');
  const [colNirf, setColNirf] = useState(100);
  const [colFees, setColFees] = useState(150000);
  const [colDescription, setColDescription] = useState('');
  const [colFeatured, setColFeatured] = useState(false);
  
  // Placement Stats for CRUD
  const [colHighestPackage, setColHighestPackage] = useState(12);
  const [colMedianPackage, setColMedianPackage] = useState(6);
  const [colPlacementRate, setColPlacementRate] = useState(85);
  const [colTopRecruiters, setColTopRecruiters] = useState('');
  
  // Course Management inside Form
  const [coursesInput, setCoursesInput] = useState<{ name: string; duration: string; fees: number; seats: number }[]>([
    { name: 'B.Tech Computer Science', duration: '4 Years', fees: 150000, seats: 60 }
  ]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseFees, setNewCourseFees] = useState(150000);

  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadAnalytics = () => {
    setLoadingAnalytics(true);
    fetchAnalytics()
      .then(setAnalytics)
      .catch(err => console.error(err))
      .finally(() => setLoadingAnalytics(false));
  };

  const loadColleges = () => {
    setLoadingColleges(true);
    fetchColleges()
      .then(setColleges)
      .catch(err => console.error(err))
      .finally(() => setLoadingColleges(false));
  };

  const loadEnquiries = () => {
    setLoadingEnquiries(true);
    fetchEnquiries()
      .then(setEnquiries)
      .catch(err => console.error(err))
      .finally(() => setLoadingEnquiries(false));
  };

  useEffect(() => {
    loadAnalytics();
    loadColleges();
    loadEnquiries();
  }, []);

  // Handle Enquiry Status updates
  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      // reload lists
      loadEnquiries();
      loadAnalytics();
    } catch (err) {
      console.error('Enquiry update failed:', err);
    }
  };

  // Open Add/Edit College Modal
  const openCollegeModal = (collegeToEdit: College | null = null) => {
    setFormError(null);
    if (collegeToEdit) {
      setEditingCollegeId(collegeToEdit.id);
      setColName(collegeToEdit.name);
      setColCity(collegeToEdit.city);
      setColState(collegeToEdit.state);
      setColEstablished(collegeToEdit.established);
      setColType(collegeToEdit.type);
      setColNirf(collegeToEdit.nirfRank);
      setColFees(collegeToEdit.fees);
      setColDescription(collegeToEdit.description);
      setColFeatured(collegeToEdit.featured);
      
      setColHighestPackage((collegeToEdit.placementStats?.highestPackage || 0) / 100000);
      setColMedianPackage((collegeToEdit.placementStats?.medianPackage || 0) / 100000);
      setColPlacementRate(collegeToEdit.placementStats?.placementRate || 0);
      setColTopRecruiters(collegeToEdit.placementStats?.topRecruiters?.join(', ') || '');
      
      setCoursesInput(collegeToEdit.courses || []);
    } else {
      setEditingCollegeId(null);
      setColName('');
      setColCity('');
      setColState('');
      setColEstablished(2000);
      setColType('Private');
      setColNirf(100);
      setColFees(150000);
      setColDescription('');
      setColFeatured(false);
      setColHighestPackage(12);
      setColMedianPackage(6);
      setColPlacementRate(85);
      setColTopRecruiters('Google, Microsoft, Amazon');
      setCoursesInput([{ name: 'B.Tech Computer Science', duration: '4 Years', fees: 150000, seats: 60 }]);
    }
    setShowCollegeModal(true);
  };

  // Delete College Handler
  const handleDeleteCollege = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this college profile? This cannot be undone.')) {
      try {
        await deleteCollege(id);
        loadColleges();
        loadAnalytics();
      } catch (err) {
        console.error('Delete college failed:', err);
      }
    }
  };

  // Add course to local form state
  const handleAddCourseToForm = () => {
    if (!newCourseName.trim()) return;
    setCoursesInput([
      ...coursesInput,
      { name: newCourseName, duration: '4 Years', fees: newCourseFees, seats: 60 }
    ]);
    setNewCourseName('');
  };

  // Remove course from local form state
  const handleRemoveCourseFromForm = (idx: number) => {
    setCoursesInput(coursesInput.filter((_, i) => i !== idx));
  };

  // Handle Form Submission for College Create/Update
  const handleCollegeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!colName || !colCity || !colState) {
      setFormError('Please fill in all core credentials.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    const payload = {
      name: colName,
      city: colCity,
      state: colState,
      established: colEstablished,
      type: colType,
      nirfRank: colNirf,
      fees: colFees,
      description: colDescription,
      featured: colFeatured,
      highestPackage: colHighestPackage * 100000,
      medianPackage: colMedianPackage * 100000,
      placementRate: colPlacementRate,
      topRecruiters: colTopRecruiters.split(',').map(s => s.trim()).filter(Boolean),
      courses: coursesInput
    };

    try {
      if (editingCollegeId) {
        await updateCollege(editingCollegeId, payload);
      } else {
        await createCollege(payload);
      }
      setShowCollegeModal(false);
      loadColleges();
      loadAnalytics();
    } catch (err) {
      console.error(err);
      setFormError('Failed to save college. Please check connections.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Admin Title */}
      <div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
          EduSphere <span className="gradient-text">Admin Panel</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage universities, approve new courses, track admission enquiries, and review global platform analytics.
        </p>
      </div>

      {/* Tabs navigation */}
      <section style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }}>
        {[
          { id: 'dashboard', name: 'Dashboard Analytics', icon: LayoutDashboard },
          { id: 'colleges', name: 'Manage Colleges', icon: School },
          { id: 'enquiries', name: 'Admissions Enquiries', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid',
                borderBottomColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-hover)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={16} />
              {tab.name}
            </button>
          );
        })}
      </section>

      {/* Active Tab Contents */}
      <section style={{ minHeight: '400px' }}>
        
        {/* 1. DASHBOARD ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {loadingAnalytics ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <RefreshCw size={24} className="spin-animation" /> Loading dashboard...
              </div>
            ) : (
              <>
                {/* Stats Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem'
                }}>
                  
                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary-hover)' }}>
                      <School size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Institutes</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{analytics?.totalColleges || 0}</h3>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                      <Users size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Leads</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{analytics?.totalEnquiries || 0}</h3>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                      <Award size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Avg Rating Score</span>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{analytics?.avgRating ? analytics.avgRating.toFixed(2) : '0.00'}</h3>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                      <Briefcase size={28} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Highest CTC Package</span>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{analytics?.highestPackage?.value ? analytics.highestPackage.value / 100000 : 0} LPA</h3>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>at {analytics?.highestPackage?.college ? analytics.highestPackage.college.split('(')[1]?.replace(')', '') || 'IITB' : 'N/A'}</span>
                    </div>
                  </div>

                </div>

                {/* Grid charts and lead breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="admin-dashboard-grid">
                  
                  {/* Lead Status Table */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <TrendingUp size={18} style={{ color: 'var(--primary-hover)' }} />
                      Admissions Lead Conversion
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {[
                        { label: 'New Inquiries', count: analytics?.leadStatuses?.New || 0, color: 'var(--accent-cyan)' },
                        { label: 'Contacted Students', count: analytics?.leadStatuses?.Contacted || 0, color: '#fbbf24' },
                        { label: 'Enrolled / Closed Admissions', count: analytics?.leadStatuses?.Enrolled || 0, color: 'var(--success)' },
                      ].map((item) => {
                        const total = analytics?.totalEnquiries || 1;
                        const percentage = ((item.count / total) * 100).toFixed(0);
                        return (
                          <div key={item.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                              <span style={{ fontWeight: 700, color: '#ffffff' }}>{item.count} ({percentage}%)</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                              <div style={{
                                width: `${percentage}%`,
                                height: '100%',
                                background: item.color,
                                borderRadius: '4px'
                              }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Health */}
                  <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Data Registry Operations</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      The College Discovery Platform is connected to the Local JSON Database. Use the CRUD controllers to seed data or configure system entries.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button onClick={loadAnalytics} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                        Refresh Server Cache
                      </button>
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}

        {/* 2. MANAGE COLLEGES (CRUD) */}
        {activeTab === 'colleges' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>College Registry Directory</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Add new college listings or edit existing records.</p>
              </div>

              <button onClick={() => openCollegeModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Plus size={16} /> Add College Listing
              </button>
            </div>

            {loadingColleges ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <RefreshCw size={24} className="spin-animation" /> Loading directory...
              </div>
            ) : (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>College ID</th>
                      <th>University Name</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>NIRF Rank</th>
                      <th>Annual Fee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.map((col) => (
                      <tr key={col.id}>
                        <td style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem' }}>{col.id}</td>
                        <td style={{ fontWeight: 600, color: '#ffffff' }}>
                          {col.name}
                          {col.featured && (
                            <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', marginLeft: '0.5rem' }}>Featured</span>
                          )}
                        </td>
                        <td>{col.city}, {col.state}</td>
                        <td>{col.type}</td>
                        <td style={{ fontWeight: 700 }}>#{col.nirfRank}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>₹{(col.fees / 100000).toFixed(2)}L</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => openCollegeModal(col)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.4rem', borderRadius: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.03)' }}
                              title="Edit listing details"
                            >
                              <Edit2 size={14} style={{ color: 'var(--accent-cyan)' }} />
                            </button>
                            <button
                              onClick={() => handleDeleteCollege(col.id)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.4rem', borderRadius: '0.4rem', border: 'none', background: 'rgba(255,255,255,0.03)' }}
                              title="Delete listing"
                            >
                              <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 3. ADMISSIONS ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Admissions Lead Pipeline</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Track direct student applications and change follow-up statuses.
            </p>

            {loadingEnquiries ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <RefreshCw size={24} className="spin-animation" /> Loading enquiries...
              </div>
            ) : enquiries.length > 0 ? (
              <div className="custom-table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student Credentials</th>
                      <th>Target Institution</th>
                      <th>Preferred Course</th>
                      <th>Academic Record</th>
                      <th>Status Badge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {new Date(enq.date).toLocaleDateString()}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#ffffff' }}>{enq.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{enq.email} | {enq.phone}</div>
                          {enq.message && (
                            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={enq.message}>
                              "{enq.message}"
                            </div>
                          )}
                        </td>
                        <td>{enq.collegeName}</td>
                        <td style={{ fontSize: '0.9rem' }}>{enq.course}</td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{enq.qualification}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary-hover)', fontWeight: 600 }}>Score: {enq.score}</div>
                        </td>
                        <td>
                          <span className={`badge ${
                            enq.status === 'Enrolled' ? 'badge-success' :
                            enq.status === 'Contacted' ? 'badge-warning' : 'badge-cyan'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {enq.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {enq.status !== 'Contacted' && enq.status !== 'Enrolled' && (
                              <button
                                onClick={() => handleStatusUpdate(enq.id, 'Contacted')}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '0.4rem' }}
                              >
                                Contact
                              </button>
                            )}
                            {enq.status !== 'Enrolled' && (
                              <button
                                onClick={() => handleStatusUpdate(enq.id, 'Enrolled')}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '0.4rem' }}
                              >
                                Enroll
                              </button>
                            )}
                            {enq.status === 'Enrolled' && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Check size={12} style={{ color: 'var(--success)' }} /> Closed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', padding: '2rem 0' }}>No admission enquiries have been submitted yet.</p>
            )}
          </div>
        )}

      </section>

      {/* 4. CRUD COLLEGE POPUP FORM MODAL */}
      {showCollegeModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content" style={{ maxWidth: '750px', background: 'var(--bg-surface)' }}>
            
            <button onClick={() => setShowCollegeModal(false)} className="modal-close">
              <X size={20} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-primary">{editingCollegeId ? 'Edit Profile' : 'Register New College'}</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {editingCollegeId ? 'Modify College Registry' : 'Add New College Profile'}
              </h3>
            </div>

            {formError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCollegeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* CORE DETAILS */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="input-label">University / College Name *</label>
                <input
                  type="text"
                  required
                  value={colName}
                  onChange={(e) => setColName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology, Bombay"
                  className="input-field"
                />
              </div>

              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">City *</label>
                  <input
                    type="text"
                    required
                    value={colCity}
                    onChange={(e) => setColCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="input-field"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">State *</label>
                  <input
                    type="text"
                    required
                    value={colState}
                    onChange={(e) => setColState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Established Year</label>
                  <input
                    type="number"
                    value={colEstablished}
                    onChange={(e) => setColEstablished(parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">NIRF Rank</label>
                  <input
                    type="number"
                    value={colNirf}
                    onChange={(e) => setColNirf(parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Institution Type</label>
                  <select
                    value={colType}
                    onChange={(e) => setColType(e.target.value)}
                    className="input-field"
                    style={{ background: '#121225' }}
                  >
                    <option value="Govt">Government (Govt)</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Average Annual Tuition Fee (INR)</label>
                  <input
                    type="number"
                    value={colFees}
                    onChange={(e) => setColFees(parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              {/* PLACEMENT STATS */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-hover)' }}>Placement Records</h4>
                
                <div className="form-grid">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Highest Package (LPA)</label>
                    <input
                      type="number"
                      value={colHighestPackage}
                      onChange={(e) => setColHighestPackage(parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Median Package (LPA)</label>
                    <input
                      type="number"
                      value={colMedianPackage}
                      onChange={(e) => setColMedianPackage(parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Placement Rate (%)</label>
                    <input
                      type="number"
                      value={colPlacementRate}
                      onChange={(e) => setColPlacementRate(parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Top Hiring Recruiter Companies (comma separated)</label>
                  <input
                    type="text"
                    value={colTopRecruiters}
                    onChange={(e) => setColTopRecruiters(e.target.value)}
                    placeholder="Google, Microsoft, Amazon, Tata"
                    className="input-field"
                  />
                </div>
              </div>

              {/* COURSE MANAGEMENT */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Manage Offered Courses</h4>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Course name (e.g. B.Tech Electrical)"
                    className="input-field"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    value={newCourseFees}
                    onChange={(e) => setNewCourseFees(parseInt(e.target.value))}
                    placeholder="Annual Fee"
                    className="input-field"
                    style={{ width: '130px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCourseToForm}
                    className="btn btn-secondary btn-sm"
                  >
                    Add
                  </button>
                </div>

                {/* Course List table preview */}
                {coursesInput.length > 0 ? (
                  <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                    <table className="custom-table" style={{ fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Course Name</th>
                          <th>Fees</th>
                          <th>Seats</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesInput.map((course, idx) => (
                          <tr key={idx}>
                            <td>{course.name}</td>
                            <td>₹{course.fees.toLocaleString()}/Yr</td>
                            <td>{course.seats} Seats</td>
                            <td>
                              <button
                                type="button"
                                onClick={() => handleRemoveCourseFromForm(idx)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No courses added. Please register at least one course.</span>
                )}
              </div>

              {/* OVERVIEW DESCRIPTION */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="input-label">University Description Overview</label>
                <textarea
                  value={colDescription}
                  onChange={(e) => setColDescription(e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Academic history, fests, fabled alumni network details..."
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Featured toggle */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={colFeatured}
                  onChange={(e) => setColFeatured(e.target.checked)}
                />
                <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>Feature this College on Landing Hero Screen</span>
              </label>

              {/* Form buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn btn-primary"
                  style={{ flex: 1, opacity: formSubmitting ? 0.7 : 1 }}
                >
                  {formSubmitting ? 'Saving College...' : 'Save College Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .admin-dashboard-grid {
            grid-template-columns: 1fr !important;
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
