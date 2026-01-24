"use client";

import { useEffect, useRef, useState } from "react";

export function MemoryExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ vectors: 1420, dimensions: 1536 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let points: any[] = [];
    const numPoints = 300; // Performance optimized
    let animationFrame: number;
    let rotation = 0;

    // Initialize random 3D points
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            z: (Math.random() - 0.5) * 400,
            color: Math.random() > 0.5 ? '#a855f7' : '#3b82f6' // Purple or Blue
        });
    }

    const render = () => {
        ctx.fillStyle = '#000000'; // Clear transparently/black
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Use fillRect instead of clearRect for "trail" effect if opacity was < 1

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        rotation += 0.002;

        points.sort((a, b) => b.z - a.z); // Simple z-sort for depth

        points.forEach(p => {
            // Rotate Y
            const x1 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
            const z1 = p.z * Math.cos(rotation) + p.x * Math.sin(rotation);
            
            // Project 3D to 2D
            const scale = 400 / (400 + z1);
            const x2d = x1 * scale + cx;
            const y2d = p.y * scale + cy;
            const size = Math.max(0.5, 3 * scale);
            const alpha = Math.min(1, (z1 + 200) / 400); // Fade distant points

            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby points (Memory Link Effect)
            points.forEach(p2 => {
                 // Heavy logic, normally checking distance. Simplified:
                 if (Math.random() > 0.9995) {
                    ctx.strokeStyle = '#ffffff20';
                    ctx.beginPath();
                    ctx.moveTo(x2d, y2d);
                    // Re-project p2 (inefficient to redo here but fine for demo)
                 }
            });
        });

        animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="relative w-full h-full bg-black/90 rounded-xl overflow-hidden border border-white/10">
        <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-cover" />
        
        <div className="absolute bottom-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 shadow-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Vector Space</h3>
            <div className="flex gap-4 text-[10px] font-mono text-muted-foreground">
                <div>
                    <span className="block text-primary-glow">{stats.vectors.toLocaleString()}</span>
                    <span>EMBEDDINGS</span>
                </div>
                <div>
                    <span className="block text-blue-400">{stats.dimensions}</span>
                    <span>DIMENSIONS</span>
                </div>
            </div>
        </div>
    </div>
  );
}
