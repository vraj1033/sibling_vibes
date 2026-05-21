import { useRef } from 'react';
import { motion } from 'framer-motion';

const clouds = [
  { id: 'polaroid', emoji: '📸', label: 'Photos', target: '#polaroid', color: '#FF8FAB', delay: 0 },
  { id: 'videos', emoji: '🎥', label: 'Videos', target: '#videos', color: '#FFB347', delay: 0.15 },
  { id: 'activities', emoji: '😂', label: 'Fun Games', target: '#activities', color: '#DBC4F0', delay: 0.3 },
  { id: 'timeline', emoji: '💌', label: 'Our Journey', target: '#timeline', color: '#C4F0E0', delay: 0.45 },
  { id: 'finale', emoji: '✨', label: 'Final Surprise', target: '#finale', color: '#FFD6E0', delay: 0.6 },
];

export default function FloatingClouds() {
  const scrollTo = (target) => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="clouds"
      className="relative min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0D0D2B 0%, #1A0830 30%, #2D1040 60%, #1A0830 100%)',
      }}
    >
      {/* Dreamy sky gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-64"
          style={{ background: 'linear-gradient(180deg, #0D0D2B 0%, transparent 100%)' }} />
        {/* Soft light rays */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-px opacity-10"
            style={{
              left: `${15 + i * 14}%`,
              height: '100%',
              background: `linear-gradient(180deg, ${clouds[i % clouds.length].color} 0%, transparent 60%)`,
              filter: 'blur(20px)',
              width: '80px',
            }}
          />
        ))}
      </div>

      {/* Section header */}
      <motion.div
        className="text-center mb-16 z-10 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-3" style={{ color: '#DBC4F0' }}>
          ✨ tap to explore ✨
        </p>
        <h2
          className="font-display font-bold glow-text"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFD6E0' }}
        >
          Memory Clouds
        </h2>
        <p className="font-body mt-3 text-lg" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Every cloud holds something precious 💕
        </p>
      </motion.div>

      {/* Cloud grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 max-w-6xl w-full">
        {clouds.map((cloud, i) => (
          <motion.button
            key={cloud.id}
            onClick={() => scrollTo(cloud.target)}
            className="relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl cursor-pointer group"
            style={{
              background: `rgba(${cloud.color === '#FF8FAB' ? '255,143,171' : cloud.color === '#FFB347' ? '255,179,71' : cloud.color === '#DBC4F0' ? '219,196,240' : cloud.color === '#C4F0E0' ? '196,240,224' : '255,214,224'},0.08)`,
              border: `1px solid ${cloud.color}30`,
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: cloud.delay }}
            animate={{ y: [-8, 8, -8] }}
            whileHover={{
              scale: 1.08,
              boxShadow: `0 20px 60px ${cloud.color}40`,
              borderColor: `${cloud.color}80`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at center, ${cloud.color}15 0%, transparent 70%)` }}
            />

            {/* Emoji */}
            <motion.span
              className="text-4xl md:text-5xl relative z-10"
              animate={{
                y: [-8, 8, -8],
                rotate: [-5, 5, -5],
              }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              {cloud.emoji}
            </motion.span>

            {/* Label */}
            <span
              className="font-body font-bold text-sm md:text-base relative z-10 text-center"
              style={{ color: cloud.color }}
            >
              {cloud.label}
            </span>

            {/* Arrow */}
            <motion.div
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: cloud.color }}
            >
              tap to go ↓
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Floating stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.6 + 0.1,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 3}s infinite`,
          }}
        />
      ))}
    </section>
  );
}
