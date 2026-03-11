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

function DetailedHouse(props: any) {
  return (
    <group {...props}>
      {/* Main Body */}
      <Box args={[4, 3, 4]} position={[0, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fdfbf7" roughness={0.8} />
      </Box>
      {/* Roof */}
      <Cylinder args={[0, 3.5, 2, 4]} position={[0, 4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b3a3a" roughness={0.9} />
      </Cylinder>
      {/* Door */}
      <Box args={[1, 2, 0.1]} position={[0, 1, 2]} castShadow>
        <meshStandardMaterial color="#5c4033" />
      </Box>
      {/* Windows */}
      <Box args={[1, 1, 0.1]} position={[-1, 1.5, 2]} castShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[1, 1, 0.1]} position={[1, 1.5, 2]} castShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Chimney */}
      <Box args={[0.6, 1.5, 0.6]} position={[1, 3.5, -1]} castShadow>
        <meshStandardMaterial color="#a0522d" />
      </Box>
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

export function HomeStage({
  position,
}: {
  position: [number, number, number];
}) {
  const { setActiveInfo } = useAppContext();
  const groupRef = useRef<THREE.Group>(null);

  // Simple animation for floating elements
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Base Platform */}
      <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} receiveShadow>
        <meshStandardMaterial color="#a3e635" /> {/* Grass color */}
      </Box>

      {/* Realistic House */}
      <DetailedHouse position={[-2, 0, -2]} />

      {/* Trees for decoration */}
      <DetailedTree position={[3, 0, -3]} scale={1.5} />
      <DetailedTree position={[-4, 0, 2]} scale={1.2} />

      {/* Recycling Bins */}
      <group ref={groupRef} position={[2, 0, 2]}>
        {/* White Bin - Aprovechables */}
        <group
          position={[-1.5, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "white-bin",
              title: "Caneca Blanca",
              content:
                "Plástico, vidrio, metales, papel y cartón limpios. ¡Fundamental para los recicladores de Bucaramanga!",
              type: "good",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#ffffff" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.2} color="black" outlineWidth={0.02} outlineColor="white">
            Blanca
          </Text>
          <FloatingInfoCard id="white-bin" position={[0, 2, 0]} />
        </group>

        {/* Black Bin - No aprovechables */}
        <group
          position={[0, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "black-bin",
              title: "Caneca Negra",
              content:
                "Papel higiénico, servilletas sucias, papeles metalizados. Esto va al relleno El Carrasco.",
              type: "bad",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#1e293b" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.2} color="black" outlineWidth={0.02} outlineColor="white">
            Negra
          </Text>
          <FloatingInfoCard id="black-bin" position={[0, 2, 0]} />
        </group>

        {/* Green Bin - Orgánicos */}
        <group
          position={[1.5, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "green-bin",
              title: "Caneca Verde",
              content:
                "Restos de comida, cáscaras, desechos agrícolas. ¡Perfecto para compostaje!",
              type: "good",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <ColoredBin color="#22c55e" scale={0.8} />
          <Text position={[0, 1.2, 0]} fontSize={0.2} color="black" outlineWidth={0.02} outlineColor="white">
            Verde
          </Text>
          <FloatingInfoCard id="green-bin" position={[0, 2, 0]} />
        </group>
      </group>
    </group>
  );
}

