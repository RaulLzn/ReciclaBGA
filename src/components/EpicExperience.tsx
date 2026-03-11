import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  CameraControls,
  Text,
  Cylinder,
  Box,
  Sphere,
  Sky,
  ContactShadows,
  Torus
} from "@react-three/drei";
import * as THREE from "three";
import { useEpicStore, ZONES, ZoneId } from "../store/epicStore";
import { EnvironmentController } from "./EnvironmentController";
import { Minigame } from "./Minigame";
import { ScatteredTrash } from "./ScatteredTrash";

// --- REALISTIC LOW-POLY COMPONENTS ---

function RealisticBin({ position, color, label, onClick }: any) {
  return (
    <group 
      position={position} 
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <Cylinder args={[0.3, 0.25, 0.8, 32]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </Cylinder>
      <Cylinder args={[0.32, 0.32, 0.1, 32]} position={[0, 0.45, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </Cylinder>
      <Text position={[0, 0.8, 0]} fontSize={0.15} color="black" outlineWidth={0.02} outlineColor="white" anchorY="bottom">
        {label}
      </Text>
    </group>
  );
}

function DetailedTree({ position, scale = 1 }: any) {
  const discoveredTips = useEpicStore(state => state.discoveredTips);
  const cleanliness = Math.min(1, discoveredTips.length / 11);
  
  // Trees grow as cleanliness increases
  const currentScale = 0.2 + cleanliness * 0.8 * scale;
  const leafColor = new THREE.Color().lerpColors(
    new THREE.Color("#8b7355"), // Brown/dead
    new THREE.Color("#2e8b57"), // Green/alive
    cleanliness
  );

  return (
    <group position={position} scale={currentScale}>
      <Cylinder args={[0.2, 0.3, 1.5, 8]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </Cylinder>
      <Sphere args={[1.2, 16, 16]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={leafColor} roughness={0.8} />
      </Sphere>
      <Sphere args={[0.8, 16, 16]} position={[0.6, 1.8, 0.6]} castShadow receiveShadow>
        <meshStandardMaterial color={leafColor.clone().offsetHSL(0, 0, -0.1)} roughness={0.8} />
      </Sphere>
      <Sphere args={[0.9, 16, 16]} position={[-0.5, 2.2, -0.5]} castShadow receiveShadow>
        <meshStandardMaterial color={leafColor.clone().offsetHSL(0, 0, 0.1)} roughness={0.8} />
      </Sphere>
    </group>
  );
}

function RealisticHouse({ position }: any) {
  return (
    <group position={position}>
      <Box args={[3, 2.5, 3]} position={[0, 1.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fdfbf7" roughness={0.9} />
      </Box>
      <Cylinder args={[0, 2.8, 1.5, 4]} position={[0, 3.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b3a3a" roughness={0.9} />
      </Cylinder>
      <Box args={[0.8, 1.6, 0.1]} position={[0, 0.8, 1.5]} castShadow>
        <meshStandardMaterial color="#5c4033" />
      </Box>
      <Box args={[0.8, 0.8, 0.1]} position={[-0.8, 1.2, 1.5]} castShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[0.8, 0.8, 0.1]} position={[0.8, 1.2, 1.5]} castShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.2} />
      </Box>
    </group>
  );
}

function RealisticUniversity({ position }: any) {
  return (
    <group position={position}>
      {/* Main building */}
      <Box args={[4, 3, 3]} position={[0, 1.5, -0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.1} />
      </Box>
      {/* Glass facade */}
      <Box args={[3.8, 2.8, 0.1]} position={[0, 1.5, 1.01]} castShadow>
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </Box>
      {/* Entrance */}
      <Box args={[1.5, 1, 1]} position={[0, 0.5, 1.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      {/* Side building */}
      <Box args={[2, 4, 2]} position={[-2, 2, -1]} castShadow receiveShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </Box>
    </group>
  );
}

function RealisticFactory({ position }: any) {
  return (
    <group position={position}>
      {/* Warehouse */}
      <Box args={[5, 2.5, 4]} position={[0, 1.25, -1]} castShadow receiveShadow>
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      </Box>
      {/* Curved Roof */}
      <Cylinder args={[2, 2, 5, 16, 1, false, 0, Math.PI]} position={[0, 2.5, -1]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.4} />
      </Cylinder>
      {/* Conveyor */}
      <Box args={[4, 0.2, 0.8]} position={[0, 0.5, 2]} castShadow>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[0.2, 0.5, 0.8]} position={[-1.8, 0.25, 2]} castShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      <Box args={[0.2, 0.5, 0.8]} position={[1.8, 0.25, 2]} castShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
    </group>
  );
}

function Bale({ position, color, onClick }: any) {
  return (
    <Box 
      args={[0.8, 0.8, 0.8]} 
      position={position} 
      castShadow 
      receiveShadow
      onClick={onClick}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <meshStandardMaterial color={color} roughness={0.9} />
      {/* Straps */}
      <Box args={[0.82, 0.05, 0.82]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.82, 0.05, 0.82]} position={[0, -0.2, 0]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
    </Box>
  );
}

// --- ANIMATED COMPONENTS ---

function Person({ position, rotation = [0, 0, 0], color, shirtColor, onClick, triggers = [] }: any) {
  const group = useRef<THREE.Group>(null);
  const animatingId = useEpicStore(state => state.animatingId);
  const isJumping = triggers.includes(animatingId);

  useFrame(({ clock }) => {
    if (group.current) {
      if (isJumping) {
        group.current.position.y = position[1] + Math.abs(Math.sin(clock.elapsedTime * 15)) * 0.5;
      } else {
        group.current.position.y = position[1];
      }
    }
  });

  return (
    <group 
      ref={group} 
      position={position} 
      rotation={rotation} 
      onClick={onClick}
      onPointerOver={() => document.body.style.cursor='pointer'} 
      onPointerOut={() => document.body.style.cursor='auto'}
    >
      {/* Head */}
      <Sphere args={[0.2]} position={[0, 1.2, 0]} castShadow><meshStandardMaterial color={color} /></Sphere>
      {/* Body */}
      <Box args={[0.4, 0.6, 0.2]} position={[0, 0.7, 0]} castShadow><meshStandardMaterial color={shirtColor} /></Box>
      {/* Legs */}
      <Cylinder args={[0.08, 0.08, 0.4]} position={[-0.1, 0.2, 0]} castShadow><meshStandardMaterial color="#333" /></Cylinder>
      <Cylinder args={[0.08, 0.08, 0.4]} position={[0.1, 0.2, 0]} castShadow><meshStandardMaterial color="#333" /></Cylinder>
    </group>
  );
}

function FlyingTrash({ source, target, triggerId, color }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const animatingId = useEpicStore(state => state.animatingId);
  const isFlying = animatingId === triggerId;
  const startTime = useRef(0);

  useEffect(() => {
    if (isFlying) startTime.current = performance.now();
  }, [isFlying]);

  useFrame(() => {
    if (ref.current) {
      if (isFlying) {
        const elapsed = (performance.now() - startTime.current) / 1000;
        if (elapsed < 1.0) {
          ref.current.visible = true;
          const t = elapsed;
          ref.current.position.x = THREE.MathUtils.lerp(source[0], target[0], t);
          ref.current.position.z = THREE.MathUtils.lerp(source[2], target[2], t);
          ref.current.position.y = THREE.MathUtils.lerp(source[1], target[1], t) + Math.sin(t * Math.PI) * 2;
          ref.current.rotation.x += 0.1;
          ref.current.rotation.y += 0.1;
        } else {
          ref.current.visible = false;
        }
      } else {
        ref.current.visible = false;
      }
    }
  });

  return (
    <Box ref={ref} args={[0.15, 0.15, 0.15]} visible={false} castShadow>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

function AnimatedTruck({ onClick }: any) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * 0.4;
      const nextT = t + 0.05;
      const r = 14;
      ref.current.position.set(Math.cos(t) * r, 0, Math.sin(t) * r);
      ref.current.lookAt(Math.cos(nextT) * r, 0, Math.sin(nextT) * r);
    }
  });

  return (
    <group 
      ref={ref} 
      onClick={onClick} 
      onPointerOver={() => document.body.style.cursor='pointer'} 
      onPointerOut={() => document.body.style.cursor='auto'}
    >
      {/* Cab */}
      <Box args={[1.5, 1.5, 1.5]} position={[0, 1, 1.5]} castShadow><meshStandardMaterial color="#e2e8f0" /></Box>
      {/* Body */}
      <Box args={[2, 2, 3]} position={[0, 1.25, -1]} castShadow><meshStandardMaterial color="#22c55e" /></Box>
      {/* Wheels */}
      <Cylinder args={[0.4, 0.4, 2.2]} rotation={[0, 0, Math.PI/2]} position={[0, 0.4, 1.5]} castShadow><meshStandardMaterial color="#1e293b" /></Cylinder>
      <Cylinder args={[0.4, 0.4, 2.2]} rotation={[0, 0, Math.PI/2]} position={[0, 0.4, -1.5]} castShadow><meshStandardMaterial color="#1e293b" /></Cylinder>
    </group>
  );
}

function AnimatedConveyorItem() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.elapsedTime % 2) / 2; // 0 to 1
      ref.current.position.z = THREE.MathUtils.lerp(3, 1, t);
      if (t > 0.9) ref.current.visible = false;
      else ref.current.visible = true;
    }
  });
  return (
    <Box ref={ref} args={[0.4, 0.4, 0.4]} position={[0, 0.8, 3]} castShadow>
      <meshStandardMaterial color="#38bdf8" />
    </Box>
  );
}

// --- MAIN SCENE ---

function CityDiorama() {
  const { setActiveZone, discoverTip, triggerAnimation, discoveredTips } = useEpicStore();
  const cleanliness = Math.min(1, discoveredTips.length / 11);
  
  const grassColor = new THREE.Color().lerpColors(
    new THREE.Color("#6b5e44"), // Dead grass
    new THREE.Color("#a3e635"), // Vibrant grass
    cleanliness
  );

  const handleInteract = (e: any, tipId: string) => {
    e.stopPropagation();
    discoverTip(tipId);
    triggerAnimation(tipId);
  };

  return (
    <group>
      {/* Main Diorama Base */}
      <Box args={[40, 1, 40]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color={grassColor} roughness={0.8} /> {/* Grass */}
      </Box>
      
      {/* Scattered Trash that disappears as you progress */}
      <ScatteredTrash />

      {/* Circular Road */}
      <Torus args={[14, 1.5, 4, 64]} rotation={[Math.PI/2, 0, 0]} position={[0, -0.49, 0]} receiveShadow>
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </Torus>

      {/* Animated Truck on the road */}
      <AnimatedTruck onClick={(e: any) => handleInteract(e, 'o-truck')} />

      {/* --- ZONE 1: HOME --- */}
      <group position={[-10, 0, 10]} onClick={(e) => { e.stopPropagation(); setActiveZone('home'); }}>
        <RealisticHouse position={[0, 0, -2]} />
        <DetailedTree position={[-2.5, 0, -1]} scale={0.8} />
        <DetailedTree position={[2.5, 0, -2]} scale={1.2} />
        
        {/* Doña Marta */}
        <Person 
          position={[-2, 0, 2]} 
          rotation={[0, Math.PI/4, 0]} 
          color="#ffccaa" 
          shirtColor="#ec4899" 
          onClick={(e: any) => handleInteract(e, 'h-marta')} 
          triggers={['h-marta', 'h-white', 'h-black', 'h-green']}
        />

        <RealisticBin position={[-1, 0.4, 1]} color="#ffffff" label="Blanca" onClick={(e: any) => handleInteract(e, 'h-white')} />
        <RealisticBin position={[0, 0.4, 1]} color="#1e293b" label="Negra" onClick={(e: any) => handleInteract(e, 'h-black')} />
        <RealisticBin position={[1, 0.4, 1]} color="#22c55e" label="Verde" onClick={(e: any) => handleInteract(e, 'h-green')} />
        
        {/* Flying Trash Animations */}
        <FlyingTrash source={[-2, 1, 2]} target={[-1, 0.4, 1]} triggerId="h-white" color="#38bdf8" />
        <FlyingTrash source={[-2, 1, 2]} target={[0, 0.4, 1]} triggerId="h-black" color="#94a3b8" />
        <FlyingTrash source={[-2, 1, 2]} target={[1, 0.4, 1]} triggerId="h-green" color="#facc15" />

        <Text position={[0, 0.05, 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="white" outlineWidth={0.02} outlineColor="black">
          EL HOGAR
        </Text>
      </group>

      {/* --- ZONE 2: UNIVERSITY --- */}
      <group position={[10, 0, 10]} onClick={(e) => { e.stopPropagation(); setActiveZone('university'); }}>
        <RealisticUniversity position={[0, 0, -1]} />
        <DetailedTree position={[-3, 0, -2]} scale={1} />
        <DetailedTree position={[3, 0, 0]} scale={0.9} />

        {/* Estudiante Juan */}
        <Person 
          position={[2, 0, 2]} 
          rotation={[0, -Math.PI/4, 0]} 
          color="#ffccaa" 
          shirtColor="#3b82f6" 
          onClick={(e: any) => handleInteract(e, 'u-juan')} 
          triggers={['u-juan', 'u-liquid', 'u-snack']}
        />

        <RealisticBin position={[-0.5, 0.4, 2]} color="#ffffff" label="Aprovechables" onClick={(e: any) => handleInteract(e, 'u-liquid')} />
        <RealisticBin position={[0.5, 0.4, 2]} color="#1e293b" label="No Aprovechables" onClick={(e: any) => handleInteract(e, 'u-snack')} />
        
        <FlyingTrash source={[2, 1, 2]} target={[-0.5, 0.4, 2]} triggerId="u-liquid" color="#38bdf8" />
        <FlyingTrash source={[2, 1, 2]} target={[0.5, 0.4, 2]} triggerId="u-snack" color="#ef4444" />

        <Text position={[0, 0.05, 4]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="white" outlineWidth={0.02} outlineColor="black">
          UNIVERSIDAD
        </Text>
      </group>

      {/* --- ZONE 3: PROCESSING --- */}
      <group position={[0, 0, -10]} onClick={(e) => { e.stopPropagation(); setActiveZone('processing'); }}>
        <RealisticFactory position={[0, 0, -1]} />
        <AnimatedConveyorItem />
        
        {/* Reciclador Carlos */}
        <Person 
          position={[2, 0, 2]} 
          rotation={[0, -Math.PI/2, 0]} 
          color="#8b5a2b" 
          shirtColor="#f97316" 
          onClick={(e: any) => handleInteract(e, 'p-carlos')} 
          triggers={['p-carlos', 'p-pet', 'p-trans']}
        />

        <Bale position={[-1, 0.4, 2]} color="#fbbf24" onClick={(e: any) => handleInteract(e, 'p-pet')} />
        <Bale position={[0, 0.4, 2]} color="#60a5fa" onClick={(e: any) => handleInteract(e, 'p-trans')} />
        <Bale position={[-0.5, 1.2, 2]} color="#fbbf24" onClick={(e: any) => handleInteract(e, 'p-pet')} />
        
        <Text position={[0, 0.05, 4]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="white" outlineWidth={0.02} outlineColor="black">
          PLANTA ECA
        </Text>
      </group>
    </group>
  );
}

function CameraRig() {
  const controlsRef = useRef<CameraControls>(null);
  const activeZone = useEpicStore((state) => state.activeZone);

  useEffect(() => {
    if (controlsRef.current) {
      const zone = ZONES[activeZone];
      controlsRef.current.setLookAt(
        zone.cameraPos[0], zone.cameraPos[1], zone.cameraPos[2],
        zone.targetPos[0], zone.targetPos[1], zone.targetPos[2],
        true // smooth transition
      );
    }
  }, [activeZone]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      minDistance={2} 
      maxDistance={60} 
      maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
      dollySpeed={0.5}
    />
  );
}

export function EpicExperience() {
  const setActiveZone = useEpicStore((state) => state.setActiveZone);
  const isMinigameActive = useEpicStore((state) => state.isMinigameActive);

  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 22, 28], fov: 45 }}
      onPointerMissed={() => setActiveZone('overview')}
    >
      {isMinigameActive ? (
        <Minigame />
      ) : (
        <>
          <EnvironmentController />
          <Environment preset="city" />

          <CityDiorama />
          <CameraRig />
          
          <ContactShadows position={[0, -0.49, 0]} opacity={0.4} scale={50} blur={2} far={4} />
        </>
      )}
    </Canvas>
  );
}
