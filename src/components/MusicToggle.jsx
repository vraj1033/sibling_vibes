import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// Am → F → C → G romantic chord progression (Hz)
const CHORDS = [
  [110, 220, 261.63, 329.63, 440],     // Am  (A-A-C-E-A)
  [87.31, 174.61, 220, 261.63, 349.23],// F   (F-F-A-C-F)
  [130.81, 261.63, 329.63, 392, 523.25],// C  (C-C-E-G-C)
  [98, 196, 246.94, 293.66, 392],      // G   (G-G-B-D-G)
];

// Gentle high melody arpeggios over each chord
const MELODY = [
  [659.25, 783.99, 880, 783.99],        // over Am: E5-G5-A5-G5
  [698.46, 783.99, 880, 698.46],        // over F:  F5-G5-A5-F5
  [783.99, 880, 1046.5, 880],           // over C:  G5-A5-C6-A5
  [783.99, 698.46, 659.25, 587.33],     // over G:  G5-F5-E5-D5
];

const CHORD_DUR = 5; // seconds per chord

function makeReverb(ctx) {
  const len = ctx.sampleRate * 3.5;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = buf;
  return conv;
}

// Warm string-pad voice: 3 detuned triangle oscillators + soft envelope
function playPad(ctx, freq, vol, dest, t0, dur, nodes) {
  [-10, 0, 10].forEach(cents => {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = cents;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 1.2);
    g.gain.setValueAtTime(vol, t0 + dur - 1.0);
    g.gain.linearRampToValueAtTime(0, t0 + dur);
    osc.connect(g); g.connect(dest);
    osc.start(t0); osc.stop(t0 + dur + 0.1);
    nodes.push(osc, g);
  });
}

// Soft sine melody note with quick attack
function playMelody(ctx, freq, vol, dest, t0, dur, nodes) {
  const osc  = ctx.createOscillator();
  const g    = ctx.createGain();
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.value = 3500;
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.08);
  g.gain.linearRampToValueAtTime(vol * 0.6, t0 + dur - 0.15);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  osc.connect(filt); filt.connect(g); g.connect(dest);
  osc.start(t0); osc.stop(t0 + dur + 0.05);
  nodes.push(osc, g, filt);
}

// Subtle bass note (sine, one octave below root)
function playBass(ctx, freq, vol, dest, t0, dur, nodes) {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  const f   = ctx.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 400;
  osc.type = 'sine';
  osc.frequency.value = freq / 2;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.6);
  g.gain.setValueAtTime(vol, t0 + dur - 0.8);
  g.gain.linearRampToValueAtTime(0, t0 + dur);
  osc.connect(f); f.connect(g); g.connect(dest);
  osc.start(t0); osc.stop(t0 + dur + 0.1);
  nodes.push(osc, g, f);
}

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const ctxRef      = useRef(null);
  const nodesRef    = useRef([]);
  const timerRef    = useRef(null);
  const scheduleRef = useRef(0); // next chord start time
  const chordIdxRef = useRef(0);

  const scheduleNext = (ctx, masterGain) => {
    const nodes = nodesRef.current;
    const t0    = scheduleRef.current;
    const ci    = chordIdxRef.current % CHORDS.length;
    const chord = CHORDS[ci];
    const mel   = MELODY[ci];

    // Pad: all chord tones
    chord.forEach((freq, i) => {
      const vol = i === 0 ? 0.055 : 0.04 / (i * 0.6 + 1);
      playPad(ctx, freq, vol, masterGain, t0, CHORD_DUR + 0.4, nodes);
    });

    // Bass root
    playBass(ctx, chord[1], 0.07, masterGain, t0, CHORD_DUR + 0.4, nodes);

    // Melody arpeggio — 4 notes spread across chord duration
    const noteDur = CHORD_DUR / mel.length + 0.4;
    mel.forEach((freq, i) => {
      playMelody(ctx, freq, 0.045, masterGain, t0 + i * (CHORD_DUR / mel.length), noteDur, nodes);
    });

    scheduleRef.current += CHORD_DUR;
    chordIdxRef.current += 1;

    // Schedule next chord 1 second before this one ends
    timerRef.current = setTimeout(() => scheduleNext(ctx, masterGain), (CHORD_DUR - 1) * 1000);
  };

  const startMusic = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    nodesRef.current = [];
    chordIdxRef.current = 0;

    // Signal chain: masterGain → reverb+dry → destination
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5); // 2.5s fade-in
    nodesRef.current.push(masterGain);

    const reverb     = makeReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.55;
    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.6;

    masterGain.connect(reverb);
    masterGain.connect(dryGain);
    reverb.connect(reverbGain);
    reverbGain.connect(ctx.destination);
    dryGain.connect(ctx.destination);
    nodesRef.current.push(reverb, reverbGain, dryGain);

    scheduleRef.current = ctx.currentTime + 0.1;
    scheduleNext(ctx, masterGain);
  };

  const stopMusic = () => {
    clearTimeout(timerRef.current);
    const ctx = ctxRef.current;
    if (ctx) {
      // Gentle fade-out before stopping
      nodesRef.current.forEach(n => {
        if (n.gain) {
          try { n.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5); } catch {}
        }
      });
      setTimeout(() => {
        nodesRef.current.forEach(n => {
          try { n.stop?.(); } catch {}
          try { n.disconnect?.(); } catch {}
        });
        nodesRef.current = [];
        ctx.close();
        ctxRef.current = null;
      }, 1600);
    }
  };

  useEffect(() => () => { clearTimeout(timerRef.current); ctxRef.current?.close(); }, []);

  const toggle = () => {
    if (playing) {
      stopMusic();
      setPlaying(false);
    } else {
      startMusic();
      setPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 rounded-full glass flex flex-col items-center justify-center btn-glow gap-0.5"
      style={{
        width: '60px',
        height: '60px',
        background: 'rgba(255,143,171,0.15)',
        border: '1px solid rgba(255,143,171,0.4)',
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      title={playing ? 'Pause romantic music' : 'Play romantic music'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {playing ? (
        <>
          <motion.span
            className="text-lg leading-none"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🎵
          </motion.span>
          {/* Equalizer bars */}
          <div className="flex items-end gap-0.5" style={{ height: '10px' }}>
            {[1, 2, 3, 2].map((h, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: '#FF8FAB', height: `${h * 3}px` }}
                animate={{ height: [`${h * 2}px`, `${h * 5}px`, `${h * 2}px`] }}
                transition={{ duration: 0.5 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </>
      ) : (
        <span className="text-2xl">🎵</span>
      )}
    </motion.button>
  );
}
