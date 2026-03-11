import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { useAppContext } from "../../store";
import { FloatingInfoCard } from "../FloatingInfoCard";

function DetailedTruck(props: any) {
  return (
    <group {...props}>
      {/* Cab */}
      <Box args={[1.5, 1.5, 1.5]} position={[-1.5, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eab308" metalness={0.2} roughness={0.5} />
      </Box>
      {/* Windshield */}
      <Box args={[0.1, 0.8, 1.3]} position={[-2.25, 1, 0]} castShadow>
        <meshStandardMaterial color="#87ceeb" metalness={0.8} roughness={0.2} />
      </Box>
      {/* Container */}
      <Box args={[3, 2, 1.8]} position={[0.5, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#22c55e" metalness={0.1} roughness={0.6} />
      </Box>
      <Text position={[0.5, 1, 0.91]} fontSize={0.3} color="white" outlineWidth={0.02} outlineColor="black">
        RECICLAJE
      </Text>
      {/* Wheels */}
      <Cylinder args={[0.4, 0.4, 0.3, 16]} position={[-1.5, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3, 16]} position={[-1.5, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3, 16]} position={[1.5, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.4, 0.4, 0.3, 16]} position={[1.5, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </Cylinder>
    </group>
  );
}

function DetailedCart(props: any) {
  return (
    <group {...props}>
      {/* Cart Body */}
      <Box args={[1.5, 0.8, 1]} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8b5cf6" roughness={0.7} />
      </Box>
      {/* Handle */}
      <Cylinder args={[0.05, 0.05, 1, 8]} position={[-0.8, 1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </Cylinder>
      {/* Wheels */}
      <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0.2, 0.3, 0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.1, 16]} position={[0.2, 0.3, -0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Cylinder>
      {/* Cargo (Boxes inside) */}
      <Box args={[0.6, 0.5, 0.6]} position={[0.2, 1.1, 0]} castShadow>
        <meshStandardMaterial color="#d2b48c" />
      </Box>
      <Box args={[0.5, 0.4, 0.5]} position={[-0.3, 1.1, 0.1]} rotation={[0, Math.PI / 6, 0]} castShadow>
        <meshStandardMaterial color="#d2b48c" />
      </Box>
    </group>
  );
}

export function CollectionStage({
  position,
}: {
  position: [number, number, number];
}) {
  const { setActiveInfo } = useAppContext();
  const truckRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (truckRef.current) {
      // Move truck back and forth slightly
      truckRef.current.position.x = Math.sin(state.clock.elapsedTime) * 1;
    }
  });

  return (
    <group position={position}>
      {/* Base Platform */}
      <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} receiveShadow>
        <meshStandardMaterial color="#94a3b8" />
      </Box>

      {/* Road */}
      <Box args={[10, 0.51, 4]} position={[0, -0.25, 2]} receiveShadow>
        <meshStandardMaterial color="#334155" />
      </Box>
      {/* Road lines */}
      <Box args={[2, 0.52, 0.2]} position={[-3, -0.25, 2]}>
        <meshStandardMaterial color="#fcd34d" />
      </Box>
      <Box args={[2, 0.52, 0.2]} position={[0, -0.25, 2]}>
        <meshStandardMaterial color="#fcd34d" />
      </Box>
      <Box args={[2, 0.52, 0.2]} position={[3, -0.25, 2]}>
        <meshStandardMaterial color="#fcd34d" />
      </Box>

      {/* Recycling Truck */}
      <group ref={truckRef} position={[0, 0.5, 2]}>
        <group
          onClick={(e) => {
            e.stopPropagation();
            setActiveInfo({
              id: "truck",
              title: "Rutas de Recolección",
              content:
                "Las cooperativas de recicladores tienen rutas establecidas en Bucaramanga. Entregan el material a las ECA (Estaciones de Clasificación y Aprovechamiento).",
              type: "good",
            });
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "auto")}
        >
          <DetailedTruck />
          <FloatingInfoCard id="truck" position={[0, 3, 0]} />
        </group>
      </group>

      {/* Recycler Cart */}
      <group
        position={[-2, 0, -2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveInfo({
            id: "cart",
            title: "El Reciclador de Oficio",
            content:
              "Son el corazón del sistema. Separan, clasifican y transportan el material. ¡Facilita su trabajo entregando el material limpio y seco!",
            type: "info",
          });
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <DetailedCart />
        <Text position={[0, 2, 0]} fontSize={0.2} color="black" outlineWidth={0.02} outlineColor="white">
          Material Recolectado
        </Text>
        <FloatingInfoCard id="cart" position={[0, 3, 0]} />
      </group>
    </group>
  );
}
