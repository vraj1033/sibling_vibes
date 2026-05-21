import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const words = ['forever', 'magical', 'golden', 'ours'];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const titleRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  const scrollDown = () => {
    document.getElementById('clouds')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Background video — no blur on mobile (blur is expensive) */}
      <video
        src="media/reel-memory.mp4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: isMobile ? 'brightness(0.45)' : 'blur(3px) brightness(0.5)' }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(13,13,26,0.65) 0%, rgba(45,10,60,0.5) 40%, rgba(13,13,26,0.85) 100%)' }}
      />

      {/* Orbs — static on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FF8FAB, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #FFB347, transparent)', filter: 'blur(60px)' }} />
      </div>

      {/* Main content */}
      <div ref={titleRef} className="relative z-10 text-center px-6 max-w-4xl">

        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-body"
          style={{ color: '#FFD6E0', border: '1px solid rgba(255,143,171,0.3)', background: 'rgba(255,143,171,0.08)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span>💕</span>
          <span>A trip we'll never forget</span>
          <span>💕</span>
        </motion.div>

        <h1 className="font-display font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 5.5rem)', color: '#FFF8F0' }}>
          Some trips become{' '}
          <span className="italic glow-text" style={{ color: '#FF8FAB' }}>forever</span>{' '}
          memories
        </h1>

        <div className="flex items-center justify-center gap-3 mb-4" style={{ height: '3rem' }}>
          <span className="text-lg md:text-xl font-body" style={{ color: 'rgba(255,214,224,0.7)' }}>This trip was</span>
          <motion.span
            key={wordIndex}
            className="text-xl md:text-2xl font-cursive font-bold"
            style={{ color: '#FFB347' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {words[wordIndex]} ✨
          </motion.span>
        </div>

        <p className="font-cursive text-2xl md:text-3xl mb-10" style={{ color: 'rgba(255,214,224,0.8)' }}>
          Our Little Trip Universe ✨
        </p>

        {/* CTA — CSS glow animation, not framer Infinity */}
        <button
          onClick={scrollDown}
          className="font-body font-bold text-lg px-10 py-4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #FF8FAB 0%, #FFB347 100%)',
            color: '#0D0D1A',
            border: 'none',
            animation: 'btnGlow 2.5s ease-in-out infinite',
            cursor: 'pointer',
          }}
        >
          Enter Memories 💕
        </button>
      </div>

      {/* Floating emojis — desktop only */}
      {!isMobile && ['✨', '💕', '🌸', '⭐', '💖', '🎀'].map((emoji, i) => (
        <div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            opacity: 0.5,
            animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Scroll indicator — CSS animation */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={scrollDown}
      >
        <span className="text-xs font-body tracking-widest uppercase" style={{ color: 'rgba(255,214,224,0.5)' }}>
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: 'rgba(255,143,171,0.4)' }}>
          <div className="w-1.5 h-2.5 rounded-full" style={{ background: '#FF8FAB', animation: 'scrollDot 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
}
