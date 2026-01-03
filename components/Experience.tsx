import React from 'react';
import { Environment, ContactShadows, Lightformer } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Dice } from './Dice';
import { Floor } from './Floor';
import { Walls } from './Walls';

interface ExperienceProps {
  triggerThrow: number;
  onResult: (index: 0 | 1, value: number) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ triggerThrow, onResult }) => {
  return (
    <>
      {/* Lighting & Environment */}
      {/* Reduced environment intensity to prevent washout */}
      <Environment preset="studio" resolution={512} environmentIntensity={0.5}>
        <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, -9]} scale={[10, 1, 1]} />
        <Lightformer intensity={1} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 1, 1]} />
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
        <Lightformer intensity={0.5} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
      </Environment>

      <ambientLight intensity={0.2} />
      
      {/* Significantly reduced spotlight intensity to avoid whiteout */}
      <spotLight 
        position={[5, 12, 5]} 
        angle={0.2} 
        penumbra={1} 
        intensity={20} 
        castShadow 
        shadow-bias={-0.0001}
      />

      {/* Physics World */}
      <Physics allowSleep={false} gravity={[0, -15, 0]}>
        {/* Die 1: Starts slightly to the left */}
        <Dice 
          position={[-1.2, 2, 0]} 
          triggerThrow={triggerThrow} 
          onResult={(val) => onResult(0, val)} 
        />
        {/* Die 2: Starts slightly to the right */}
        <Dice 
          position={[1.2, 2, 0]} 
          triggerThrow={triggerThrow} 
          onResult={(val) => onResult(1, val)} 
        />
        
        <Floor />
        <Walls />
      </Physics>

      {/* Realistic Soft Shadows */}
      <ContactShadows 
        resolution={1024} 
        scale={20} 
        blur={2} 
        opacity={0.4} 
        far={10} 
        color="#1a1a1a" 
      />
    </>
  );
};