import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setShow(false), 500);
          setTimeout(onDone, 1000);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onDone]);

  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  const floatingPhotos = [
    'media/cutiee.jpeg',
    'media/cutiee1.jpeg',
    'media/photo.jpeg',
    'media/pink-blue.jpeg',
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0D0D2B 0%, #1A0A2E 40%, #2D1040 70%, #1A0A2E 100%)' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {/* Stars */}
          {stars.map(star => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              animate={{ opacity: [0.1, 1, 0.1], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: star.duration, delay: star.delay, repeat: Infinity }}
            />
          ))}

          {/* Floating photos in corners */}
          {floatingPhotos.map((src, i) => (
            <motion.div
              key={src}
              className="absolute w-20 h-24 md:w-28 md:h-36 polaroid opacity-60"
              style={{
                top: i < 2 ? '8%' : '70%',
                left: i % 2 === 0 ? '5%' : 'auto',
                right: i % 2 === 1 ? '5%' : 'auto',
                rotate: [-8, 6, -5, 7][i],
              }}
              animate={{ y: [-10, 10, -10], rotate: [[-8, 6, -5, 7][i] - 3, [-8, 6, -5, 7][i] + 3, [-8, 6, -5, 7][i] - 3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}

          {/* Main content */}
          <motion.div
            className="text-center z-10 px-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Sparkle emoji */}
            <motion.div
              className="text-5xl mb-6"
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.div>

            <h1
              className="text-3xl md:text-5xl font-display font-bold mb-3 glow-text"
              style={{ color: '#FFD6E0' }}
            >
              Collecting beautiful
            </h1>
            <h1
              className="text-3xl md:text-5xl font-display font-bold italic mb-8"
              style={{ color: '#FF8FAB' }}
            >
              memories ✨
            </h1>

            {/* Progress bar */}
            <div className="w-64 md:w-80 mx-auto h-1.5 rounded-full overflow-hidden mb-4"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF8FAB, #FFB347, #FF8FAB)', backgroundSize: '200% 100%' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <p className="text-sm font-body" style={{ color: 'rgba(255,214,224,0.6)' }}>
              {progress < 30 ? 'Dusting off memories...' :
               progress < 60 ? 'Stringing fairy lights...' :
               progress < 90 ? 'Almost ready ✨' :
               'Welcome to our universe 💕'}
            </p>
          </motion.div>

          {/* Floating hearts */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl select-none pointer-events-none"
              style={{ left: `${15 + i * 14}%`, bottom: '10%' }}
              animate={{ y: [0, -80, -160, -240], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3 + i * 0.5, delay: i * 0.8, repeat: Infinity }}
            >
              {['💕', '✨', '🌸', '💖', '⭐', '🎀'][i]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
