import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import MovieCard from '../components/MovieCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { apiService } from '../api';
import type { Movie, ApiError } from '../types';

const STREAMING_SERVICES = [
  'All',
  'Netflix',
  'Hulu',
  'Disney+',
  'Prime Video',
  'HBO Max',
];

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Random'];

export default function HomePage() {
  const [description, setDescription] = useState('');
  const [streamingService, setStreamingService] = useState('All');
  const [numTitles, setNumTitles] = useState(3);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!description.trim()) {
      setError('Please enter a movie description');
      return;
    }

    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      const response = await apiService.getMovieSuggestion({
        description: description.trim(),
        num_titles: numTitles,
        streaming_service: streamingService,
      });

      // Handle different response formats from API
      if ('movies' in response) {
        setMovies(response.movies);
      } else if (Array.isArray(response)) {
        setMovies(response);
      } else if ('title' in response) {
        setMovies([response as Movie]);
      } else {
        setError('Unexpected response format from server');
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || apiError.error || 'Failed to get movie suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = async (genre: string) => {
    setLoading(true);
    setError(null);
    setMovies([]);

    try {
      const response = await apiService.getRandomMovie(genre);
      
      // The random movie endpoint returns a movie title string
      // We need to search for it to get full details
      if (response.movie) {
        const movieResponse = await apiService.getMovieSuggestion({
          description: response.movie,
          num_titles: 1,
          streaming_service: 'All',
        });

        if ('movies' in movieResponse) {
          setMovies(movieResponse.movies);
        } else if ('title' in movieResponse) {
          setMovies([movieResponse as Movie]);
        }
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || apiError.error || 'Failed to get random movie');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGetSuggestions();
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
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-[#F59E0B] mb-4">
            Discover Your Next Favorite Film
          </h1>
          <p className="text-xl text-gray-300">
            AI-powered movie suggestions tailored just for you
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#1E293B] rounded-xl shadow-2xl p-6 md:p-8 mb-8"
        >
          <div className="space-y-6">
            {/* Description Input */}
            <div>
              <label className="block text-[#F59E0B] font-semibold mb-2 text-lg">
                What kind of movie are you looking for?
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., A thrilling sci-fi adventure with time travel..."
                className="w-full bg-[#020617] text-white rounded-lg p-4 border-2 border-gray-600 focus:border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Streaming Service */}
              <div>
                <label className="block text-[#F59E0B] font-semibold mb-2">
                  Streaming Service
                </label>
                <select
                  value={streamingService}
                  onChange={(e) => setStreamingService(e.target.value)}
                  className="w-full bg-[#020617] text-white rounded-lg p-3 border-2 border-gray-600 focus:border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 transition-all cursor-pointer"
                >
                  {STREAMING_SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Titles */}
              <div>
                <label className="block text-[#F59E0B] font-semibold mb-2">
                  Number of Suggestions
                </label>
                <select
                  value={numTitles}
                  onChange={(e) => setNumTitles(Number(e.target.value))}
                  className="w-full bg-[#020617] text-white rounded-lg p-3 border-2 border-gray-600 focus:border-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50 transition-all cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'movie' : 'movies'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Get Suggestions Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetSuggestions}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] hover:from-[#FCD34D] hover:to-[#F59E0B] text-[#020617] font-bold py-4 px-8 rounded-lg text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Loading Suggestions...
                </span>
              ) : (
                '🎬 Get Suggestions'
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Genre Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-white mb-4 text-center">
            Or pick a random movie by genre
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {GENRES.map((genre) => (
              <motion.button
                key={genre}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGenreClick(genre)}
                disabled={loading}
                className="bg-[#1E293B] hover:bg-[#F59E0B] text-white hover:text-[#020617] font-semibold py-3 px-6 rounded-lg border-2 border-[#F59E0B] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {genre}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <ErrorMessage error={error} />
          </div>
        )}

        {/* Results Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          {loading && (
            <>
              {Array.from({ length: numTitles }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </>
          )}

          {!loading && movies.length > 0 && (
            <>
              <h2 className="text-3xl font-['Playfair_Display'] font-bold text-[#F59E0B] mb-6">
                Your Suggestions
              </h2>
              {movies.map((movie, index) => (
                <MovieCard key={`${movie.title}-${index}`} movie={movie} />
              ))}
            </>
          )}

          {!loading && !error && movies.length === 0 && description && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No results found. Try a different description or genre.
              </p>
            </div>
          )}
        </motion.div>
      </motion.main>
    </div>
  );
}
