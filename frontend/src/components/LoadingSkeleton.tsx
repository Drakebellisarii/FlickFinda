import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-lg overflow-hidden shadow-card"
    >
      <div className="flex flex-col md:flex-row">
        {/* Poster Skeleton */}
        <div className="md:w-1/3 relative">
          <motion.div
            animate={{
              backgroundColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full min-h-[400px] bg-white/30"
          />
        </div>

        {/* Details Skeleton */}
        <div className="md:w-2/3 p-6 space-y-4">
          {/* Title Skeleton */}
          <div className="border-b border-gold/20 pb-4 space-y-3">
            <motion.div
              animate={{
                backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-10 bg-white/40 rounded w-3/4"
            />
            <motion.div
              animate={{
                backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
              className="h-5 bg-white/40 rounded w-1/2"
            />
          </div>

          {/* Ratings Skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
                className="bg-white/30 rounded-lg p-3 h-20 border border-gold/10"
              />
            ))}
          </div>

          {/* Info Lines Skeleton */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
                className="h-5 bg-white/40 rounded w-full"
              />
            ))}
          </div>

          {/* Plot Skeleton */}
          <motion.div
            animate={{
              backgroundColor: ['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            className="h-5 bg-white/40 rounded w-1/3"
          />

          {/* Awards Skeleton */}
          <motion.div
            animate={{
              backgroundColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="bg-white/30 rounded-lg h-16 border border-gold/10"
          />

          {/* Buttons Skeleton */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['rgba(30,58,138,0.5)', 'rgba(30,58,138,0.7)', 'rgba(30,58,138,0.5)'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
                className="flex-1 min-w-[150px] bg-royal-blue-500/50 h-12 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
