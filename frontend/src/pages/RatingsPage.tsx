import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import ErrorMessage from '../components/ErrorMessage';
import { apiService } from '../api';
import type { RatingItem } from '../types';

export default function RatingsPage() {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<RatingItem | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editReview, setEditReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await apiService.getWatchedMovies();
      setRatings(items);
    } catch (err: any) {
      setError(err.message || err.error || 'Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);

    try {
      await apiService.deleteRating(id);
      setRatings((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || err.error || 'Failed to delete rating');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (item: RatingItem) => {
    setEditingItem(item);
    setEditRating(item.rating);
    setEditReview(item.review);
  };

  const handleEditSubmit = async () => {
    if (!editingItem) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await apiService.updateRating(editingItem.id, editRating, editReview);
      setRatings((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, rating: editRating, review: editReview }
            : item
        )
      );
      setEditingItem(null);
    } catch (err: any) {
      setError(err.message || err.error || 'Failed to update rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < rating ? 'text-gold' : 'text-gray-400'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
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
            My Ratings
          </h1>
          <p className="text-lg sm:text-xl text-gray-800 font-medium">
            Movies you've watched and rated
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
              <p className="text-gray-800 text-lg font-medium">Loading your ratings...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && ratings.length === 0 && !error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">⭐</div>
            <h2 className="text-3xl font-playfair font-bold text-royal-blue-900 mb-4">
              No Ratings Yet
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Start watching and rating movies!
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

        {/* Ratings Grid */}
        {!loading && ratings.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {ratings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card rounded-lg overflow-hidden shadow-card hover:shadow-gold-glow transition-all"
              >
                <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0 w-20 sm:w-24 md:w-32">
                    <img
                      src={item.poster_url}
                      alt={item.title}
                      className="w-full h-28 sm:h-36 md:h-48 object-cover rounded-lg border-2 border-gold/20"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/150x225?text=No+Poster';
                      }}
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-playfair font-bold text-royal-blue-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Rating Stars */}
                    <div className="mb-2">{renderStars(item.rating)}</div>
                    <p className="text-gold font-semibold text-sm mb-2">
                      {item.rating}/10
                    </p>

                    {/* Review */}
                    {item.review && (
                      <p className="text-gray-700 text-sm mb-2 line-clamp-3">
                        "{item.review}"
                      </p>
                    )}

                    {item.added_date && (
                      <p className="text-gray-600 text-xs mb-3">
                        Watched {new Date(item.added_date).toLocaleDateString()}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditClick(item)}
                        className="flex-1 min-w-[80px] btn-blue-gradient font-semibold py-2 px-3 rounded-lg text-xs sm:text-sm transition-all min-h-[44px]"
                      >
                        ✏️ Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 min-w-[80px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-3 rounded-lg text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] shadow-lg"
                      >
                        {deletingId === item.id ? (
                          <span className="flex items-center justify-center gap-1">
                            <svg
                              className="animate-spin h-3 w-3"
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
                            Deleting...
                          </span>
                        ) : (
                          '🗑️ Delete'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Item Count */}
        {!loading && ratings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-8 text-gray-700 font-medium"
          >
            {ratings.length} {ratings.length === 1 ? 'movie' : 'movies'} rated
          </motion.div>
        )}
      </motion.main>

      {/* Edit Modal */}
      {editingItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEditingItem(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-lg p-6 max-w-md w-full shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-playfair font-bold text-royal-blue-900 mb-4">
              Edit Rating for {editingItem.title}
            </h3>

            <div className="space-y-4">
              {/* Rating Slider */}
              <div>
                <label className="block text-royal-blue-900 font-semibold mb-2">
                  Rating: {editRating}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
                <div className="mt-2">{renderStars(editRating)}</div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-royal-blue-900 font-semibold mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={editReview}
                  onChange={(e) => setEditReview(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white/80 text-gray-900 placeholder-gray-500 rounded-lg p-3 min-h-[100px] border-2 border-gray-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  className="flex-1 btn-blue-gradient font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
