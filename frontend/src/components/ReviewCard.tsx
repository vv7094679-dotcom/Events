import type { Review } from '../types';
import { Star, User } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s <= Math.round(rating) ? '#fbbf24' : 'transparent'}
            style={{ color: s <= Math.round(rating) ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
      {/* Review Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.15))',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-hover)'
          }}>
            <User size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>{review.author}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted on {review.date}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {renderStars(review.rating)}
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
        "{review.comment}"
      </p>

      {/* Sub Ratings Grid */}
      {review.subRatings && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.01)',
          borderRadius: '0.5rem',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}>
          {Object.entries(review.subRatings).map(([category, score]) => (
            <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span style={{ fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={10} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                {score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
