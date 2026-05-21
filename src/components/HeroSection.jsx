import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const words = ['forever', 'magical', 'golden', 'ours'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current.children,
        { opacity: 0, y: 60, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  const scrollDown = () => {
    document.getElementById('clouds')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        src="media/reel-memory.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(3px) brightness(0.5)' }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(13,13,26,0.6) 0%, rgba(45,10,60,0.5) 40%, rgba(13,13,26,0.8) 100%)',
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF8FAB, transparent)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FFB347, transparent)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #DBC4F0, transparent)', filter: 'blur(80px)', transform: 'translate(-50%,-50%)' }}
        />
      </div>

      {/* Main content */}
      <div ref={titleRef} className="relative z-10 text-center px-6 max-w-4xl">
        {/* Top badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 text-sm font-body"
          style={{ color: '#FFD6E0', border: '1px solid rgba(255,143,171,0.3)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="animate-pulse">💕</span>
          <span>A trip we'll never forget</span>
          <span className="animate-pulse">💕</span>
        </motion.div>

        {/* Main title */}
        <h1
          className="font-display font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', color: '#FFF8F0' }}
        >
          Some trips become{' '}
          <span className="italic glow-text" style={{ color: '#FF8FAB' }}>
            forever
          </span>{' '}
          memories
        </h1>

        {/* Animated word */}
        <div className="flex items-center justify-center gap-3 mb-4" style={{ height: '3rem' }}>
          <span className="text-xl font-body" style={{ color: 'rgba(255,214,224,0.7)' }}>This trip was</span>
          <motion.span
            key={wordIndex}
            className="text-2xl font-cursive font-bold glow-text-gold"
            style={{ color: '#FFB347' }}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {words[wordIndex]} ✨
          </motion.span>
        </div>

        {/* Subtitle */}
        <p
          className="font-cursive text-2xl md:text-3xl mb-12"
          style={{ color: 'rgba(255,214,224,0.8)' }}
        >
          Our Little Trip Universe ✨
        </p>

        {/* CTA Button */}
        <motion.button
          onClick={scrollDown}
          className="btn-glow font-body font-bold text-lg px-10 py-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #FF8FAB 0%, #FFB347 100%)',
            color: '#0D0D1A',
            border: 'none',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          animate={{ boxShadow: ['0 0 20px rgba(255,143,171,0.4)', '0 0 50px rgba(255,143,171,0.8)', '0 0 20px rgba(255,143,171,0.4)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Enter Memories 💕
        </motion.button>
      </div>

      {/* Floating emojis */}
      {['✨', '💕', '🌸', '⭐', '💖', '🎀'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            rotate: [-10, 10, -10],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={scrollDown}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs font-body tracking-widest uppercase" style={{ color: 'rgba(255,214,224,0.5)' }}>
          Scroll to explore
        </span>
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'rgba(255,143,171,0.4)' }}>
          <motion.div
            className="w-1.5 h-2.5 rounded-full"
            style={{ background: '#FF8FAB' }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
