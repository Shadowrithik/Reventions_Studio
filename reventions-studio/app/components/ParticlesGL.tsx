"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const STAR_COUNT = 600;

function generateStarPositions() {
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 100;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  return pos;
}

function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const constellationGroup = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Mesh>(null);
  const mainGroup = useRef<THREE.Group>(null); // Anchor for the whole scene

  const { pointer, viewport } = useThree();

  // STAR POSITIONS & DRIFT SPEEDS
  const positions = useMemo(() => {
    return generateStarPositions();
  }, []);

  const starGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return geo;
  }, [positions]);

  const constellationData = useMemo(() => [
    { base: [0, 16, -40], scale: 2.4, points: [[0, 0, 0], [3, 2, 0], [6, 1, 0], [8, 4, 0], [5, 6, 0], [2, 5, 0]] },
    { base: [-85, 4, -70], scale: 3.5, points: [[0, 0, 0], [4, 2, 0], [7, -1, 0], [10, 2, 0], [6, 5, 0], [2, 4, 0]] },
    { base: [85, -20, -75], scale: 3.8, points: [[0, 0, 0], [-3, 2, 0], [-6, 1, 0], [-9, 3, 0], [-5, 6, 0], [-1, 5, 0]] },
  ], []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // 1. 3D CAMERA PARALLAX (Rotation & Position)
    // We tilt the main group instead of just the camera for a more "physical" feel
    if (mainGroup.current) {
      // Rotate the entire scene slightly based on mouse
      // mouse.x/y is -1 to 1. We multiply by 0.1 for a subtle, high-pro tilt.
      mainGroup.current.rotation.y += (pointer.x * 0.15 - mainGroup.current.rotation.y) * 0.05;
      mainGroup.current.rotation.x += (-pointer.y * 0.1 - mainGroup.current.rotation.x) * 0.05;
      
      // Move the camera position slightly for depth parallax
      state.camera.position.x += (pointer.x * 3 - state.camera.position.x) * 0.05;
      state.camera.position.y += (pointer.y * 2 - state.camera.position.y) * 0.05;
      state.camera.lookAt(0, 0, 0);
    }

    // 2. STAR PHYSICS (Repel + Drift)
    if (starsRef.current) {
      const attr = starsRef.current.geometry.attributes.position;
      const mouseX = (pointer.x * viewport.width) / 2;
      const mouseY = (pointer.y * viewport.height) / 2;

      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const tx = positions[i3] + Math.sin(time * 0.15 + i) * 0.5;
        const ty = positions[i3 + 1] + Math.cos(time * 0.12 + i) * 0.5;

        // Repel from mouse cursor
        const dx = attr.array[i3] - mouseX;
        const dy = attr.array[i3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10) {
          const force = (10 - dist) * 0.12;
          attr.array[i3] += (dx / dist) * force;
          attr.array[i3 + 1] += (dy / dist) * force;
        }

        // Elastic return to drift position
        attr.array[i3] += (tx - attr.array[i3]) * 0.03;
        attr.array[i3 + 1] += (ty - attr.array[i3 + 1]) * 0.03;
      }
      attr.needsUpdate = true;
    }

    // 3. CONSTELLATION FLOATING
    if (constellationGroup.current) {
      constellationGroup.current.children.forEach((group, i) => {
        group.position.y += Math.sin(time * 0.3 + i) * 0.008;
      });
    }
  });

  return (
    <group ref={mainGroup}>
      {/* BACKGROUND NEBULA */}
      <mesh ref={nebulaRef} position={[0, 0, -90]}>
        <circleGeometry args={[120, 64]} />
        <meshBasicMaterial color="#4338ca" transparent opacity={0.03} />
      </mesh>

      {/* STAR FIELD */}
      <points ref={starsRef} geometry={starGeo}>
        <pointsMaterial 
          size={0.12} 
          transparent 
          blending={THREE.AdditiveBlending} 
          color="#ffffff" 
          opacity={0.5} 
          sizeAttenuation={true} 
        />
      </points>

      {/* CONSTELLATIONS */}
      <group ref={constellationGroup}>
        {constellationData.map((c, index) => (
          <group key={index} position={c.base as [number, number, number]} scale={c.scale}>
            <points>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[new Float32Array(c.points.flat()), 3]} />
              </bufferGeometry>
              <pointsMaterial size={0.3} color="#ffffff" transparent blending={THREE.AdditiveBlending} opacity={0.8} />
            </points>

            {c.points.map((p, i) => {
              if (i === c.points.length - 1) return null;
              const next = c.points[i + 1];
              return (
                <line key={i}>
                  <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[new Float32Array([...p, ...next]), 3]} />
                  </bufferGeometry>
                  <lineBasicMaterial color="#ffffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                </line>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}

export default function Particles() {
  return (
    <div className="fixed inset-0 z-0 bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 40], fov: 55 }} dpr={[1, 2]}>
        <StarField />
        <EffectComposer enableNormalPass={false}>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.3}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Advanced Glossy Vignette */}
      <div className="pointer-events-none fixed inset-0 z-10 
        bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] opacity-80" 
      />
    </div>
  );
}