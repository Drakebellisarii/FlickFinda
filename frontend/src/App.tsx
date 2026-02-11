import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { CurtainTransition } from './components';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import RatingsPage from './pages/RatingsPage';

function App() {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cinema-gradient flex items-center justify-center">
        <div className="text-cinema-navy text-2xl font-playfair animate-pulse">
          FlickFinda
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login (Flask will handle this)
  if (!authenticated) {
    window.location.href = '/login';
    return null;
  }

  return (
    <Router>
      <CurtainTransition />
      <div className="min-h-screen bg-animated-gradient">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/ratings" element={<RatingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

