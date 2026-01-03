import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useBox } from '@react-three/cannon';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3Tuple } from '../types';

interface DiceProps {
  position: Vector3Tuple;
  triggerThrow: number;
  onResult: (value: number) => void;
}

export const Dice: React.FC<DiceProps> = ({ position, triggerThrow, onResult }) => {
  const [ref, api] = useBox(() => ({
    mass: 2,
    position,
    args: [1, 1, 1],
    friction: 0.2,
    restitution: 0.1,
    linearDamping: 0.5,
    angularDamping: 0.3, // Lower damping to maintain spin longer
  }));

  const velocity = useRef([0, 0, 0]);
  const angularVelocity = useRef([0, 0, 0]);
  
  useEffect(() => {
    const unsubVel = api.velocity.subscribe((v) => (velocity.current = v));
    const unsubAngVel = api.angularVelocity.subscribe((v) => (angularVelocity.current = v));
    return () => {
      unsubVel();
      unsubAngVel();
    };
  }, [api.velocity, api.angularVelocity]);

  // Track state
  const isRollingRef = useRef(false);
  const timeSinceThrow = useRef(0);
  const stableStopTimer = useRef(0);
  
  // Track the last processed throw trigger to prevent re-throws on render
  const prevTriggerRef = useRef(0);

  // Throw logic
  useEffect(() => {
    // Only throw if trigger is greater than previous recorded trigger
    if (triggerThrow > prevTriggerRef.current && triggerThrow > 0) {
      prevTriggerRef.current = triggerThrow;
      isRollingRef.current = true;
      timeSinceThrow.current = 0;
      stableStopTimer.current = 0;

      // Reset position slightly above center
      const offset = (Math.random() - 0.5) * 0.2;
      api.position.set(position[0] + offset, 5, position[2]); // Higher start for more fall time
      api.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      
      // Stop current velocity immediately
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);

      // Apply Impulse - Stronger upward force to give air time for spinning
      const x = (Math.random() - 0.5) * 20; 
      const z = (Math.random() - 0.5) * 20;
      api.applyImpulse([x, 8, z], [0, 0, 0]);

      // Apply Torque - EXTREME SPIN
      const rx = (Math.random() - 0.5) * 1000;
      const ry = (Math.random() - 0.5) * 1000;
      const rz = (Math.random() - 0.5) * 1000;
      api.applyTorque([rx, ry, rz]);
    }
  }, [triggerThrow, api, position]);

  // Check for stop and calculate result
  useFrame((state, delta) => {
    if (isRollingRef.current) {
      timeSinceThrow.current += delta;

      const v = velocity.current;
      const av = angularVelocity.current;

      const speed = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      const angularSpeed = Math.sqrt(av[0] * av[0] + av[1] * av[1] + av[2] * av[2]);

      // 1. Strict Stop Check
      if (speed < 0.01 && angularSpeed < 0.05) {
        stableStopTimer.current += delta;
      } else {
        stableStopTimer.current = 0;
      }

      // 2. Conditions to finish the roll
      const isStuck = timeSinceThrow.current > 4.5; // Force stop after 4.5 seconds
      const isStopped = stableStopTimer.current > 0.5; // Natural stop

      if (isStopped || isStuck) { 
        isRollingRef.current = false;
        calculateResult();
      }
    }
  });

  const calculateResult = () => {
    const quaternion = new THREE.Quaternion();
    if (ref.current) {
      ref.current.getWorldQuaternion(quaternion);
    }

    const faces = [
      { value: 1, vector: new THREE.Vector3(0, 0, 1) },
      { value: 6, vector: new THREE.Vector3(0, 0, -1) },
      { value: 2, vector: new THREE.Vector3(0, 1, 0) },
      { value: 5, vector: new THREE.Vector3(0, -1, 0) },
      { value: 3, vector: new THREE.Vector3(1, 0, 0) },
      { value: 4, vector: new THREE.Vector3(-1, 0, 0) },
    ];

    const upVector = new THREE.Vector3(0, 1, 0);
    let maxDot = -Infinity;
    let result = 1;

    faces.forEach((face) => {
      const worldVector = face.vector.clone().applyQuaternion(quaternion);
      const dot = worldVector.dot(upVector);
      if (dot > maxDot) {
        maxDot = dot;
        result = face.value;
      }
    });

    onResult(result);
  };

  // Materials
  const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f5f5f5', 
    roughness: 0.6,
    metalness: 0.0,
    envMapIntensity: 0.3,
  }), []);

  const pipMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.6,
    metalness: 0,
  }), []);

  const redPipMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D00000',
    roughness: 0.6,
    metalness: 0,
  }), []);

  const size = 1;
  const radius = 0.15;
  const smoothness = 4;
  const pipSize = 0.14;
  const pipDepth = 0.02;

  const Pip = ({ pos, isRed = false }: { pos: [number, number, number], isRed?: boolean }) => (
    <mesh position={pos} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[pipSize / 2, pipSize / 2, pipDepth, 32]} />
      <primitive object={isRed ? redPipMaterial : pipMaterial} attach="material" />
    </mesh>
  );

  return (
    <group ref={ref as any}>
      <RoundedBox args={[size, size, size]} radius={radius} smoothness={smoothness}>
        <primitive object={bodyMaterial} attach="material" />
      </RoundedBox>

      {/* Face 1 (Z+) - RED PIP */}
      <group position={[0, 0, 0.5]}>
        <Pip pos={[0, 0, 0]} isRed={true} />
      </group>

      {/* Face 6 (Z-) */}
      <group position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
        <Pip pos={[-0.25, -0.25, 0]} />
        <Pip pos={[-0.25, 0, 0]} />
        <Pip pos={[-0.25, 0.25, 0]} />
        <Pip pos={[0.25, -0.25, 0]} />
        <Pip pos={[0.25, 0, 0]} />
        <Pip pos={[0.25, 0.25, 0]} />
      </group>

      {/* Face 2 (Y+) */}
      <group position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Pip pos={[-0.25, -0.25, 0]} />
        <Pip pos={[0.25, 0.25, 0]} />
      </group>

      {/* Face 5 (Y-) */}
      <group position={[0, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Pip pos={[-0.25, -0.25, 0]} />
        <Pip pos={[-0.25, 0.25, 0]} />
        <Pip pos={[0.25, -0.25, 0]} />
        <Pip pos={[0.25, 0.25, 0]} />
        <Pip pos={[0, 0, 0]} />
      </group>

      {/* Face 3 (X+) */}
      <group position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Pip pos={[-0.25, -0.25, 0]} />
        <Pip pos={[0, 0, 0]} />
        <Pip pos={[0.25, 0.25, 0]} />
      </group>

      {/* Face 4 (X-) */}
      <group position={[-0.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Pip pos={[-0.25, -0.25, 0]} />
        <Pip pos={[-0.25, 0.25, 0]} />
        <Pip pos={[0.25, -0.25, 0]} />
        <Pip pos={[0.25, 0.25, 0]} />
      </group>
    </group>
  );
};