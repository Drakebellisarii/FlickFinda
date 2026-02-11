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
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E293B]">
      <Header />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-[#F59E0B] mb-4">
            My Watchlist
          </h1>
          <p className="text-xl text-gray-300">
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
                className="animate-spin h-16 w-16 text-[#F59E0B] mx-auto mb-4"
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
              <p className="text-gray-300 text-lg">Loading your watchlist...</p>
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
            <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
              Your Watchlist is Empty
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Start adding movies you want to watch!
            </p>
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#F59E0B] text-[#020617] font-bold py-3 px-8 rounded-lg transition-all"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {watchlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-[#1E293B] rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent" />
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Added {new Date(item.added_date).toLocaleDateString()}
                  </p>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      '🗑️ Remove from Watchlist'
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
            className="text-center mt-8 text-gray-400"
          >
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} in your watchlist
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
