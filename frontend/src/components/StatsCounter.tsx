import { useEffect, useState } from 'react';

interface StatsCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function StatsCounter({ value, suffix = '', label, duration = 1200 }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value <= 0) {
      setCount(0);
      return;
    }
    let start = 0;
    // Cap steps to prevent freeze if value is huge
    const stepTime = Math.max(Math.floor(duration / Math.min(value, 60)), 15);
    const stepValue = Math.ceil(value / (duration / stepTime));

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= value) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  // Format count to display cleanly
  const displayVal = count.toLocaleString('en-IN');

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      flex: 1,
      minWidth: '150px',
      background: 'rgba(255, 255, 255, 0.02)'
    }}>
      <span style={{
        fontSize: '2.25rem',
        fontWeight: 800,
        color: '#ffffff',
        fontFamily: 'var(--mono)',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #ffffff, #c084fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {displayVal}{suffix}
      </span>
      <span style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        textAlign: 'center'
      }}>
        {label}
      </span>
    </div>
  );
}
