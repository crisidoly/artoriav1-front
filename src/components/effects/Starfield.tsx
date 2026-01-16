import React, { useEffect, useRef } from 'react';

const Starfield: React.FC<{ resonance?: boolean }> = ({ resonance }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: any[] = [];
    const starCount = 400;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.5,
        alpha: 0.1 + Math.random() * 0.8,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Resonance effect (Cyan/Indigo glow)
      if (resonance) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${resonance ? star.alpha + 0.2 : star.alpha})`;
        ctx.beginPath();
        const flicker = resonance ? Math.random() * 2 : 1;
        ctx.arc(star.x, star.y, star.size * (resonance ? 1.5 : 1) * flicker, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed * (resonance ? 5 : 1);
        if (star.y > canvas.height) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [resonance]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none -z-10 bg-black"
    />
  );
};

export default Starfield;
