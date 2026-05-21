import { motion } from 'framer-motion';

export default function Toast({ message, emoji }) {
  return (
    <motion.div
      className="fixed bottom-24 left-1/2 z-[999] glass rounded-2xl px-6 py-3 flex items-center gap-3"
      style={{
        background: 'rgba(255,143,171,0.15)',
        border: '1px solid rgba(255,143,171,0.4)',
        x: '-50%'
      }}
      initial={{ opacity: 0, y: 30, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-body font-semibold" style={{ color: '#FFF8F0' }}>{message}</span>
    </motion.div>
  );
}
