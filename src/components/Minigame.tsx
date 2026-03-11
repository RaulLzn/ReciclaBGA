import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Text, Cylinder, DragControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEpicStore } from '../store/epicStore';

const TRASH_TYPES = [
  { id: 't1', type: 'white', color: '#38bdf8', label: 'Botella PET', shape: 'cylinder' },
  { id: 't2', type: 'white', color: '#fbbf24', label: 'Cartón limpio', shape: 'box' },
  { id: 't3', type: 'white', color: '#9ca3af', label: 'Lata aluminio', shape: 'cylinder' },
  { id: 't4', type: 'black', color: '#f8fafc', label: 'Servilleta sucia', shape: 'sphere' },
  { id: 't5', type: 'black', color: '#475569', label: 'Empaque papas', shape: 'box' },
  { id: 't6', type: 'black', color: '#cbd5e1', label: 'Cartón graso', shape: 'box' },
  { id: 't7', type: 'green', color: '#ef4444', label: 'Cáscara manzana', shape: 'sphere' },
  { id: 't8', type: 'green', color: '#eab308', label: 'Cáscara plátano', shape: 'cylinder' },
  { id: 't9', type: 'green', color: '#84cc16', label: 'Restos verdura', shape: 'sphere' },
];

function TrashItem({ data, onDrop }: { data: any, onDrop: (id: string, binType: string, actualType: string) => void }) {
  const ref = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initial random X position
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set((Math.random() - 0.5) * 10, 12, 0);
    }
  }, []);

  useFrame((state, delta) => {
    if (!isDragging && ref.current) {
      ref.current.position.y -= delta * 3.5; // Fall speed
      
      // If it falls below the screen, remove it
      if (ref.current.position.y < -2) {
        onDrop(data.instanceId, 'missed', data.type);
      }
    }
  });

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => {
    setIsDragging(false);
    if (ref.current) {
      const x = ref.current.position.x;
      const y = ref.current.position.y;
      
      // Check if dropped near a bin (bins are at y=0, x=-4.5, 0, 4.5)
      if (y < 4) {
        if (x < -2.5) onDrop(data.instanceId, 'white', data.type);
        else if (x > 2.5) onDrop(data.instanceId, 'green', data.type);
        else onDrop(data.instanceId, 'black', data.type);
      }
    }
  };

  return (
    <DragControls axisLock="z" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <group ref={ref}>
        {data.shape === 'box' && <Box args={[0.8, 0.8, 0.8]} castShadow><meshStandardMaterial color={data.color} /></Box>}
        {data.shape === 'sphere' && <Sphere args={[0.5]} castShadow><meshStandardMaterial color={data.color} /></Sphere>}
        {data.shape === 'cylinder' && <Cylinder args={[0.3, 0.3, 1]} castShadow><meshStandardMaterial color={data.color} /></Cylinder>}
        <Text position={[0, 1.2, 0]} fontSize={0.35} color="black" outlineWidth={0.05} outlineColor="white" fontWeight="bold">
          {data.label}
        </Text>
      </group>
    </DragControls>
  );
}

function Bin({ position, color, label }: any) {
  return (
    <group position={position}>
      <Box args={[2.5, 2.5, 2.5]} position={[0, 1.25, 0]} receiveShadow>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Box>
      <Text position={[0, 3.2, 0]} fontSize={0.6} color="white" outlineWidth={0.08} outlineColor="black" fontWeight="bold">
        {label}
      </Text>
    </group>
  );
}

export function Minigame() {
  const [items, setItems] = useState<any[]>([]);
  const { addMinigameScore } = useEpicStore();
  const spawnTimer = useRef(0);

  useFrame((state, delta) => {
    // Set fixed camera for minigame with more space
    state.camera.position.lerp(new THREE.Vector3(0, 7, 16), 0.1);
    state.camera.lookAt(0, 2, 0);

    spawnTimer.current += delta;
    if (spawnTimer.current > 1.2) { // Spawn slightly faster
      spawnTimer.current = 0;
      const randomType = TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)];
      setItems(prev => [...prev, { ...randomType, instanceId: Math.random().toString() }]);
    }
  });

  const handleDrop = (instanceId: string, binType: string, actualType: string) => {
    setItems(prev => prev.filter(item => item.instanceId !== instanceId));
    
    if (binType !== 'missed') {
      if (actualType === binType) {
        addMinigameScore(10); // Correct!
      } else {
        addMinigameScore(-5); // Wrong!
      }
    }
  };

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 10, 5]} intensity={1.2} castShadow />
      
      {/* Background/Floor */}
      <Box args={[40, 40, 1]} position={[0, 10, -3]} receiveShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>
      <Box args={[40, 1, 15]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      {/* Bins */}
      <Bin position={[-4.5, 0, 0]} color="#ffffff" label="Blanca" />
      <Bin position={[0, 0, 0]} color="#1e293b" label="Negra" />
      <Bin position={[4.5, 0, 0]} color="#22c55e" label="Verde" />

      {/* Falling Items */}
      {items.map(item => (
        <TrashItem key={item.instanceId} data={item} onDrop={handleDrop} />
      ))}
    </group>
  );
}
