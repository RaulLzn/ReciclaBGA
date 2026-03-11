import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { useAppContext } from "../../store";
import { FloatingInfoCard } from "../FloatingInfoCard";

function ColoredBin({ color, ...props }: any) {
  return (
    <group {...props}>
      {/* Bin Body */}
      <Cylinder args={[0.4, 0.35, 1.2, 32]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </Cylinder>
      {/* Bin Lid */}
      <Cylinder args={[0.42, 0.42, 0.1, 32]} position={[0, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </Cylinder>
      {/* Lid Handle */}
      <Box args={[0.3, 0.05, 0.1]} position={[0, 0.72, 0]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      {/* Ribs */}
      <Cylinder args={[0.41, 0.41, 0.05, 32]} position={[0, 0.3, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.4} />
      </Cylinder>
      <Cylinder args={[0.39, 0.39, 0.05, 32]} position={[0, -0.3, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.4} />
      </Cylinder>
    </group>
  );
}

function DetailedTree(props: any) {
  return (
    <group {...props}>
      {/* Trunk */}
      <Cylinder args={[0.2, 0.3, 1.5, 8]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </Cylinder>
      {/* Leaves */}
      <Sphere args={[1.2, 16, 16]} position={[0, 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2e8b57" roughness={0.8} />
      </Sphere>
      <Sphere args={[0.8, 16, 16]} position={[0.6, 1.8, 0.6]} castShadow receiveShadow>
        <meshStandardMaterial color="#228b22" roughness={0.8} />
      </Sphere>
      <Sphere args={[0.9, 16, 16]} position={[-0.5, 2.2, -0.5]} castShadow receiveShadow>
        <meshStandardMaterial color="#3cb371" roughness={0.8} />
      </Sphere>
    </group>
  );
}

function DetailedBench(props: any) {
  return (
    <group {...props}>
      {/* Seat */}
      <Box args={[2, 0.1, 0.6]} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </Box>
      {/* Backrest */}
      <Box args={[2, 0.6, 0.1]} position={[0, 0.8, -0.25]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </Box>
      {/* Legs */}
      <Box args={[0.1, 0.5, 0.6]} position={[-0.8, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#2f4f4f" metalness={0.5} />
      </Box>
      <Box args={[0.1, 0.5, 0.6]} position={[0.8, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#2f4f4f" metalness={0.5} />
      </Box>
    </group>
  );
}

export function PublicStage({
  position,
}: {
  position: [number, number, number];
}) {
  const { setActiveInfo } = useAppContext();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Base Platform */}
      <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} receiveShadow>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>

      {/* Park/Public Space Elements */}
      <DetailedBench position={[-2, 0, -2]} rotation={[0, Math.PI / 4, 0]} scale={1.5} />
      
      <DetailedTree position={[-3, 0, -3]} scale={1.2} />

      {/* Public Eco Point */}
      <group ref={groupRef} position={[2, 0, 2]}>
        {/* Structure */}
        <Box args={[4, 2, 1.5]} position={[0, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f1f5f9" />
        </Box>
        <Box args={[4.2, 0.2, 1.7]} position={[0, 2.1, 0]} castShadow>
          <meshStandardMaterial color="#0f172a" />
        </Box>

        {/* Bins */}
        <group
          position={[-1.2, 0.6, 0.5]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "public-white",
              title: "Punto Blanco",
              content:
                "Botellas de agua, latas de gaseosa, papel de apuntes. Asegúrate de vaciar los líquidos antes.",
              type: "info",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#ffffff" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.15} color="black" outlineWidth={0.02} outlineColor="white">
            Aprovechables
          </Text>
          <FloatingInfoCard id="public-white" position={[0, 2, 0]} />
        </group>

        <group
          position={[0, 0.6, 0.5]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "public-black",
              title: "Punto Negro",
              content:
                "Empaques de snacks metalizados, chicles, servilletas de la cafetería.",
              type: "info",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#1e293b" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.15} color="black" outlineWidth={0.02} outlineColor="white">
            No Aprovechables
          </Text>
          <FloatingInfoCard id="public-black" position={[0, 2, 0]} />
        </group>

        <group
          position={[1.2, 0.6, 0.5]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "public-green",
              title: "Punto Verde",
              content:
                "Restos de frutas, borra de café. Ayuda a crear abono para los parques de la ciudad.",
              type: "info",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#22c55e" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.15} color="black" outlineWidth={0.02} outlineColor="white">
            Orgánicos
          </Text>
          <FloatingInfoCard id="public-green" position={[0, 2, 0]} />
        </group>
      </group>
    </group>
  );
}
