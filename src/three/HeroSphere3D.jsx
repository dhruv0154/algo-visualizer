// HeroSphere3D.jsx
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function WireSphere({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.25 + (hovered ? Math.sin(t * 2) * 0.1 : 0);
    ref.current.rotation.x = (hovered ? Math.cos(t * 2) * 0.08 : 0.1);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshBasicMaterial wireframe color={hovered ? "#22d3ee" : "#a78bfa"} />
    </mesh>
  );
}

export default function HeroSphere3D() {
  const [hovered, setHovered] = useState(false);
  return (
    <Canvas camera={{ position: [0, 0, 5] }} className="rounded-2xl">
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1} />
      <WireSphere hovered={hovered} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <mesh position={[0,0,0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} visible={false}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Canvas>
  );
}
