import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export default function Particles3D({ hovered }) {
  const count = 60;

  function Stars() {
    const group = useRef();
    // small speeds per particle
    const speeds = useMemo(() => new Array(count).fill().map(() => Math.random() * 0.01 + 0.003), []);
    const positions = useMemo(
      () => new Array(count).fill().map(() => [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 5]),
      []
    );

    useFrame(() => {
      if (!group.current) return;
      group.current.children.forEach((m, i) => {
        m.position.y += (hovered ? speeds[i] * 6 : speeds[i]);
        if (m.position.y > 2) m.position.y = -2;
      });
    });

    return (
      <group ref={group}>
        {positions.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={hovered ? "#22d3ee" : "#64748b"} />
          </mesh>
        ))}
      </group>
    );
  }

  // The Canvas can be small and isolated so it won't interfere with the main scene
  return (
    <Canvas camera={{ position: [0, 0, 4] }}>
      <ambientLight intensity={0.5} />
      <Stars />
    </Canvas>
  );
}
