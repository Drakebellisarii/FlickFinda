import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import ErrorMessage from '../components/ErrorMessage';
import { apiService } from '../api';
import type { WatchlistItem } from '../types';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await apiService.getWatchlist();
      setWatchlist(items);
    } catch (err: any) {
      setError(err.message || err.error || 'Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    setRemovingId(id);
    setError(null);

    try {
      await apiService.removeFromWatchlist(id);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || err.error || 'Failed to remove from watchlist');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 content-layer"
      >
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-gold mb-4 drop-shadow-lg">
            My Watchlist
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 font-medium">
            Movies you want to watch later
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <ErrorMessage error={error} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg
                className="animate-spin h-16 w-16 text-gold mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-800 text-lg font-medium">Loading your watchlist...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && watchlist.length === 0 && !error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">📋</div>
            <h2 className="text-3xl font-playfair font-bold text-royal-blue-900 mb-4">
              Your Watchlist is Empty
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Start adding movies you want to watch!
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block btn-blue-gradient font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
            >
              Discover Movies
            </motion.a>
          </motion.div>
        )}

        {/* Watchlist Grid */}
        {!loading && watchlist.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6"
          >
            {watchlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-gold-glow transition-all relative group"
              >
                {/* Movie Poster */}
                <div className="relative">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-[400px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Glassmorphism overlay on hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-300" />
                </div>

                {/* Movie Info - Glass card overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 glass-card border-t-2 border-gold/30">
                  <h3 className="text-base sm:text-lg md:text-xl font-playfair font-bold text-royal-blue-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4">
                    Added {new Date(item.added_date).toLocaleDateString()}
                  </p>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm min-h-[44px] shadow-lg"
                  >
                    {removingId === item.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Removing...
                      </span>
                    ) : (
                      '🗑️ Remove'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Item Count */}
        {!loading && watchlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-8 text-gray-700 font-medium"
          >
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} in your watchlist
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
