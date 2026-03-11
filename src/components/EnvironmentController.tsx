import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useEpicStore } from '../store/epicStore';
import * as THREE from 'three';

const POLLUTED_SKY = new THREE.Color('#87CEEB'); // Bright blue sky
const CLEAN_SKY = new THREE.Color('#87CEEB'); // Bright blue sky

const POLLUTED_LIGHT = new THREE.Color('#ffffff');
const CLEAN_LIGHT = new THREE.Color('#ffffff');

export function EnvironmentController() {
  const discoveredTips = useEpicStore(state => state.discoveredTips);
  
  // Cleanliness from 0.0 to 1.0 based on discovered tips (max 11 for full clean from objects)
  const targetCleanliness = Math.min(1, discoveredTips.length / 11);
  const currentCleanliness = useRef(0);

  const skyColor = useRef(new THREE.Color(POLLUTED_SKY));
  const lightColor = useRef(new THREE.Color(POLLUTED_LIGHT));

  useFrame(({ scene }, delta) => {
    // Smoothly interpolate cleanliness
    currentCleanliness.current = THREE.MathUtils.damp(
      currentCleanliness.current,
      targetCleanliness,
      2,
      delta
    );

    const c = currentCleanliness.current;

    // Update Background (No Fog)
    scene.fog = null; // Ensure no fog
    skyColor.current.lerpColors(POLLUTED_SKY, CLEAN_SKY, c);
    scene.background = skyColor.current;
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        color={CLEAN_LIGHT}
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
    </>
  );
}

