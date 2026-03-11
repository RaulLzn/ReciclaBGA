import React, { useMemo } from 'react';
import { Box, Cylinder, Dodecahedron } from '@react-three/drei';
import { useEpicStore } from '../store/epicStore';

export function ScatteredTrash() {
  const discoveredTips = useEpicStore(state => state.discoveredTips);
  const totalTips = 11; // 11 interactive objects
  const progress = Math.min(1, discoveredTips.length / totalTips); // 0.0 to 1.0

  // Generate random trash positions once
  const trashItems = useMemo(() => {
    const items = [];
    const numItems = 80; // Total trash items scattered around
    for (let i = 0; i < numItems; i++) {
      const type = Math.floor(Math.random() * 3); // 0: box, 1: cylinder, 2: crumpled paper
      
      // Random position within the diorama bounds (-18 to 18)
      const x = (Math.random() - 0.5) * 36;
      const z = (Math.random() - 0.5) * 36;
      
      const rotation = [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ] as [number, number, number];

      let color = '#a3a3a3';
      if (type === 0) color = '#d4d4d8'; // Cardboard-ish
      if (type === 1) color = '#93c5fd'; // Plastic-ish
      if (type === 2) color = '#fca5a5'; // Reddish trash

      items.push({ id: i, type, position: [x, 0.15, z] as [number, number, number], rotation, color });
    }
    return items;
  }, []);

  // Determine how many items to show based on progress
  // If progress is 0, show all. If progress is 1, show 0.
  const itemsToShow = Math.floor(trashItems.length * (1 - progress));

  return (
    <group>
      {trashItems.slice(0, itemsToShow).map((item) => {
        if (item.type === 0) {
          return (
            <Box key={item.id} args={[0.3, 0.3, 0.3]} position={item.position} rotation={item.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={item.color} roughness={0.8} />
            </Box>
          );
        } else if (item.type === 1) {
          return (
            <Cylinder key={item.id} args={[0.1, 0.1, 0.4, 8]} position={item.position} rotation={item.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={item.color} roughness={0.3} />
            </Cylinder>
          );
        } else {
          return (
            <Dodecahedron key={item.id} args={[0.2]} position={item.position} rotation={item.rotation} castShadow receiveShadow>
              <meshStandardMaterial color={item.color} roughness={0.9} />
            </Dodecahedron>
          );
        }
      })}
    </group>
  );
}
