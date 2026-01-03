import React from 'react';
import { usePlane } from '@react-three/cannon';

const Wall = (props: any) => {
  const [ref] = usePlane(() => ({
    material: { friction: 0, restitution: 1 }, // Bouncy walls
    ...props,
  }));
  return <mesh ref={ref as any} visible={false} />;
};

export const Walls = () => {
  const size = 3; // Boundary size from center (Reduced from 6 to 3 to keep dice in view)

  return (
    <>
      <Wall position={[0, 0, -size]} rotation={[0, 0, 0]} /> {/* Back */}
      <Wall position={[0, 0, size]} rotation={[0, -Math.PI, 0]} /> {/* Front */}
      <Wall position={[size, 0, 0]} rotation={[0, -Math.PI / 2, 0]} /> {/* Right */}
      <Wall position={[-size, 0, 0]} rotation={[0, Math.PI / 2, 0]} /> {/* Left */}
    </>
  );
};