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
  { emoji: '🎀', title: 'Best Sibling', note: 'You make every adventure 10x better just by being you. Don\'t ever change. 🎀' },
  { emoji: '🌟', title: 'Next Trip?', note: 'Where are we going next? Because this can\'t be our last adventure together...' },
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

const STARS = generateStars(60);

export default function NightSky({ showToast }) {
  const [activeNote, setActiveNote] = useState(null);
  const [clickedStars, setClickedStars] = useState(new Set());
  const canvasRef = useRef(null);

  // Shooting stars canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shootingStars = [];
    const addShootingStar = () => {
      if (Math.random() > 0.97) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          len: 80 + Math.random() * 120,
          speed: 8 + Math.random() * 10,
          alpha: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      addShootingStar();
      shootingStars.forEach((s, idx) => {
        ctx.save();
        ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
        ctx.restore();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.025;
      });
      // Remove faded
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (shootingStars[i].alpha <= 0) shootingStars.splice(i, 1);
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const handleStarClick = (star) => {
    if (!star.hasNote) return;
    setClickedStars(prev => new Set([...prev, star.id]));
    setActiveNote(star.note);
    showToast(`${star.note.emoji} ${star.note.title}`, star.note.emoji);
  };

  return (
    <section
      id="nightsky"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #020210 0%, #0D0D2B 30%, #1A0820 70%, #050510 100%)' }}
    >
      {/* Shooting stars canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Moon */}
      <motion.div
        className="absolute top-16 right-16 w-24 h-24 rounded-full moon-glow"
        style={{
          background: 'radial-gradient(circle at 40% 40%, #FFF5D0, #FFE08A)',
          boxShadow: '0 0 40px rgba(255,220,150,0.4), 0 0 80px rgba(255,220,150,0.2)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#C4D8F0' }}>🌙 click the stars</p>
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}
        >
          Night Sky Secrets
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(196,216,240,0.6)' }}>
          Each glowing star holds a secret memory ⭐
        </p>
        <p className="font-body text-sm mt-1" style={{ color: 'rgba(196,216,240,0.4)' }}>
          {clickedStars.size}/{STAR_NOTES.length} stars discovered
        </p>
      </motion.div>

      {/* Star field */}
      <div className="relative z-10" style={{ height: '60vh', minHeight: '400px' }}>
        {STARS.map(star => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.hasNote ? star.size + 4 : star.size,
              height: star.hasNote ? star.size + 4 : star.size,
              background: star.hasNote
                ? clickedStars.has(star.id)
                  ? '#FFB347'
                  : '#FFFFFF'
                : `rgba(255,255,255,${star.brightness})`,
              boxShadow: star.hasNote
                ? clickedStars.has(star.id)
                  ? '0 0 12px #FFB347, 0 0 24px rgba(255,179,71,0.6)'
                  : '0 0 8px rgba(255,255,255,0.8), 0 0 16px rgba(255,143,171,0.4)'
                : 'none',
              cursor: star.hasNote ? 'pointer' : 'default',
            }}
            animate={star.hasNote
              ? {
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }
              : {
                opacity: [star.brightness * 0.3, star.brightness, star.brightness * 0.3],
              }
            }
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            onClick={() => handleStarClick(star)}
            whileHover={star.hasNote ? { scale: 2.5 } : {}}
          >
            {star.hasNote && !clickedStars.has(star.id) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(255,143,171,0.3)' }}
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Discovered counter */}
      <div className="relative z-10 flex justify-center mt-8">
        <div
          className="glass rounded-2xl px-8 py-4 text-center"
          style={{ border: '1px solid rgba(196,216,240,0.2)' }}
        >
          <div className="flex gap-2 flex-wrap justify-center">
            {STAR_NOTES.map((note, i) => (
              <span
                key={i}
                className="text-lg transition-all duration-300"
                style={{ opacity: clickedStars.has(i) ? 1 : 0.2 }}
                title={note.title}
              >
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
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveNote(null)}
          >
            <motion.div
              className="glass-dark rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
              style={{ border: '1px solid rgba(196,216,240,0.2)' }}
              initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Twinkling background stars */}
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out ${Math.random() * 2}s infinite`,
                  }}
                />
              ))}

              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {activeNote.emoji}
              </motion.div>

              <h3 className="font-display font-bold text-xl mb-3 glow-text" style={{ color: '#FFD6E0' }}>
                {activeNote.title}
              </h3>

              <p className="font-body leading-relaxed" style={{ color: 'rgba(255,214,224,0.8)' }}>
                {activeNote.note}
              </p>

              <div className="mt-6">
                <button
                  onClick={() => setActiveNote(null)}
                  className="text-xs font-body"
                  style={{ color: 'rgba(196,216,240,0.4)' }}
                >
                  ✕ close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
