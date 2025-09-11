import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export default function WaveGrid3D() {
  const [hovered, setHovered] = useState(false);

  function Plane() {
    const ref = useRef();
    useFrame(({ clock }) => {
      if (!ref.current) return;
      const t = clock.getElapsedTime();

      // many BufferGeometries expose attributes.position
      const geom = ref.current.geometry;
      const pos = geom.attributes.position;
      // widthSegments and heightSegments were used to compute indexing
      const w = geom.parameters.widthSegments + 1;
      const h = geom.parameters.heightSegments + 1;

      for (let i = 0; i < pos.count; i++) {
        const x = i % w;
        const y = Math.floor(i / w);
        // z = sin((x + t * 3) / 2) * 0.15 + cos((y + t * 2) / 2) * 0.15 * (hovered ? 1.8 : 1)
        const z = Math.sin((x + t * 3) / 2) * 0.15 + Math.cos((y + t * 2) / 2) * 0.15 * (hovered ? 1.8 : 1);
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      ref.current.rotation.x = -Math.PI / 3;
    });

    return (
      <mesh ref={ref} position={[0.3, 0.6, 0]}>
        <planeGeometry args={[6, 4, 40, 30]} />
        <meshStandardMaterial color="#22d3ee" wireframe />
      </mesh>
    );
  }

  return (
    <Canvas camera={{ position: [0, 2.5, 3.5] }} onCreated={({ gl }) => { gl.setClearColor("#000000", 0); }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} />
      <Plane />
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} position={[0,0,0]} visible={false}>
        <boxGeometry args={[10,10,10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Canvas>
  );
}
