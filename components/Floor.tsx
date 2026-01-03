import React from 'react';
import { usePlane } from '@react-three/cannon';

export const Floor = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.3, restitution: 0.2 }, // Increased friction, lowered restitution
  }));

  return (
    <mesh ref={ref as any} visible={false}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
};