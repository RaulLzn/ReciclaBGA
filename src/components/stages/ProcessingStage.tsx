import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { useAppContext } from "../../store";
import { FloatingInfoCard } from "../FloatingInfoCard";

function DetailedBale(props: any) {
  return (
    <group {...props}>
      <Box args={[1, 1, 1]} castShadow receiveShadow>
        <meshStandardMaterial color={props.color || "#fbbf24"} roughness={0.9} />
      </Box>
      {/* Straps */}
      <Box args={[1.02, 0.05, 1.02]} position={[0, 0.2, 0]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[1.02, 0.05, 1.02]} position={[0, -0.2, 0]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[1.02, 1.02, 0.05]} position={[0, 0, 0.2]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[1.02, 1.02, 0.05]} position={[0, 0, -0.2]} castShadow>
        <meshStandardMaterial color="#333" />
      </Box>
    </group>
  );
}

export function ProcessingStage({
  position,
}: {
  position: [number, number, number];
}) {
  const { setActiveInfo } = useAppContext();
  const conveyorRef = useRef<THREE.Group>(null);
  const itemsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (itemsRef.current) {
      // Move items along conveyor belt
      itemsRef.current.children.forEach((child, i) => {
        child.position.x += 0.02;
        if (child.position.x > 2) {
          child.position.x = -2;
        }
      });
    }
  });

  return (
    <group position={position}>
      {/* Base Platform */}
      <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} receiveShadow>
        <meshStandardMaterial color="#64748b" />
      </Box>

      {/* Factory Building */}
      <group position={[0, 0, -2]}>
        <Box args={[8, 4, 4]} position={[0, 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#f8fafc" />
        </Box>
        {/* Factory Roof */}
        <Cylinder
          args={[2, 2, 8, 3]}
          position={[0, 4.5, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <meshStandardMaterial color="#94a3b8" />
        </Cylinder>
      </group>

      {/* Conveyor Belt */}
      <group
        ref={conveyorRef}
        position={[0, 1, 2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveInfo({
            id: "conveyor",
            title: "Clasificación Final",
            content:
              "En las plantas, el material se separa por tipos (PET, cartón, vidrio, metales) y se compacta en pacas para la industria.",
            type: "info",
          });
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        {/* Belt */}
        <Box args={[5, 0.2, 1]} position={[0, 0, 0]} castShadow>
          <meshStandardMaterial color="#334155" />
        </Box>
        {/* Supports */}
        <Box args={[0.2, 1, 0.8]} position={[-2, -0.5, 0]} castShadow>
          <meshStandardMaterial color="#94a3b8" />
        </Box>
        <Box args={[0.2, 1, 0.8]} position={[2, -0.5, 0]} castShadow>
          <meshStandardMaterial color="#94a3b8" />
        </Box>

        {/* Moving Items */}
        <group ref={itemsRef}>
          <Box args={[0.4, 0.4, 0.4]} position={[-1.5, 0.3, 0]} castShadow>
            <meshStandardMaterial color="#3b82f6" />
          </Box>
          <Cylinder
            args={[0.2, 0.2, 0.4, 8]}
            position={[0, 0.3, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="#22c55e" />
          </Cylinder>
          <Box args={[0.5, 0.2, 0.5]} position={[1.5, 0.2, 0]} castShadow>
            <meshStandardMaterial color="#eab308" />
          </Box>
        </group>
        <FloatingInfoCard id="conveyor" position={[0, 2, 0]} />
      </group>

      {/* Compacted Bales */}
      <group
        position={[3, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveInfo({
            id: "bales",
            title: "Materia Prima",
            content:
              "El material compactado se vende a industrias que lo transforman en nuevos productos, cerrando el ciclo de la economía circular.",
            type: "good",
          });
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <DetailedBale position={[0, 0.5, 0]} color="#fbbf24" />
        <DetailedBale position={[0, 1.5, 0]} color="#fbbf24" />
        <DetailedBale position={[1.1, 0.5, 0]} color="#60a5fa" />
        <Text position={[0.5, 2.5, 0]} fontSize={0.2} color="black" outlineWidth={0.02} outlineColor="white">
          Pacas Listas
        </Text>
        <FloatingInfoCard id="bales" position={[0.5, 3.5, 0]} />
      </group>
    </group>
  );
}
