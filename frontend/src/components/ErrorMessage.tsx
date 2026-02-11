import { motion } from 'framer-motion';

interface ErrorMessageProps {
  error?: string;
  message?: string;
}

export default function ErrorMessage({ error, message }: ErrorMessageProps) {
  const displayMessage = message || error || 'An error occurred';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card rounded-lg p-6 shadow-card max-w-2xl mx-auto border-2 border-gold/30"
    >
      <div className="flex items-start gap-4">
        {/* Warning Icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-8 h-8 text-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Content */}
        <div className="flex-1">
          <h3 className="text-xl font-playfair font-bold text-royal-blue-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {displayMessage}
          </p>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-1 bg-gradient-to-r from-gold to-gold-light rounded-full mt-4"
      />
    </motion.div>
  );
}
