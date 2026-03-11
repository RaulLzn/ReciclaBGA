import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshTransmissionMaterial, CameraControls, Stars, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useAppContext, INFO_DATA } from '../store';
import { FloatingInfoCard } from './FloatingInfoCard';

function AccretionDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 40000;
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();
    const colorInner = new THREE.Color("#00f3ff"); // Hot blue/white inside
    const colorOuter = new THREE.Color("#ff4400"); // Fiery orange outside

    for(let i = 0; i < count; i++) {
      // Exponential distribution to cluster near the center
      const radius = 3.5 + Math.pow(Math.random(), 2) * 20;
      const angle = Math.random() * Math.PI * 2;
      
      // Disk gets thinner at the edges
      const thickness = (15 / radius) * (Math.random() - 0.5);
      const y = thickness * Math.random();
      
      pos[i*3] = Math.cos(angle) * radius;
      pos[i*3+1] = y;
      pos[i*3+2] = Math.sin(angle) * radius;

      // Color gradient based on radius
      const t = Math.max(0, 1 - (radius - 3.5) / 15);
      color.lerpColors(colorOuter, colorInner, t);
      
      // Add some random variation to colors
      color.multiplyScalar(0.8 + Math.random() * 0.4);

      col[i*3] = color.r;
      col[i*3+1] = color.g;
      col[i*3+2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate the entire accretion disk slowly
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </points>
  );
}

function BlackHole() {
  return (
    <group>
      {/* The Singularity (Pure Black) */}
      <Sphere args={[2.8, 64, 64]}>
        <meshBasicMaterial color="#000000" />
      </Sphere>
      
      {/* Gravitational Lensing (Distortion Effect) */}
      <Sphere args={[3.4, 64, 64]}>
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={3}
          chromaticAberration={1.5}
          anisotropy={0.5}
          distortion={1.5}
          distortionScale={0.5}
          temporalDistortion={0.2}
          color="#ffffff"
        />
      </Sphere>

      {/* Photon Ring (Intense glowing edge) */}
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[3.4, 3.6, 128]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

function Anomaly({ position, color, id, speed = 1 }: { position: [number, number, number], color: string, id: string, speed?: number }) {
  const { setActiveInfo, activeInfo } = useAppContext();
  const groupRef = useRef<THREE.Group>(null);
  const isActive = activeInfo?.id === id;

  useFrame((state) => {
    if (groupRef.current) {
      // Orbit around the black hole
      const time = state.clock.elapsedTime * speed;
      const radius = Math.hypot(position[0], position[2]);
      const initialAngle = Math.atan2(position[2], position[0]);
      
      groupRef.current.position.x = Math.cos(time + initialAngle) * radius;
      groupRef.current.position.z = Math.sin(time + initialAngle) * radius;
      
      // Bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(time * 2 + initialAngle) * 1.5;

      // Rotation of the object itself
      groupRef.current.rotation.x += 0.02;
      groupRef.current.rotation.y += 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={4} rotationIntensity={2} floatIntensity={2}>
        <mesh 
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo(INFO_DATA[id]);
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={isActive ? 6 : 2} 
            wireframe={!isActive}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Core of the anomaly */}
        <mesh>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <FloatingInfoCard id={id} position={[0, 2, 0]} color={color} />
      </Float>
    </group>
  );
}

export function Experience() {
  const { setActiveInfo } = useAppContext();

  return (
    <Canvas 
      camera={{ position: [0, 12, 30], fov: 45 }}
      onPointerMissed={() => setActiveInfo(null)}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#010103']} />
      <fog attach="fog" args={['#010103', 20, 60]} />
      
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ffffff" />

      <BlackHole />
      <AccretionDust />

      {/* Interactive Anomalies orbiting the black hole */}
      <Anomaly position={[-12, 0, 10]} color="#00f3ff" id="alpha" speed={0.15} />
      <Anomaly position={[15, 3, -8]} color="#ff00e6" id="beta" speed={0.1} />
      <Anomaly position={[-8, -4, -18]} color="#ffaa00" id="gamma" speed={0.08} />

      <Stars radius={50} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={1000} scale={40} size={1.5} speed={0.2} opacity={0.3} color="#ffffff" />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.1} mipmapBlur intensity={2.5} />
        <ChromaticAberration offset={new THREE.Vector2(0.003, 0.003)} />
        <Noise opacity={0.08} />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>

      <CameraControls 
        maxPolarAngle={Math.PI / 1.5} 
        minDistance={10} 
        maxDistance={50}
        makeDefault
      />
    </Canvas>
  );
}
