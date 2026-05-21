import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import CursorGlow from './components/CursorGlow';
import HeroSection from './components/HeroSection';
import FloatingClouds from './components/FloatingClouds';
import PolaroidWall from './components/PolaroidWall';
import InteractiveActivities from './components/InteractiveActivities';
import VideoTheater from './components/VideoTheater';
import MemoryTimeline from './components/MemoryTimeline';
import NightSky from './components/NightSky';
import FinalSurprise from './components/FinalSurprise';
import MusicToggle from './components/MusicToggle';
import FloatingParticles from './components/FloatingParticles';
import Toast from './components/Toast';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, emoji = '✨') => {
    setToast({ msg, emoji });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {!loading && (
        <div className="relative min-h-screen bg-midnight overflow-x-hidden">
          <CursorGlow />
          <FloatingParticles />
          <MusicToggle />
          <HeroSection />
          <FloatingClouds />
          <PolaroidWall showToast={showToast} />
          <InteractiveActivities showToast={showToast} />
          <VideoTheater />
          <MemoryTimeline />
          <NightSky showToast={showToast} />
          <FinalSurprise />
          {toast && <Toast message={toast.msg} emoji={toast.emoji} />}
        </div>
      )}
    </>
  );
}
