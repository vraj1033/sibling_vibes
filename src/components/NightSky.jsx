import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAR_NOTES = [
  { emoji: '💕', title: 'Always Together', note: 'No matter how far life takes us, this trip proves we find our way back to each other 💕' },
  { emoji: '😂', title: 'Laugh Factory', note: 'Honestly, we laughed so much my stomach still hurts. Best medicine ever.' },
  { emoji: '🌅', title: 'That Sunset', note: 'We both went quiet. No words needed. Just two siblings watching the world glow.' },
  { emoji: '🏍️', title: 'The Ride', note: 'Who was more scared? Neither of us will admit it. But we loved every second.' },
  { emoji: '🍜', title: 'The Food', note: 'Every single bite was a memory. We need to go back just for the food tbh.' },
  { emoji: '📸', title: '1000 Photos', note: 'We photographed everything. The mundane became magical because we were together.' },
  { emoji: '🌙', title: 'Late Nights', note: 'Staying up late, talking about everything and nothing. Pure sibling magic.' },
  { emoji: '💖', title: 'Thank You', note: 'Thank you for being my travel buddy, my best friend, my person. Forever. 💖' },
  { emoji: '✨', title: 'Core Memory', note: 'This trip is locked in my heart forever. Core memory: permanently installed.' },
  { emoji: '🎀', title: 'Best Sibling', note: "You make every adventure 10x better just by being you. Don't ever change. 🎀" },
  { emoji: '🌟', title: 'Next Trip?', note: "Where are we going next? Because this can't be our last adventure together..." },
  { emoji: '🫂', title: 'Big Hug', note: 'Sending the biggest virtual hug across whatever distance is between us right now 🫂' },
];

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
    hasNote: i < STAR_NOTES.length,
    note: STAR_NOTES[i] || null,
    brightness: Math.random() * 0.8 + 0.2,
  }));
}

export default function NightSky({ showToast }) {
  const [activeNote, setActiveNote] = useState(null);
  const [clickedStars, setClickedStars] = useState(new Set());
  const canvasRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  // Only run shooting stars canvas on desktop
  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const shootingStars = [];
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() > 0.98) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4,
          len: 80 + Math.random() * 100,
          speed: 9 + Math.random() * 8,
          alpha: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        });
      }
      shootingStars.forEach(s => {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
        ctx.restore();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.03;
      });
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (shootingStars[i].alpha <= 0) shootingStars.splice(i, 1);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  const handleStarClick = (star) => {
    if (!star.hasNote) return;
    setClickedStars(prev => new Set([...prev, star.id]));
    setActiveNote(star.note);
    showToast(`${star.note.emoji} ${star.note.title}`, star.note.emoji);
  };

  // Fewer stars on mobile = much faster
  const STARS = generateStars(isMobile ? 30 : 60);

  return (
    <section
      id="nightsky"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #020210 0%, #0D0D2B 30%, #1A0820 70%, #050510 100%)' }}
    >
      {!isMobile && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />}

      {/* Moon — CSS animation, no JS */}
      <div
        className="absolute top-16 right-8 md:right-16 w-16 h-16 md:w-24 md:h-24 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #FFF5D0, #FFE08A)',
          boxShadow: '0 0 40px rgba(255,220,150,0.4), 0 0 80px rgba(255,220,150,0.2)',
          animation: 'moonPulse 6s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-16 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#C4D8F0' }}>🌙 click the stars</p>
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}>
          Night Sky Secrets
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(196,216,240,0.6)' }}>
          Each glowing star holds a secret memory ⭐
        </p>
        <p className="font-body text-sm mt-1" style={{ color: 'rgba(196,216,240,0.4)' }}>
          {clickedStars.size}/{STAR_NOTES.length} stars discovered
        </p>
      </motion.div>

      {/* Star field — CSS twinkle for background stars, framer only for clickable */}
      <div className="relative z-10" style={{ height: '60vh', minHeight: '400px' }}>
        {STARS.map(star => (
          star.hasNote ? (
            // Clickable stars: framer-motion pulse
            <motion.div
              key={star.id}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size + 6,
                height: star.size + 6,
                background: clickedStars.has(star.id) ? '#FFB347' : '#FFFFFF',
                boxShadow: clickedStars.has(star.id)
                  ? '0 0 12px #FFB347, 0 0 24px rgba(255,179,71,0.6)'
                  : '0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,143,171,0.5)',
                cursor: 'pointer',
                willChange: 'transform',
              }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: star.duration, delay: star.delay, repeat: Infinity }}
              onClick={() => handleStarClick(star)}
              whileTap={{ scale: 0.85 }}
            />
          ) : (
            // Background stars: pure CSS, zero JS overhead
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                opacity: star.brightness * 0.6,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              }}
            />
          )
        ))}
      </div>

      {/* Discovered counter */}
      <div className="relative z-10 flex justify-center mt-8 px-4">
        <div className="rounded-2xl px-6 py-4 text-center"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(196,216,240,0.15)' }}>
          <div className="flex gap-2 flex-wrap justify-center">
            {STAR_NOTES.map((note, i) => (
              <span key={i} className="text-lg transition-opacity duration-300"
                style={{ opacity: clickedStars.has(i) ? 1 : 0.2 }}>
                {note.emoji}
              </span>
            ))}
          </div>
          <p className="font-body text-xs mt-2" style={{ color: 'rgba(196,216,240,0.5)' }}>
            Find all {STAR_NOTES.length} glowing stars ✨
          </p>
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.88)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNote(null)}
          >
            <motion.div
              className="rounded-3xl p-8 max-w-sm w-full text-center relative"
              style={{ background: 'rgba(13,13,40,0.98)', border: '1px solid rgba(196,216,240,0.25)' }}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="text-5xl mb-4">{activeNote.emoji}</div>
              <h3 className="font-display font-bold text-xl mb-3" style={{ color: '#FFD6E0' }}>
                {activeNote.title}
              </h3>
              <p className="font-body leading-relaxed" style={{ color: 'rgba(255,214,224,0.8)' }}>
                {activeNote.note}
              </p>
              <button onClick={() => setActiveNote(null)} className="mt-6 text-xs font-body"
                style={{ color: 'rgba(196,216,240,0.4)' }}>
                ✕ close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
