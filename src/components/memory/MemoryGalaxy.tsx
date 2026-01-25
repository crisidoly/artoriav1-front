import { api } from "@/lib/api";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// --- TYPES ---
interface MemoryNode {
  id: string;
  label: string;
  type: 'core' | 'fact' | 'ephemeral';
  position: [number, number, number];
  connections: string[];
  qualityScore?: number;
  accessCount?: number;
}

function Node({ node, isActive, onClick }: { node: MemoryNode; isActive: boolean; onClick: (node: MemoryNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
        // Subtle drift
        meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + node.position[0]) * 0.05;
    }
  });

  const color = useMemo(() => {
    if (isActive) return "#facc15"; // Yellow
    if (hovered) return "#60a5fa"; // Blue hover
    
    // Scale color by qualityScore
    const quality = node.qualityScore || 1.0;
    if (quality > 1.2) return "#a855f7"; // Purple (High quality)
    if (quality < 0.9) return "#f43f5e"; // Rose (Low quality)
    return "#3b82f6"; // Primary blue
  }, [node.qualityScore, hovered, isActive]);

  // Size influenced by popularity (accessCount)
  const baseSize = node.type === 'core' ? 0.6 : 0.4;
  const popularityBonus = Math.min((node.accessCount || 0) * 0.05, 0.4);
  const size = baseSize + popularityBonus;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(node); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={hovered || isActive ? 1 : 0.3} 
            transparent
            opacity={0.8}
        />
      </mesh>
      {(hovered || isActive) && (
        <Text
            position={[0, size + 0.4, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
        >
            {node.label}
        </Text>
      )}
    </group>
  );
}

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#4f46e5" transparent opacity={0.1} />
    </line>
  );
}

function Scene({ onSelectNode }: { onSelectNode: (node: MemoryNode) => void }) {
  const [nodes, setNodes] = useState<MemoryNode[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
        try {
            const res = await api.get('/api/rag/nodes');
            const data = res.data;
            const mappedNodes = data.map((n: any, i: number) => ({
                id: n.id,
                label: n.document?.fileName || "Untitled Chunk",
                type: n.qualityScore > 1.2 ? 'core' : 'fact',
                // Distribute in a spiral/sphere
                position: [
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15
                ],
                connections: [],
                qualityScore: n.qualityScore,
                accessCount: n.accessCount
            }));
            setNodes(mappedNodes);
        } catch (err) {
            console.error("Failed to fetch knowledge nodes", err);
        } finally {
            setLoading(false);
        }
    };
    fetchNodes();
  }, []);

  const handleNodeClick = (node: MemoryNode) => {
    setActiveId(node.id);
    onSelectNode(node);
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      
      {nodes.map(node => (
        <Node 
            key={node.id} 
            node={node} 
            isActive={activeId === node.id} 
            onClick={handleNodeClick} 
        />
      ))}

      {/* Basic random connections for visual effect */}
      {nodes.slice(0, 15).map((node, i) => {
          const nextNode = nodes[i + 1];
          if (!nextNode) return null;
          return <Connection key={i} start={node.position} end={nextNode.position} />;
      })}
      
      <OrbitControls autoRotate autoRotateSpeed={0.2} enablePan={true} enableZoom={true} />
    </>
  );
}

export function MemoryGalaxy({ onSelectNode }: { onSelectNode: (node: any) => void }) {
  return (
    <div className="w-full h-full bg-slate-950">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Scene onSelectNode={onSelectNode} />
      </Canvas>
      <div className="absolute bottom-4 right-4 text-[10px] text-white/20 uppercase tracking-[0.2em] font-mono">
        ArtorIA Neural Map v2.0
      </div>
    </div>
  );
}
