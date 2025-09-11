import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export default function RotatingCube3D({ hovered = false }) {
  const Box = () => {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (!ref.current) return;
      ref.current.rotation.x = t * (hovered ? 1.2 : 0.4);
      ref.current.rotation.y = t * (hovered ? 1.4 : 0.5);
    });
    return (
      <mesh ref={ref}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color={hovered ? "#fde047" : "#22d3ee"} wireframe />
      </mesh>
    );
  };

  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} />
      <Box />
    </Canvas>
  );
}
