import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX - 4}px`;
      dot.style.top = `${mouseY - 4}px`;
    };

    const animate = () => {
      ringX += (mouseX - ringX - 18) * 0.12;
      ringY += (mouseY - ringY - 18) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    animate();

    const hoverable = document.querySelectorAll('a, button, [data-hover]');
    hoverable.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '56px';
        ring.style.height = '56px';
        ring.style.background = 'rgba(255,143,171,0.1)';
        ring.style.marginLeft = '-10px';
        ring.style.marginTop = '-10px';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.background = '';
        ring.style.marginLeft = '';
        ring.style.marginTop = '';
      });
    });

    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
