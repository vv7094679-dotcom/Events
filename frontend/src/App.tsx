import { Router, useRouter } from './router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetail from './pages/CollegeDetail';
import Admin from './pages/Admin';
import Compare from './pages/Compare';
import CompareFloatingBar from './components/CompareFloatingBar';

function AppContent() {
  const { path } = useRouter();

  // Route matching logic
  const renderPage = () => {
    switch (path) {
      case '/':
        return <Home />;
      case '/colleges':
        return <Colleges />;
      case '/colleges/:id':
        return <CollegeDetail />;
      case '/compare':
        return <Compare />;
      case '/admin':
        return <Admin />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>404 Page Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
              The page you are looking for doesn't exist or has been relocated.
            </p>
            <a href="#/" style={{ display: 'inline-block' }} className="btn btn-primary">
              Return Home Landing
            </a>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {renderPage()}
      </main>
      <CompareFloatingBar />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
