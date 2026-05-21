import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  {
    src: 'media/bullet-ride.mp4',
    title: 'Bullet Ride 🏍️',
    caption: 'Best ride ever 🏍️',
    desc: 'The wind in our hair, pure chaos and adrenaline',
    emoji: '🏍️',
    color: '#FF8FAB',
    glow: 'rgba(255,143,171,0.4)',
  },
  {
    src: 'media/reel-memory.mp4',
    title: 'Reel Memory 🎬',
    caption: 'Unforgettable moments ❤️',
    desc: 'Every frame is a memory we will cherish forever',
    emoji: '🎬',
    color: '#FFB347',
    glow: 'rgba(255,179,71,0.4)',
  },
  {
    src: 'media/snap-memory.mp4',
    title: 'Snap Memory 📸',
    caption: 'Chaos + happiness 😂',
    desc: 'Candid, raw, real — this is us in our element',
    emoji: '📸',
    color: '#DBC4F0',
    glow: 'rgba(219,196,240,0.4)',
  },
];

export default function VideoTheater() {
  const [playing, setPlaying] = useState(null);
  const hoverRefs = useRef([]);

  const handleCardHover = (idx, enter) => {
    const vid = hoverRefs.current[idx];
    if (!vid) return;
    if (enter) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  };

  return (
    <section
      id="videos"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #100520 50%, #0A0A1A 100%)' }}
    >
      {/* Animated background lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {videos.map((v, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: '400px',
              height: '400px',
              background: `radial-gradient(circle, ${v.color}, transparent)`,
              filter: 'blur(80px)',
              left: `${15 + i * 30}%`,
              top: '30%',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.06, 0.14, 0.06],
            }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.5 }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-16 px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#FFB347' }}>🎬 cinematic moments</p>
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}
        >
          Video Theater
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Hover to preview · Click to watch fullscreen 🎥
        </p>
      </motion.div>

      {/* Video cards — Netflix style */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {videos.map((video, i) => (
          <motion.div
            key={i}
            className="netflix-card relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{
              border: `1px solid ${video.color}30`,
              background: '#0D0D1A',
            }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            onMouseEnter={() => handleCardHover(i, true)}
            onMouseLeave={() => handleCardHover(i, false)}
            onClick={() => setPlaying(video)}
            whileHover={{
              boxShadow: `0 20px 60px ${video.glow}, 0 0 30px ${video.color}20`,
            }}
          >
            {/* Video preview */}
            <div className="relative aspect-video overflow-hidden">
              <video
                ref={el => hoverRefs.current[i] = el}
                src={video.src}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ transition: 'transform 0.5s ease' }}
              />

              {/* Play overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-400"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `${video.color}30`,
                    border: `2px solid ${video.color}60`,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={video.color}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>

              {/* Glow top edge */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, ${video.color}, transparent)` }}
              />
            </div>

            {/* Card info */}
            <div className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{video.emoji}</span>
                <h3 className="font-display font-bold text-lg" style={{ color: video.color }}>
                  {video.title}
                </h3>
              </div>
              <p className="font-body text-sm mb-1" style={{ color: '#FFD6E0' }}>
                {video.caption}
              </p>
              <p className="font-body text-xs" style={{ color: 'rgba(255,214,224,0.5)' }}>
                {video.desc}
              </p>

              {/* Watch button */}
              <motion.div
                className="mt-4 flex items-center gap-2 text-xs font-body font-bold"
                style={{ color: video.color }}
                whileHover={{ x: 4 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={video.color}>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Watch fullscreen
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setPlaying(null)}
                className="absolute -top-12 right-0 text-white font-body text-sm flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                ✕ Close
              </button>

              {/* Caption */}
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{playing.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-xl" style={{ color: playing.color }}>
                    {playing.title}
                  </h3>
                  <p className="font-body text-sm" style={{ color: 'rgba(255,214,224,0.7)' }}>
                    {playing.caption}
                  </p>
                </div>
              </div>

              {/* Video */}
              <div className="rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 60px ${playing.glow}` }}>
                <video
                  src={playing.src}
                  controls
                  autoPlay
                  className="w-full"
                  style={{ maxHeight: '70vh', background: '#000' }}
                />
              </div>

              {/* Glow border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: `1px solid ${playing.color}40` }}
              />

              {/* Floating caption */}
              <div className="mt-4 text-center">
                <p className="font-cursive text-xl" style={{ color: playing.color }}>
                  {playing.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fireflies */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 6}s`,
            '--dx': `${(Math.random() - 0.5) * 200}px`,
            '--dy': `${(Math.random() - 0.5) * 200}px`,
          }}
        />
      ))}
    </section>
  );
}
