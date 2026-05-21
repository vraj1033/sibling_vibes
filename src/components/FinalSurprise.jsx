import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
  'media/cutiee.jpeg',
  'media/cutiee1.jpeg',
  'media/photo.jpeg',
  'media/pink-blue.jpeg',
];

const WORDS = [
  'No matter where',
  'life takes us…',
  '',
  'these moments',
  'stay forever',
  '❤️',
];

export default function FinalSurprise() {
  const [current, setCurrent] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(i => (i + 1) % IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wordIndex >= WORDS.length) {
      setTimeout(() => setShowBtn(true), 500);
      return;
    }
    const t = setTimeout(() => setWordIndex(i => i + 1), wordIndex === 0 ? 800 : 600);
    return () => clearTimeout(t);
  }, [wordIndex]);

  const replay = () => {
    setWordIndex(0);
    setShowBtn(false);
    setTimeout(() => setWordIndex(1), 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="finale"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0A0A14' }}
    >
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.3) saturate(1.2)' }}
            />
          </motion.div>
        ))}

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Color overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(255,143,171,0.1) 0%, rgba(255,179,71,0.05) 50%, rgba(219,196,240,0.1) 100%)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#FF8FAB', '#FFB347', '#DBC4F0', '#FFD6E0', '#FFF8F0'][Math.floor(Math.random() * 5)],
            }}
            animate={{
              y: [-20, -80, -140],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Floating emojis */}
        {['💕', '✨', '❤️', '🌸', '💖', '⭐', '🎀', '🌙'].map((emoji, i) => (
          <motion.div
            key={emoji}
            className="absolute text-2xl select-none"
            style={{ left: `${10 + i * 11}%` }}
            animate={{ y: ['100vh', '-20vh'], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 8 + Math.random() * 6,
              delay: i * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Words */}
        <div className="mb-12" style={{ minHeight: '200px' }}>
          {WORDS.slice(0, wordIndex).map((word, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {word === '' ? (
                <div style={{ height: '1.5rem' }} />
              ) : word === '❤️' ? (
                <motion.span
                  className="text-5xl block mt-2"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {word}
                </motion.span>
              ) : (
                <span
                  className="font-display font-bold block"
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    color: i % 3 === 0 ? '#FFD6E0' : i % 3 === 1 ? '#FF8FAB' : '#FFB347',
                    textShadow: '0 0 30px rgba(255,143,171,0.4)',
                    lineHeight: 1.2,
                  }}
                >
                  {word}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        {wordIndex >= WORDS.length && (
          <motion.p
            className="font-cursive text-xl mb-8"
            style={{ color: 'rgba(255,214,224,0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Sibling Vibes — forever and always ✨
          </motion.p>
        )}

        {/* Replay button */}
        {showBtn && (
          <motion.button
            onClick={replay}
            className="btn-glow font-body font-bold text-lg px-10 py-4 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #FF8FAB 0%, #FFB347 100%)',
              color: '#0D0D1A',
              border: 'none',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Replay Memories ✨
          </motion.button>
        )}

        {/* Image thumbnails */}
        <div className="flex justify-center gap-3 mt-10">
          {IMAGES.map((src, i) => (
            <motion.div
              key={src}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{
                width: '48px',
                height: '48px',
                border: `2px solid ${i === current ? '#FF8FAB' : 'rgba(255,255,255,0.2)'}`,
                boxShadow: i === current ? '0 0 12px rgba(255,143,171,0.6)' : 'none',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setCurrent(i)}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(255,143,171,0.12) 0%, transparent 70%)',
            top: '20%',
            left: '10%',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,179,71,0.1) 0%, transparent 70%)',
            bottom: '20%',
            right: '10%',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Section label */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <p className="font-cursive text-sm" style={{ color: 'rgba(255,214,224,0.4)' }}>
          ✨ the end · the beginning ✨
        </p>
      </div>
    </section>
  );
}
