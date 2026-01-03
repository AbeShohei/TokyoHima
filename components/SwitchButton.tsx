import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, Text, Decal, RenderTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface SwitchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({ onClick, disabled }) => {
  const [hovered, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const capRef = useRef<THREE.Group>(null);

  // Target Y position for the cap: 
  // -0.15 when pressed, slightly depressed (-0.02) when hovered to invite click, 0 otherwise.
  const targetY = pressed ? -0.15 : (hovered && !disabled ? -0.02 : 0);

  useFrame((state, delta) => {
    if (capRef.current) {
      // Smooth spring-like animation using lerp
      capRef.current.position.y = THREE.MathUtils.lerp(capRef.current.position.y, targetY, delta * 20);
    }
  });

  const handlePointerDown = (e: any) => {
    if (disabled) return;
    e.stopPropagation();
    setPressed(true);
  };

  const handlePointerUp = (e: any) => {
    if (disabled) return;
    e.stopPropagation();
    setPressed(false);
    onClick();
  };

  const handlePointerOut = () => {
    setPressed(false);
    setHover(false);
  };

  return (
    <group
      rotation={[Math.PI / 6, 0, 0]} // Square orientation (facing camera, tilted slightly up)
      onPointerOver={() => !disabled && setHover(true)}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      scale={1.3} // Make it chunky
    >
      {/* Black Base Housing */}
      <RoundedBox args={[2.2, 1.2, 2.2]} radius={0.1} smoothness={4} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </RoundedBox>

      {/* White Top Plate Housing and Screws removed per user request for complete transparency */}

      {/* Red Mushroom Cap Group */}
      <group ref={capRef} position={[0, 1.2, 0]}>
        {/* The Stem/Neck connecting cap to housing */}
        <Cylinder args={[0.9, 0.9, 0.6, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#991b1b" roughness={0.5} />
        </Cylinder>

        {/* The Dome Cap */}
        <mesh position={[0, 0.3, 0]}>
          {/* Hemisphere-ish sphere */}
          <sphereGeometry args={[1.2, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color={disabled ? "#555" : "#dc2626"}
            roughness={disabled ? 0.8 : 0.2}
            metalness={0.1}
            envMapIntensity={disabled ? 0.2 : 1.2}
            clearcoat={disabled ? 0 : 0.5}
            clearcoatRoughness={0.1}
          />

          {/* Decal for the "ROLL" text - projects texture onto the curved surface */}
          <Decal
            position={[0, 1.2, 0]} // Top of the sphere (radius 1.2)
            rotation={[-Math.PI / 2, 0, 0]} // Projecting from top down
            scale={[2.2, 1.1, 1]} // Significantly increased scale for larger, bolder text
          >
            <meshStandardMaterial
              transparent
              polygonOffset
              polygonOffsetFactor={-1} // Ensures it renders on top of the red surface
              roughness={0.3}
            >
              <RenderTexture attach="map">
                <PerspectiveCamera makeDefault manual aspect={2.2 / 1.1} position={[0, 0, 5]} />
                <ambientLight intensity={2} />
                <Text
                  fontSize={2.5} // Increased font size inside the texture
                  font="https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf" // Roboto Bold
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                  letterSpacing={-0.02} // Slightly tighter tracking for better impact
                >
                  ROLL
                </Text>
              </RenderTexture>
            </meshStandardMaterial>
          </Decal>
        </mesh>
      </group>
    </group>
  );
};