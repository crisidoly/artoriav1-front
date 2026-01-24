"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  group: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export function TopologyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Nodes configuration
    const nodes = [
        { id: "Core", x: 300, y: 200, color: "#a855f7" }, // Purple
        { id: "Network", x: 150, y: 100, color: "#3b82f6" }, // Blue
        { id: "Database", x: 450, y: 100, color: "#eab308" }, // Yellow
        { id: "Security", x: 150, y: 300, color: "#ef4444" }, // Red
        { id: "UI", x: 450, y: 300, color: "#10b981" }, // Green
    ];

    // Connections
    const links = [
        { source: "Core", target: "Network" },
        { source: "Core", target: "Database" },
        { source: "Core", target: "Security" },
        { source: "Core", target: "UI" },
        { source: "Network", target: "Security" },
    ];

    const render = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.lineWidth = 1;
        links.forEach(link => {
            const source = nodes.find(n => n.id === link.source)!;
            const target = nodes.find(n => n.id === link.target)!;
            
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            
            // Dynamic pulse effect on lines
            const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
            gradient.addColorStop(0, `${source.color}20`);
            gradient.addColorStop(0.5, "#ffffff40");
            gradient.addColorStop(1, `${target.color}20`);
            
            ctx.strokeStyle = gradient;
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(node => {
            // Glow
            const gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 20);
            gradient.addColorStop(0, node.color);
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
            ctx.fill();

            // Core
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = "#ffffff80";
            ctx.font = "10px monospace";
            ctx.fillText(node.id, node.x - 10, node.y + 25);
        });

        // Animate nodes slightly
        nodes.forEach(node => {
            node.x += Math.sin(Date.now() / 1000 + nodes.indexOf(node)) * 0.2;
            node.y += Math.cos(Date.now() / 1000 + nodes.indexOf(node)) * 0.2;
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-full h-full bg-black/40 rounded-xl border border-white/5 overflow-hidden">
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={400} 
            className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <span className="text-[10px] text-green-400 font-mono animate-pulse">● LIVE TOPOLOGY</span>
        </div>
    </div>
  );
}
