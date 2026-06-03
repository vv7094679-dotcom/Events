import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ initialValue = '', onSearch, placeholder = 'Search colleges, cities, states, courses...' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      width: '100%',
      position: 'relative',
      maxWidth: '650px',
      margin: '0 auto'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(18, 18, 35, 0.45)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: '1rem',
        padding: '0.25rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
        transition: 'all var(--transition-fast)'
      }} className="search-bar-container">
        
        <div style={{
          paddingLeft: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Search size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '0.8rem 1rem',
            color: '#ffffff',
            fontSize: '1rem',
          }}
        />

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
          }}
        >
          Search
        </button>
      </div>

      <style>{`
        .search-bar-container:focus-within {
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.25);
        }
      `}</style>
    </form>
  );
}
