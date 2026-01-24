"use client";

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  opacity: number;
}

const Starfield = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars only on the client to avoid hydration mismatch
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            ['--duration' as any]: `${star.duration}s`,
            ['--opacity' as any]: star.opacity
          }}
        />
      ))}
      {/* Aurora Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-30 animate-pulse-glow" />
    </div>
  );
};

export default Starfield;
