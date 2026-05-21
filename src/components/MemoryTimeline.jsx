import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const memories = [
  {
    time: 'Day 1',
    title: 'The Beginning ✨',
    caption: 'We had no idea what was coming — just excitement and chaos',
    emoji: '🚀',
    image: 'media/photo.jpeg',
    color: '#FF8FAB',
  },
  {
    time: 'Day 1',
    title: 'First Laughs 😂',
    caption: 'That thing that happened — you know the one. Still can\'t stop laughing.',
    emoji: '😂',
    image: 'media/cutiee.jpeg',
    color: '#FFB347',
  },
  {
    time: 'Day 2',
    title: 'The Bullet Ride 🏍️',
    caption: 'Wind, speed, screaming, and pure happiness. Best decision ever.',
    emoji: '🏍️',
    image: 'media/pink-blue.jpeg',
    color: '#DBC4F0',
  },
  {
    time: 'Day 2',
    title: 'Golden Hour 🌅',
    caption: 'That sunset that literally made us stop and just... breathe.',
    emoji: '🌅',
    image: 'media/cutiee1.jpeg',
    color: '#FFB347',
  },
  {
    time: 'Day 3',
    title: 'The Last Day 💕',
    caption: 'Not wanting it to end. Grateful for every single second.',
    emoji: '💕',
    image: 'media/cutiee.jpeg',
    color: '#FF8FAB',
  },
];

export default function MemoryTimeline() {
  const [activeMemory, setActiveMemory] = useState(null);
  const containerRef = useRef(null);

  return (
    <section
      id="timeline"
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0A0A1A 0%, #1A1030 50%, #0A0A1A 100%)' }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-16 px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-cursive text-xl mb-2" style={{ color: '#DBC4F0' }}>💌 our journey</p>
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#FFF8F0' }}
        >
          Memory Timeline
        </h2>
        <p className="font-body mt-3" style={{ color: 'rgba(255,214,224,0.6)' }}>
          Click each moment to relive it 💕
        </p>
      </motion.div>

      {/* Horizontal scroll timeline — desktop */}
      <div className="hidden md:block relative px-16 z-10">
        {/* Timeline line */}
        <div className="relative mb-16">
          <div
            className="h-0.5 w-full rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #FF8FAB, #FFB347, #DBC4F0, #FF8FAB, transparent)' }}
          />
          <div
            className="absolute inset-0 h-0.5 rounded-full"
            style={{ background: 'inherit', filter: 'blur(8px)', opacity: 0.5 }}
          />

          {/* Timeline points */}
          {memories.map((mem, i) => (
            <motion.div
              key={i}
              className="absolute flex flex-col items-center cursor-pointer"
              style={{ left: `${8 + i * 21}%`, top: '-14px' }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, type: 'spring', bounce: 0.5 }}
              onClick={() => setActiveMemory(activeMemory?.time === mem.time && activeMemory?.title === mem.title ? null : mem)}
            >
              <motion.div
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
                style={{
                  background: `${mem.color}20`,
                  borderColor: mem.color,
                  boxShadow: `0 0 16px ${mem.color}60`,
                }}
                animate={{ boxShadow: [`0 0 8px ${mem.color}40`, `0 0 24px ${mem.color}80`, `0 0 8px ${mem.color}40`] }}
                transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
                whileHover={{ scale: 1.3 }}
              >
                {mem.emoji}
              </motion.div>
              <div className="mt-2 text-center" style={{ minWidth: '80px' }}>
                <p className="font-body text-xs font-bold" style={{ color: mem.color }}>{mem.time}</p>
                <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,214,224,0.6)', fontSize: '10px' }}>
                  {mem.title.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Memory cards row */}
        <div className="grid grid-cols-5 gap-4">
          {memories.map((mem, i) => (
            <motion.div
              key={i}
              className="rounded-2xl overflow-hidden cursor-pointer group"
              style={{ border: `1px solid ${mem.color}20` }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8, boxShadow: `0 20px 40px ${mem.color}30` }}
              onClick={() => setActiveMemory(mem)}
            >
              <div className="relative overflow-hidden" style={{ height: '120px' }}>
                <img
                  src={mem.image}
                  alt={mem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${mem.color}60 0%, transparent 60%)` }} />
                <div className="absolute bottom-2 left-2">
                  <span className="text-xl">{mem.emoji}</span>
                </div>
              </div>
              <div className="p-3" style={{ background: '#0D0D1A' }}>
                <p className="font-body font-bold text-xs" style={{ color: mem.color }}>{mem.time}</p>
                <p className="font-display text-sm font-semibold mt-0.5" style={{ color: '#FFF8F0' }}>{mem.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile timeline — vertical */}
      <div className="md:hidden px-6 relative z-10">
        <div
          className="absolute left-10 top-0 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(180deg, transparent, #FF8FAB, #FFB347, #DBC4F0, transparent)' }}
        />
        <div className="space-y-8">
          {memories.map((mem, i) => (
            <motion.div
              key={i}
              className="flex gap-6 items-start"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm"
                  style={{
                    background: `${mem.color}20`,
                    borderColor: mem.color,
                    boxShadow: `0 0 16px ${mem.color}60`,
                  }}
                >
                  {mem.emoji}
                </div>
              </div>
              {/* Card */}
              <div
                className="flex-1 rounded-2xl overflow-hidden cursor-pointer"
                style={{ border: `1px solid ${mem.color}20` }}
                onClick={() => setActiveMemory(mem)}
              >
                <div className="relative" style={{ height: '140px' }}>
                  <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)` }} />
                </div>
                <div className="p-3" style={{ background: '#0D0D1A' }}>
                  <p className="font-body font-bold text-xs" style={{ color: mem.color }}>{mem.time}</p>
                  <p className="font-display text-sm font-semibold" style={{ color: '#FFF8F0' }}>{mem.title}</p>
                  <p className="font-body text-xs mt-1" style={{ color: 'rgba(255,214,224,0.5)' }}>{mem.caption}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory detail modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMemory(null)}
          >
            <motion.div
              className="glass rounded-3xl overflow-hidden max-w-md w-full"
              style={{ border: `1px solid ${activeMemory.color}40` }}
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative" style={{ height: '250px' }}>
                <img
                  src={activeMemory.image}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, rgba(13,13,26,0.9) 0%, transparent 60%)` }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{activeMemory.emoji}</span>
                  <div>
                    <p className="font-body text-xs font-bold" style={{ color: activeMemory.color }}>{activeMemory.time}</p>
                    <h3 className="font-display font-bold text-xl" style={{ color: '#FFF8F0' }}>{activeMemory.title}</h3>
                  </div>
                </div>
                <p className="font-body" style={{ color: 'rgba(255,214,224,0.8)' }}>{activeMemory.caption}</p>
                <button
                  onClick={() => setActiveMemory(null)}
                  className="mt-4 text-xs font-body"
                  style={{ color: 'rgba(255,214,224,0.4)' }}
                >
                  tap anywhere to close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
