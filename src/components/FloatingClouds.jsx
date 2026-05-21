import { motion } from 'framer-motion';

const clouds = [
  { id: 'polaroid', emoji: '📸', label: 'Photos', target: '#polaroid', color: '#FF8FAB', delay: 0 },
  { id: 'videos', emoji: '🎥', label: 'Videos', target: '#videos', color: '#FFB347', delay: 0.1 },
  { id: 'activities', emoji: '😂', label: 'Fun Games', target: '#activities', color: '#DBC4F0', delay: 0.2 },
  { id: 'timeline', emoji: '💌', label: 'Our Journey', target: '#timeline', color: '#C4F0E0', delay: 0.3 },
  { id: 'finale', emoji: '✨', label: 'Final Surprise', target: '#finale', color: '#FFD6E0', delay: 0.4 },
];

const rgbMap = {
  '#FF8FAB': '255,143,171',
  '#FFB347': '255,179,71',
  '#DBC4F0': '219,196,240',
  '#C4F0E0': '196,240,224',
  '#FFD6E0': '255,214,224',
};

export default function FloatingClouds() {
  const scrollTo = (target) => {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="clouds"
      className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D0D2B 0%, #1A0830 50%, #0D0D2B 100%)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-12 z-10 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-cursive text-xl mb-3" style={{ color: '#DBC4F0' }}>✨ tap to explore ✨</p>
        <h2 className="font-display font-bold glow-text"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFD6E0' }}>
          Memory Clouds
        </h2>
        <p className="font-body mt-3 text-base" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Every cloud holds something precious 💕
        </p>
      </motion.div>

      {/* Cloud grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 px-6 max-w-5xl w-full">
        {clouds.map((cloud, i) => (
          <motion.button
            key={cloud.id}
            onClick={() => scrollTo(cloud.target)}
            className="relative flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-3xl"
            style={{
              background: `rgba(${rgbMap[cloud.color]},0.08)`,
              border: `1px solid ${cloud.color}25`,
              // No backdrop-filter on mobile — huge perf win
              WebkitBackdropFilter: 'none',
              backdropFilter: 'none',
              willChange: 'transform',
            }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: cloud.delay }}
            // No continuous animate prop — only on hover/tap
            whileHover={{ scale: 1.06, y: -6, boxShadow: `0 16px 40px ${cloud.color}35` }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Emoji — CSS float animation, not framer repeat Infinity */}
            <span
              className="text-4xl md:text-5xl"
              style={{ animation: `float ${3 + i * 0.6}s ease-in-out ${i * 0.3}s infinite` }}
            >
              {cloud.emoji}
            </span>

            <span className="font-body font-bold text-sm md:text-base text-center"
              style={{ color: cloud.color }}>
              {cloud.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stars — CSS only, zero JS */}
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${(i * 7.3) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            opacity: 0.3,
            animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i % 4) * 0.7}s infinite`,
          }}
        />
      ))}
    </section>
  );
}
