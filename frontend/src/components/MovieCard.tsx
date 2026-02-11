import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Movie } from '../types';
import { apiService } from '../api';

interface MovieCardProps {
  movie: Movie;
  onWatchlistAdd?: () => void;
  onWatchedAdd?: () => void;
}

export default function MovieCard({ movie, onWatchlistAdd, onWatchedAdd }: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const [isMarkingWatched, setIsMarkingWatched] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddToWatchlist = async () => {
    setIsAddingToWatchlist(true);
    setMessage(null);
    try {
      const result = await apiService.addToWatchlist(movie.title, movie.poster);
      setMessage({ type: 'success', text: result.message || 'Added to watchlist!' });
      onWatchlistAdd?.();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to add to watchlist' });
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  const handleMarkAsWatched = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    setIsMarkingWatched(true);
    setMessage(null);
    try {
      const result = await apiService.addToWatched(movie.title, movie.poster, rating, review);
      setMessage({ type: 'success', text: result.message || 'Added to watched!' });
      setShowRatingModal(false);
      onWatchedAdd?.();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to mark as watched' });
    } finally {
      setIsMarkingWatched(false);
    }
  };

  const handleWatchTrailer = () => {
    if (movie.trailer_url) {
      window.open(movie.trailer_url, '_blank');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-lg overflow-hidden shadow-card hover:shadow-gold-glow transition-all duration-300"
      >
        <div className="flex flex-col md:flex-row">
          {/* Movie Poster */}
          <div className="md:w-1/3 relative">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover min-h-[400px]"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Poster';
              }}
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
          </div>

          {/* Movie Details */}
          <div className="md:w-2/3 p-6 space-y-4">
            {/* Title and Year */}
            <div className="border-b border-gold/20 pb-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-royal-blue-900 mb-2">
                {movie.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700">
                <span className="text-gold font-semibold">{movie.year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>{movie.genre}</span>
                <span>•</span>
                <span className="text-gray-600">{movie.released}</span>
              </div>
            </div>

            {/* Ratings */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center border border-gold/20 shadow-sm">
                <div className="text-xs text-gray-600 mb-1">IMDb</div>
                <div className="text-sm sm:text-lg font-bold text-gold">
                  {movie.ratings.imdb || 'N/A'}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center border border-gold/20 shadow-sm">
                <div className="text-xs text-gray-600 mb-1">RT</div>
                <div className="text-sm sm:text-lg font-bold text-gold">
                  {movie.ratings['rotten tomatoes'] || 'N/A'}
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-center border border-gold/20 shadow-sm">
                <div className="text-xs text-gray-600 mb-1">Meta</div>
                <div className="text-sm sm:text-lg font-bold text-gold">
                  {movie.ratings.metacritic || 'N/A'}
                </div>
              </div>
            </div>

            {/* Director and Actors */}
            <div className="space-y-2 text-sm sm:text-base">
              <div>
                <span className="text-royal-blue-900 font-semibold">Director: </span>
                <span className="text-gray-700">{movie.director}</span>
              </div>
              <div>
                <span className="text-royal-blue-900 font-semibold">Cast: </span>
                <span className="text-gray-700">{movie.actors}</span>
              </div>
            </div>

            {/* Plot/Reviews */}
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-royal-blue-900 font-semibold mb-2 hover:text-gold transition-colors text-sm sm:text-base"
              >
                {isExpanded ? '▼' : '▶'} Plot & Reviews
              </button>
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-gray-700 leading-relaxed">{movie.reviews}</p>
              </motion.div>
            </div>

            {/* Awards */}
            {movie.awards && movie.awards !== 'N/A' && (
              <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/30 rounded-lg p-3">
                <span className="text-gold font-semibold">🏆 Awards: </span>
                <span className="text-gray-800">{movie.awards}</span>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToWatchlist}
                disabled={isAddingToWatchlist}
                className="flex-1 min-w-[120px] btn-blue-gradient font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[44px]"
              >
                {isAddingToWatchlist ? 'Adding...' : '+ Watchlist'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAsWatched}
                className="flex-1 min-w-[120px] bg-white/80 hover:bg-gold text-royal-blue-900 hover:text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg border-2 border-royal-blue-300 hover:border-gold transition-all text-sm sm:text-base min-h-[44px] shadow-sm"
              >
                ✓ Mark as Watched
              </motion.button>
              {movie.trailer_url && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWatchTrailer}
                  className="flex-1 min-w-[120px] bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all text-sm sm:text-base min-h-[44px] shadow-md hover:shadow-gold-glow"
                >
                  🎬 Watch Trailer
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rating Modal */}
      {showRatingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowRatingModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-lg p-6 max-w-md w-full shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-playfair font-bold text-royal-blue-900 mb-4">
              Rate {movie.title}
            </h3>

            <div className="space-y-4">
              {/* Rating Slider */}
              <div>
                <label className="block text-royal-blue-900 font-semibold mb-2">
                  Rating: {rating}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-royal-blue-900 font-semibold mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white/80 text-gray-900 placeholder-gray-500 rounded-lg p-3 min-h-[100px] border-2 border-gray-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={isMarkingWatched}
                  className="flex-1 btn-blue-gradient font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMarkingWatched ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
