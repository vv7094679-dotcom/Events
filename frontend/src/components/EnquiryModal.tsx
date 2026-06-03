import { useState, type FormEvent } from 'react';
import type { College } from '../types';
import { submitEnquiry } from '../api';
import { X, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface EnquiryModalProps {
  college: College;
  onClose: () => void;
}

export default function EnquiryModal({ college, onClose }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('12th Standard');
  const [score, setScore] = useState('');
  const [course, setCourse] = useState(college.courses[0]?.name || '');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !course) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitEnquiry({
        collegeId: college.id,
        name,
        email,
        phone,
        qualification,
        score,
        course,
        message
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '1rem',
              borderRadius: '50%',
              display: 'flex',
              color: 'var(--success)'
            }}>
              <CheckCircle size={48} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Enquiry Submitted!</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              Your application/enquiry has been sent to <strong>{college.name}</strong>. The admissions representative will contact you shortly.
            </p>
            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{ marginTop: '1.5rem', width: '100%', maxWidth: '200px' }}
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Admissions Enquiry</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Apply / Ask a Question</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                to <strong>{college.name}</strong>
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#fca5a5',
                marginBottom: '1.25rem',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Form Grid */}
              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Highest Qualification *</label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="input-field"
                    style={{ background: '#121225' }}
                  >
                    <option value="10th Standard">10th Standard</option>
                    <option value="12th Standard">12th Standard</option>
                    <option value="Undergraduate">Undergraduate Degree</option>
                    <option value="Postgraduate">Postgraduate Degree</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Academic Score (e.g. 92% or 8.5 CGPA)</label>
                  <input
                    type="text"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="input-field"
                    placeholder="GPA / Percentage / Rank"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Preferred Course *</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="input-field"
                    style={{ background: '#121225' }}
                  >
                    {college.courses?.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    )) || <option value="">No courses available</option>}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="input-label">Message / Cover Note</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Tell the admissions panel about yourself, questions about scholarships, hostel, etc..."
                  style={{ resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  pointerEvents: loading ? 'none' : 'auto',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="spin-animation" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Application Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
