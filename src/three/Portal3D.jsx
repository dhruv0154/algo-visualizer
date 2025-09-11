import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export default function Portal3D() {
  const [hovered, setHovered] = useState(false);

  function Ring() {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (!ref.current) return;
      const speed = hovered ? 4 : 2;
      const scale = 1 + Math.sin(t * speed) * 0.05 + 0.05;
      ref.current.scale.setScalar(scale);
    });
    return (
      <mesh ref={ref}>
        <ringGeometry args={[0.9, 1.2, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.8} />
        <Ring />
      </Canvas>
    </div>
  );
}
