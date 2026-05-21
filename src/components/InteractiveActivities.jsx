import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===== Balloon Pop =====
const BALLOON_MESSAGES = [
  "You two are literally the cutest! 💕",
  "Best sibling duo ever! 🌟",
  "This trip = legendary! 🏆",
  "Core memory unlocked! 💖",
  "Main characters of life! ✨",
  "Adventure mode: ON! 🚀",
  "Squad goals forever! 🎀",
];

const BALLOON_COLORS = ['#FF8FAB', '#FFB347', '#DBC4F0', '#FF6B8A', '#FFD700', '#98E4FF', '#C4F0A0'];

function BalloonGame({ showToast }) {
  const [balloons, setBalloons] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: 5 + (i * 9),
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      size: 50 + Math.random() * 30,
      speed: 0.3 + Math.random() * 0.4,
      popped: false,
      message: BALLOON_MESSAGES[i % BALLOON_MESSAGES.length],
    }))
  );
  const [confetti, setConfetti] = useState([]);
  const [poppedMsg, setPoppedMsg] = useState(null);
  const animRef = useRef(null);
  const positionsRef = useRef(balloons.map(b => ({ y: 100 + Math.random() * 20, vy: -(b.speed) })));

  useEffect(() => {
    const animate = () => {
      positionsRef.current = positionsRef.current.map((p, i) => {
        let ny = p.y + p.vy;
        if (ny < -20) ny = 110;
        return { ...p, y: ny };
      });
      setBalloons(prev => prev.map((b, i) => ({ ...b, _y: positionsRef.current[i].y })));
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const popBalloon = (b) => {
    if (b.popped) return;
    setBalloons(prev => prev.map(bal => bal.id === b.id ? { ...bal, popped: true } : bal));
    setPoppedMsg(b.message);
    showToast(b.message, '🎈');
    const pieces = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: b.x,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200,
    }));
    setConfetti(c => [...c, ...pieces]);
    setTimeout(() => setConfetti(c => c.filter(p => !pieces.find(n => n.id === p.id))), 2000);
    setTimeout(() => {
      setBalloons(prev => prev.map(bal => bal.id === b.id ? { ...bal, popped: false } : bal));
    }, 3000);
    setTimeout(() => setPoppedMsg(null), 3000);
  };

  return (
    <div className="relative h-80 md:h-96 overflow-hidden rounded-3xl"
      style={{ background: 'linear-gradient(180deg, #1A1040 0%, #2D1B50 100%)', border: '1px solid rgba(255,143,171,0.2)' }}>
      <div className="absolute inset-0 overflow-hidden">
        {balloons.map((b) => !b.popped && (
          <motion.div
            key={b.id}
            className="absolute cursor-pointer select-none"
            style={{ left: `${b.x}%`, top: `${b._y ?? 50}%`, zIndex: 5 }}
            onClick={() => popBalloon(b)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.8 }}
          >
            <svg width={b.size} height={b.size * 1.2} viewBox="0 0 60 72">
              <ellipse cx="30" cy="28" rx="24" ry="26" fill={b.color} opacity="0.9" />
              <ellipse cx="22" cy="18" rx="7" ry="5" fill="rgba(255,255,255,0.3)" />
              <path d="M30 54 Q28 62 30 68" stroke={b.color} strokeWidth="2" fill="none" />
              <polygon points="27,54 33,54 30,60" fill={b.color} />
            </svg>
          </motion.div>
        ))}

        {/* Pop animations */}
        {confetti.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ left: `${p.x}%`, top: '50%', background: p.color, zIndex: 10 }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ x: p.dx, y: p.dy, scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}
      </div>

      {/* Popped message */}
      <AnimatePresence>
        {poppedMsg && (
          <motion.div
            className="absolute inset-x-0 bottom-4 flex justify-center z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass rounded-2xl px-6 py-3 text-center"
              style={{ border: '1px solid rgba(255,143,171,0.4)' }}>
              <p className="font-body font-bold text-sm" style={{ color: '#FFD6E0' }}>{poppedMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-0 right-0 text-center">
        <p className="font-body text-xs" style={{ color: 'rgba(255,214,224,0.5)' }}>
          🎈 Pop the balloons!
        </p>
      </div>
    </div>
  );
}

// ===== Scratch Card =====
function ScratchCard({ showToast }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [scratched, setScratched] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const revealedRef = useRef(false);

  const REVEAL_IMAGE = 'media/cutiee.jpeg';

  // Draw the gold overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#8B6914');
    grad.addColorStop(0.5, '#D4A843');
    grad.addColorStop(1, '#8B6914');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch to reveal! ✨', canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillText('🪄 Magic awaits...', canvas.width / 2, canvas.height / 2 + 18);
  }, []);

  // ── KEY FIX: add touch listeners as non-passive so preventDefault works ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    };

    const doScratch = (e) => {
      e.preventDefault(); // now works because listener is non-passive
      if (!isDrawing.current) return;
      const ctx = canvas.getContext('2d');
      const pos = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Sample every 4th pixel to reduce CPU load
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < data.length; i += 16) if (data[i] === 0) transparent++;
      const pct = Math.round((transparent / (data.length / 16)) * 100);
      setScratched(Math.min(pct, 99));

      if (pct > 55 && !revealedRef.current) {
        revealedRef.current = true;
        setRevealed(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showToast('Memory revealed! 💕', '🌸');
      }
    };

    const onStart = (e) => { e.preventDefault(); isDrawing.current = true; doScratch(e); };
    const onEnd = () => { isDrawing.current = false; };

    // { passive: false } is what makes preventDefault() actually work on mobile
    canvas.addEventListener('mousedown', onStart, { passive: false });
    canvas.addEventListener('mousemove', doScratch, { passive: false });
    canvas.addEventListener('mouseup', onEnd);
    canvas.addEventListener('mouseleave', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', doScratch, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    return () => {
      canvas.removeEventListener('mousedown', onStart);
      canvas.removeEventListener('mousemove', doScratch);
      canvas.removeEventListener('mouseup', onEnd);
      canvas.removeEventListener('mouseleave', onEnd);
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', doScratch);
      canvas.removeEventListener('touchend', onEnd);
    };
  }, [showToast]);

  return (
    <div ref={wrapRef} className="relative rounded-3xl overflow-hidden" style={{ height: '220px' }}>
      <img src={REVEAL_IMAGE} alt="Hidden memory" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      {!revealed && (
        <canvas
          ref={canvasRef}
          width={400}
          height={220}
          className="absolute inset-0 w-full h-full"
          style={{
            cursor: 'crosshair',
            borderRadius: '24px',
            // touch-action: none stops browser scroll/zoom on the canvas element
            touchAction: 'none',
          }}
        />
      )}
      {revealed && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-cursive text-2xl glow-text" style={{ color: '#FFD6E0' }}>
            💕 Memory Revealed! 💕
          </p>
        </motion.div>
      )}
      {!revealed && (
        <div className="absolute bottom-2 right-3 text-xs font-body" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {scratched}% scratched
        </div>
      )}
    </div>
  );
}

// ===== Quiz =====
const QUESTIONS = [
  {
    q: 'Who got tired first? 😴',
    options: ['Me obviously', 'You lol', 'Both at same time', 'Neither!'],
    answer: 1,
    fun: "Ha! Caught you! 😂",
  },
  {
    q: 'Who clicked most photos? 📸',
    options: ['Me (main character)', 'You (paparazzi mode)', 'Equal honestly', 'The phone'],
    answer: 0,
    fun: "You literally photographed everything! ✨",
  },
  {
    q: 'Who was late always? ⏰',
    options: ['Not me!', 'Definitely me', 'Both', 'Time is a concept'],
    answer: 1,
    fun: "Exactly as expected 😂💕",
  },
  {
    q: 'Best moment of the trip? 🌟',
    options: ['The bullet ride!', 'Random laughter', 'The food', 'All of it!'],
    answer: 3,
    fun: "Every single moment was perfect! ❤️",
  },
];

function MemoryQuiz({ showToast }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showFun, setShowFun] = useState(false);

  const answer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === QUESTIONS[currentQ].answer;
    if (isCorrect) setScore(s => s + 1);
    setShowFun(true);
    showToast(isCorrect ? "Correct! 🎉" : "Haha wrong! 😂", isCorrect ? '🎊' : '😂');
    setTimeout(() => {
      setShowFun(false);
      setSelected(null);
      if (currentQ + 1 >= QUESTIONS.length) setDone(true);
      else setCurrentQ(q => q + 1);
    }, 1800);
  };

  const reset = () => { setCurrentQ(0); setSelected(null); setScore(0); setDone(false); };

  const q = QUESTIONS[currentQ];

  return (
    <div className="rounded-3xl p-6 h-full flex flex-col gap-4"
      style={{ background: 'linear-gradient(135deg, rgba(219,196,240,0.1), rgba(255,143,171,0.05))', border: '1px solid rgba(219,196,240,0.2)' }}>
      {!done ? (
        <>
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-xs" style={{ color: 'rgba(255,214,224,0.5)' }}>
              Question {currentQ + 1}/{QUESTIONS.length}
            </span>
            <span className="font-body text-xs" style={{ color: '#DBC4F0' }}>Score: {score} ✨</span>
          </div>

          {/* Progress */}
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentQ) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(90deg, #FF8FAB, #FFB347)' }} />
          </div>

          <p className="font-display font-semibold text-lg" style={{ color: '#FFF8F0' }}>{q.q}</p>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(i)}
                className="rounded-2xl py-3 px-4 text-left text-sm font-body font-semibold transition-all duration-300"
                style={{
                  background: selected === null
                    ? 'rgba(255,255,255,0.06)'
                    : i === q.answer
                    ? 'rgba(100,255,150,0.15)'
                    : i === selected && selected !== q.answer
                    ? 'rgba(255,100,100,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: selected === null
                    ? '1px solid rgba(255,255,255,0.1)'
                    : i === q.answer
                    ? '1px solid rgba(100,255,150,0.4)'
                    : i === selected && selected !== q.answer
                    ? '1px solid rgba(255,100,100,0.4)'
                    : '1px solid rgba(255,255,255,0.05)',
                  color: selected !== null && i === q.answer ? '#90FFB0'
                    : selected === i && selected !== q.answer ? '#FF9090'
                    : '#FFD6E0',
                  cursor: selected !== null ? 'default' : 'pointer',
                }}
              >
                {opt}
                {selected !== null && i === q.answer && ' ✓'}
                {selected === i && i !== q.answer && ' ✗'}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {showFun && (
              <motion.p
                className="text-center font-cursive text-base glow-text"
                style={{ color: '#FFB347' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {q.fun}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center h-full gap-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl">🎊</div>
          <h3 className="font-display font-bold text-2xl glow-text" style={{ color: '#FF8FAB' }}>
            Quiz Complete!
          </h3>
          <p className="font-body" style={{ color: '#FFD6E0' }}>
            Score: {score}/{QUESTIONS.length} — You know each other so well! 💕
          </p>
          <button
            onClick={reset}
            className="btn-glow px-6 py-2 rounded-full font-body font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #FF8FAB, #FFB347)', color: '#0D0D1A' }}
          >
            Play Again ✨
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ===== Main Section =====
export default function InteractiveActivities({ showToast }) {
  return (
    <section
      id="activities"
      className="relative min-h-screen py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2A1040 0%, #0D1A30 50%, #2A1040 100%)' }}
    >
      <motion.div
        className="text-center mb-16 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#DBC4F0' }}>🎮 let's play</p>
        <h2
          className="font-display font-bold glow-text"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}
        >
          Interactive Memories
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Games, surprises, and fun — just like the trip! 🎉
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Balloon Pop */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2" style={{ color: '#FF8FAB' }}>
            🎈 Balloon Pop
            <span className="font-body text-sm font-normal" style={{ color: 'rgba(255,214,224,0.5)' }}>
              — pop to unlock sweet messages
            </span>
          </h3>
          <BalloonGame showToast={showToast} />
        </motion.div>

        {/* Scratch + Quiz */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2" style={{ color: '#FFB347' }}>
              ✨ Scratch Card
              <span className="font-body text-sm font-normal" style={{ color: 'rgba(255,214,224,0.5)' }}>
                — scratch to reveal
              </span>
            </h3>
            <ScratchCard showToast={showToast} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2" style={{ color: '#DBC4F0' }}>
              😂 Memory Quiz
              <span className="font-body text-sm font-normal" style={{ color: 'rgba(255,214,224,0.5)' }}>
                — how well do you know each other?
              </span>
            </h3>
            <MemoryQuiz showToast={showToast} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
