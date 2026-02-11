import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#1E293B] rounded-lg overflow-hidden shadow-xl"
    >
      <div className="flex flex-col md:flex-row">
        {/* Poster Skeleton */}
        <div className="md:w-1/3 relative">
          <motion.div
            animate={{
              backgroundColor: ['#1E293B', '#334155', '#1E293B'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full min-h-[400px] bg-[#1E293B]"
          />
        </div>

        {/* Details Skeleton */}
        <div className="md:w-2/3 p-6 space-y-4">
          {/* Title Skeleton */}
          <div className="border-b border-[#F59E0B]/20 pb-4 space-y-3">
            <motion.div
              animate={{
                backgroundColor: ['#334155', '#475569', '#334155'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-10 bg-[#334155] rounded w-3/4"
            />
            <motion.div
              animate={{
                backgroundColor: ['#334155', '#475569', '#334155'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.1,
              }}
              className="h-5 bg-[#334155] rounded w-1/2"
            />
          </div>

          {/* Ratings Skeleton */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['#020617', '#1E293B', '#020617'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
                className="bg-[#020617] rounded-lg p-3 h-20"
              />
            ))}
          </div>

          {/* Info Lines Skeleton */}
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['#334155', '#475569', '#334155'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.15,
                }}
                className="h-5 bg-[#334155] rounded w-full"
              />
            ))}
          </div>

          {/* Plot Skeleton */}
          <motion.div
            animate={{
              backgroundColor: ['#334155', '#475569', '#334155'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            className="h-5 bg-[#334155] rounded w-1/3"
          />

          {/* Awards Skeleton */}
          <motion.div
            animate={{
              backgroundColor: ['#020617', '#1E293B', '#020617'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="bg-[#020617] rounded-lg h-16"
          />

          {/* Buttons Skeleton */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: ['#F59E0B', '#FCD34D', '#F59E0B'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
                className="flex-1 min-w-[150px] bg-[#F59E0B] h-12 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
