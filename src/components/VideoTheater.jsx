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
    thumb: 'media/pink-blue.jpeg',
  },
  {
    src: 'media/reel-memory.mp4',
    title: 'Reel Memory 🎬',
    caption: 'Unforgettable moments ❤️',
    desc: 'Every frame is a memory we will cherish forever',
    emoji: '🎬',
    color: '#FFB347',
    glow: 'rgba(255,179,71,0.4)',
    thumb: 'media/cutiee.jpeg',
  },
  {
    src: 'media/snap-memory.mp4',
    title: 'Snap Memory 📸',
    caption: 'Chaos + happiness 😂',
    desc: 'Candid, raw, real — this is us in our element',
    emoji: '📸',
    color: '#DBC4F0',
    glow: 'rgba(219,196,240,0.4)',
    thumb: 'media/cutiee1.jpeg',
  },
];

const isMobile = window.innerWidth < 768;

export default function VideoTheater() {
  const [playing, setPlaying] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const hoverRefs = useRef([]);

  const handleEnter = (i) => {
    if (isMobile) return;
    setHoveredIdx(i);
    const vid = hoverRefs.current[i];
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
  };

  const handleLeave = (i) => {
    if (isMobile) return;
    setHoveredIdx(null);
    const vid = hoverRefs.current[i];
    if (vid) { vid.pause(); vid.currentTime = 0; }
  };

  return (
    <section
      id="videos"
      className="relative py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #100520 50%, #0A0A1A 100%)' }}
    >
      {/* Static background — no animated blur orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-8 hidden md:block"
          style={{ background: 'radial-gradient(circle, #FF8FAB, transparent)', filter: 'blur(70px)' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full opacity-8 hidden md:block"
          style={{ background: 'radial-gradient(circle, #DBC4F0, transparent)', filter: 'blur(70px)' }} />
      </div>

      {/* Header */}
      <motion.div
        className="text-center mb-12 px-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#FFB347' }}>🎬 cinematic moments</p>
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}>
          Video Theater
        </h2>
        <p className="font-body mt-2 text-sm" style={{ color: 'rgba(255,214,224,0.5)' }}>
          {isMobile ? 'Tap to watch 🎥' : 'Hover to preview · Click to watch fullscreen 🎥'}
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {videos.map((video, i) => (
          <motion.div
            key={i}
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{ border: `1px solid ${video.color}25`, background: '#0D0D1A' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            onClick={() => setPlaying(video)}
            whileHover={{ y: -6, boxShadow: `0 16px 40px ${video.glow}` }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Thumbnail — always visible, covers video on mobile */}
            <div className="relative aspect-video overflow-hidden bg-black">
              {/* Static thumbnail image */}
              <img
                src={video.thumb}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: hoveredIdx === i ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
                loading="lazy"
              />

              {/* Video — desktop only, preload="none" so no auto-download */}
              {!isMobile && (
                <video
                  ref={el => hoverRefs.current[i] = el}
                  src={video.src}
                  muted loop playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: hoveredIdx === i ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}

              {/* Play button overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  opacity: hoveredIdx === i ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${video.color}25`, border: `2px solid ${video.color}70` }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={video.color}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </div>

              {/* Color top bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${video.color}, transparent)` }} />
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{video.emoji}</span>
                <h3 className="font-display font-bold text-base" style={{ color: video.color }}>{video.title}</h3>
              </div>
              <p className="font-body text-sm" style={{ color: 'rgba(255,214,224,0.7)' }}>{video.caption}</p>
              <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,214,224,0.4)' }}>{video.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.96)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPlaying(null)}
                className="absolute -top-10 right-0 font-body text-sm"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                ✕ Close
              </button>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{playing.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-lg" style={{ color: playing.color }}>{playing.title}</h3>
                  <p className="font-body text-xs" style={{ color: 'rgba(255,214,224,0.6)' }}>{playing.caption}</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden"
                style={{ boxShadow: `0 0 40px ${playing.glow}` }}>
                <video
                  src={playing.src}
                  controls autoPlay playsInline
                  preload="auto"
                  className="w-full"
                  style={{ maxHeight: '72vh', background: '#000', display: 'block' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
