import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
  { src: 'media/cutiee.jpeg', caption: 'Main character energy ✨', emoji: '👑', rotate: -6, x: -10 },
  { src: 'media/cutiee1.jpeg', caption: 'Best vibes ever ❤️', emoji: '💕', rotate: 4, x: 10 },
  { src: 'media/photo.jpeg', caption: 'Core memory unlocked 😭', emoji: '🌸', rotate: -3, x: -5 },
  { src: 'media/pink-blue.jpeg', caption: 'This sunset felt unreal 🌅', emoji: '🌅', rotate: 7, x: 15 },
];

export default function PolaroidWall({ showToast }) {
  const [selected, setSelected] = useState(null);
  const [hearts, setHearts] = useState([]);

  const spawnHearts = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
      emoji: ['💕', '💖', '❤️', '🌸', '✨'][Math.floor(Math.random() * 5)],
    }));
    setHearts(h => [...h, ...newHearts]);
    setTimeout(() => setHearts(h => h.filter(h2 => !newHearts.find(n => n.id === h2.id))), 2000);
  };

  return (
    <section
      id="polaroid"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A0830 0%, #2A1040 50%, #1A0830 100%)' }}
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#FFD6E0' }}>📸 click to open</p>
        <h2
          className="font-display font-bold glow-text"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}
        >
          Memory Wall
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Every photo holds a million feelings 💕
        </p>
      </motion.div>

      {/* Polaroid grid */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 px-6 max-w-5xl mx-auto">
        {photos.map((photo, i) => (
          <motion.div
            key={i}
            className="relative cursor-pointer group"
            style={{ transform: `rotate(${photo.rotate}deg)` }}
            initial={{ opacity: 0, y: 80, rotate: photo.rotate }}
            whileInView={{ opacity: 1, y: 0, rotate: photo.rotate }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15, type: 'spring', bounce: 0.3 }}
            whileHover={{
              scale: 1.08,
              rotate: 0,
              zIndex: 10,
              y: -12,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { setSelected(photo); spawnHearts(e); }}
          >
            {/* String */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-12 w-px"
              style={{ height: '48px', background: 'linear-gradient(180deg, transparent, rgba(255,214,224,0.4))' }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 -top-2 w-2 h-2 rounded-full"
              style={{ background: '#FFD6E0', boxShadow: '0 0 6px rgba(255,214,224,0.6)' }}
            />

            {/* Polaroid frame */}
            <motion.div
              className="polaroid relative"
              style={{ width: '180px', background: 'white' }}
              animate={{ rotate: [photo.rotate - 1, photo.rotate + 1, photo.rotate - 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Shine effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
                  borderRadius: '2px',
                }}
              />

              {/* Photo */}
              <div className="overflow-hidden" style={{ height: '180px' }}>
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Caption area */}
              <div className="flex flex-col items-center justify-center" style={{ height: '52px', padding: '4px' }}>
                <span className="text-base">{photo.emoji}</span>
                <span
                  className="font-cursive text-xs text-center leading-tight"
                  style={{ color: '#6B4226', fontSize: '9px' }}
                >
                  {photo.caption}
                </span>
              </div>
            </motion.div>

            {/* Shadow */}
            <div
              className="absolute -bottom-2 left-2 right-2 h-4 rounded-full opacity-40"
              style={{ background: 'rgba(0,0,0,0.3)', filter: 'blur(8px)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating hearts on click */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="fixed text-2xl pointer-events-none"
          style={{ left: heart.x, top: heart.y, zIndex: 9999 }}
          initial={{ opacity: 1, scale: 0, y: 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -100 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {heart.emoji}
        </motion.div>
      ))}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="polaroid relative max-w-sm w-full"
              style={{ background: 'white' }}
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.caption}
                className="w-full object-cover rounded"
                style={{ maxHeight: '60vh' }}
              />
              <div className="flex flex-col items-center py-4 gap-1">
                <span className="text-3xl">{selected.emoji}</span>
                <p className="font-cursive text-lg text-center" style={{ color: '#6B4226' }}>
                  {selected.caption}
                </p>
                <p className="font-body text-xs mt-1" style={{ color: '#C4A882' }}>
                  click anywhere to close
                </p>
              </div>

              {/* Floating hearts in lightbox */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-xl pointer-events-none"
                  style={{ left: `${10 + i * 10}%`, bottom: '10%' }}
                  animate={{ y: [0, -60, -120], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                >
                  {['💕', '❤️', '🌸', '✨', '💖', '🎀', '⭐', '💗'][i]}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background floating elements */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl opacity-10 pointer-events-none select-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        >
          {['📷', '🌸', '💕', '✨', '🎀'][i % 5]}
        </div>
      ))}
    </section>
  );
}
