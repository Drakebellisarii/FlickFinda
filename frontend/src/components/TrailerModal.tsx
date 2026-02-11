import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  trailerUrl?: string;
}

export default function TrailerModal({ isOpen, onClose, movieTitle, trailerUrl }: TrailerModalProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !trailerUrl) {
      setVideoId(null);
      setIsLoading(true);
      return;
    }

    // Extract YouTube video ID from various URL formats
    const extractVideoId = (url: string): string | null => {
      // YouTube embed URL: https://www.youtube.com/embed/VIDEO_ID
      let match = url.match(/youtube\.com\/embed\/([^?&]+)/);
      if (match) return match[1];

      // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
      match = url.match(/youtube\.com\/watch\?v=([^&]+)/);
      if (match) return match[1];

      // YouTube short URL: https://youtu.be/VIDEO_ID
      match = url.match(/youtu\.be\/([^?&]+)/);
      if (match) return match[1];

      // If it's a YouTube search URL, we can't embed it directly
      if (url.includes('youtube.com/results')) {
        return null;
      }

      return null;
    };

    const id = extractVideoId(trailerUrl);
    setVideoId(id);
    setIsLoading(false);
  }, [isOpen, trailerUrl]);

  useEffect(() => {
    // Handle Escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Theater-style modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl glass-card-dark rounded-2xl overflow-hidden shadow-apple-lg"
          onClick={(e) => e.stopPropagation()}
          style={{
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 0 60px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Theater curtain effect - top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-retro-orange text-white hover:text-white transition-all hover:scale-110 backdrop-blur-sm border border-gold/30"
            aria-label="Close trailer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-cinema-navy-950 to-deep-blue border-b border-gold/30">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gold text-center">
              🎬 {movieTitle}
            </h2>
            <p className="text-center text-apple-gray-300 text-sm mt-1">Official Trailer</p>
          </div>

          {/* Video Player Container */}
          <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="animate-spin h-12 w-12 text-gold mx-auto mb-4"
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
                  <p className="text-apple-gray-300">Loading trailer...</p>
                </div>
              </div>
            )}

            {!isLoading && videoId ? (
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${movieTitle} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  border: '3px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.1)',
                }}
              />
            ) : (
              !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-cinema-navy-950">
                  <div className="text-center px-6">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-semibold text-gold mb-2">
                      Trailer Not Available
                    </h3>
                    <p className="text-apple-gray-400 mb-6">
                      We couldn't find an embeddable trailer for this movie.
                    </p>
                    {trailerUrl && (
                      <a
                        href={trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block btn-retro-orange font-semibold py-3 px-6 rounded-lg transition-all shadow-lg"
                      >
                        Search on YouTube
                      </a>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Theater curtain effect - bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
