import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/watchlist', label: 'Watchlist', icon: '📋' },
    { path: '/ratings', label: 'Ratings', icon: '⭐' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-[#020617] border-b-2 border-[#F59E0B] shadow-lg backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="text-3xl">🎬</div>
              <div>
                <h1 className="text-2xl font-['Playfair_Display'] font-bold text-[#F59E0B]">
                  FlickFinda
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Your Movie Companion</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-[#F59E0B] text-[#020617]'
                      : 'text-gray-300 hover:text-[#F59E0B] hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </motion.div>
              </Link>
            ))}

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : '🚪 Logout'}
            </motion.button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-[#F59E0B] p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`block px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-[#F59E0B] text-[#020617]'
                      : 'text-gray-300 hover:text-[#F59E0B] hover:bg-[#1E293B]'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </motion.div>
              </Link>
            ))}

            {/* Mobile Logout Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? 'Logging out...' : '🚪 Logout'}
            </motion.button>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
