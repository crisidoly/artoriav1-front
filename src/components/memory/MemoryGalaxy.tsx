"use client";

import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// --- TYPES ---
interface MemoryNode {
  id: string;
  label: string;
  type: 'core' | 'fact' | 'ephemeral';
  position: [number, number, number];
  connections: string[];
}

// --- MOCK DATA ---
const INITIAL_NODES: MemoryNode[] = [
  { id: 'user', label: 'User (You)', type: 'core', position: [0, 0, 0], connections: ['work', 'health', 'home'] },
  { id: 'work', label: 'Work', type: 'fact', position: [2, 1, 0], connections: ['user', 'project_alpha'] },
  { id: 'project_alpha', label: 'Project Alpha', type: 'ephemeral', position: [3, 2, 1], connections: ['work'] },
  { id: 'health', label: 'Health', type: 'fact', position: [-2, 1, 1], connections: ['user', 'gym'] },
  { id: 'gym', label: 'Gym Schedule', type: 'ephemeral', position: [-3, 2, 2], connections: ['health'] },
  { id: 'home', label: 'Home', type: 'fact', position: [0, -2, 1], connections: ['user', 'iot'] },
  { id: 'iot', label: 'IoT Devices', type: 'ephemeral', position: [1, -3, 2], connections: ['home'] },
];

function Node({ node, isActive, onClick }: { node: MemoryNode; isActive: boolean; onClick: (id: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (node.type === 'core') {
        meshRef.current.rotation.y += 0.01;
      } else {
        // Floating animation
        meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.position[0]) * 0.1;
      }
    }
  });

  const color = useMemo(() => {
    if (isActive) return "#facc15"; // Yellow
    if (hovered) return "#60a5fa"; // Blue hover
    switch (node.type) {
      case 'core': return "#ef4444"; // Red
      case 'fact': return "#3b82f6"; // Blue
      default: return "#10b981"; // Green
    }
  }, [node.type, hovered, isActive]);

  const size = node.type === 'core' ? 0.8 : node.type === 'fact' ? 0.5 : 0.3;

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.8 : 0.2} wireframe={node.type === 'ephemeral'} />
      </mesh>
      <Text
        position={[0, size + 0.4, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.label}
      </Text>
    </group>
  );
}

function Connection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const ref = useRef<THREE.Line>(null);
  
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="rgba(255,255,255,0.2)" transparent opacity={0.3} />
    </line>
  );
}

function Scene({ onSelectNode }: { onSelectNode: (node: MemoryNode) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleNodeClick = (id: string) => {
    setActiveId(id);
    const node = INITIAL_NODES.find(n => n.id === id);
    if (node) onSelectNode(node);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {INITIAL_NODES.map(node => (
        <Node 
            key={node.id} 
            node={node} 
            isActive={activeId === node.id} 
            onClick={handleNodeClick} 
        />
      ))}

      {INITIAL_NODES.map(node => 
        node.connections.map(targetId => {
          const target = INITIAL_NODES.find(n => n.id === targetId);
          if (!target || node.id === target.id) return null; // Avoid self or missing
          // Draw connection only once (e.g., if id < targetId string compare) to avoid double lines? 
          // For now, simpler to just draw all connection definitions.
          return (
            <Connection 
                key={`${node.id}-${target.id}`} 
                start={node.position} 
                end={target.position} 
            />
          );
        })
      )}
      
      <OrbitControls autoRotate autoRotateSpeed={0.5} enablePan={true} enableZoom={true} />
    </>
  );
}

export function MemoryGalaxy({ onSelectNode }: { onSelectNode: (node: any) => void }) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Scene onSelectNode={onSelectNode} />
      </Canvas>
    </div>
  );
}
