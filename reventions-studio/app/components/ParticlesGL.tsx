"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

const STAR_COUNT = 600;

function generateStarData() {
  const pos = new Float32Array(STAR_COUNT * 3);
  const stepArr = new Float32Array(STAR_COUNT);
  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 100;     // X
    pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // Y
    pos[i * 3 + 2] = (Math.random() - 0.5) * 50; // Z
    stepArr[i] = Math.random() * 0.4 + 0.1;      // Drift Speed
  }
  return { positions: pos, step: stepArr };
}

function StarField() {
  const starsRef = useRef<THREE.Points>(null);
  const constellationGroup = useRef<THREE.Group>(null);
  const mainGroup = useRef<THREE.Group>(null);
  const glowLight = useRef<THREE.PointLight>(null);

  const { pointer, viewport } = useThree();

  // 1. GENERATE STAR DATA (Positions & Individual Drift Speeds)
  const [starData, setStarData] = useState(() => generateStarData());
  const positions = starData.positions;
  const step = starData.step;

  const starGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return geo;
  }, [positions]);

  // 2. CONSTELLATION DATA
  const constellationData = useMemo(() => [
    { base: [0, 16, -40], scale: 2.4, points: [[0, 0, 0], [3, 2, 0], [6, 1, 0], [8, 4, 0], [5, 6, 0], [2, 5, 0]] },
    { base: [-85, 4, -70], scale: 3.5, points: [[0, 0, 0], [4, 2, 0], [7, -1, 0], [10, 2, 0], [6, 5, 0], [2, 4, 0]] },
    { base: [85, -20, -75], scale: 3.8, points: [[0, 0, 0], [-3, 2, 0], [-6, 1, 0], [-9, 3, 0], [-5, 6, 0], [-1, 5, 0]] },
  ], []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // ── 1. COSMOS MOUSE GLOW (Purple Light Tracking) ──
    if (glowLight.current) {
      const targetX = (pointer.x * viewport.width) / 2;
      const targetY = (pointer.y * viewport.height) / 2;
      
      // Smooth interpolation for the follower light
      glowLight.current.position.x += (targetX - glowLight.current.position.x) * 0.1;
      glowLight.current.position.y += (targetY - glowLight.current.position.y) * 0.1;
      
      // Breathing pulse effect
      glowLight.current.intensity = 15 + Math.sin(time * 2) * 5;
    }

    // ── 2. 3D CAMERA & SCENE PARALLAX ──
    if (mainGroup.current) {
      // Tilt the entire scene for physical depth
      mainGroup.current.rotation.y += (pointer.x * 0.15 - mainGroup.current.rotation.y) * 0.05;
      mainGroup.current.rotation.x += (-pointer.y * 0.1 - mainGroup.current.rotation.x) * 0.05;
      
      // Dynamic camera movement
      state.camera.position.x += (pointer.x * 3 - state.camera.position.x) * 0.05;
      state.camera.position.y += (pointer.y * 2 - state.camera.position.y) * 0.05;
      state.camera.lookAt(0, 0, 0);
    }

    // ── 3. STAR PHYSICS (Repel + Drift + Twinkle) ──
    if (starsRef.current) {
      const attr = starsRef.current.geometry.attributes.position;
      const mouseX = (pointer.x * viewport.width) / 2;
      const mouseY = (pointer.y * viewport.height) / 2;

      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        
        // Target position based on random drift
        const tx = positions[i3] + Math.sin(time * 0.1 + i) * 0.5;
        const ty = positions[i3 + 1] + Math.cos(time * 0.1 + i) * 0.5;

        // Repel Logic
        const dx = attr.array[i3] - mouseX;
        const dy = attr.array[i3 + 1] - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12) {
          const force = (12 - dist) * 0.15;
          attr.array[i3] += (dx / dist) * force;
          attr.array[i3 + 1] += (dy / dist) * force;
        }

        // Return to drift position (elasticity)
        attr.array[i3] += (tx - attr.array[i3]) * 0.03;
        attr.array[i3 + 1] += (ty - attr.array[i3 + 1]) * 0.03;
      }
      attr.needsUpdate = true;
    }

    // ── 4. CONSTELLATION FLOATING ──
    if (constellationGroup.current) {
      constellationGroup.current.children.forEach((group, i) => {
        group.position.y += Math.sin(time * 0.3 + i) * 0.008;
      });
    }
  });

  return (
    <group ref={mainGroup}>
      {/* Dynamic Purple Follower Light */}
      <pointLight 
        ref={glowLight}
        color="#a855f7" 
        distance={45} 
        decay={2} 
        intensity={15} 
      />

      {/* Ambient Base Light */}
      <ambientLight intensity={0.2} />

      {/* Star Field Points */}
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

      {/* Crystalline Constellations */}
      <group ref={constellationGroup}>
        {constellationData.map((c, index) => (
          <group key={index} position={c.base as [number, number, number]} scale={c.scale}>
            {/* Constellation Nodes (Stars) */}
            <points>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[new Float32Array(c.points.flat()), 3]} />
              </bufferGeometry>
              <pointsMaterial size={0.3} color="#ffffff" transparent blending={THREE.AdditiveBlending} opacity={0.8} />
            </points>

            {/* Glowing Connector Lines */}
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

      {/* Deep Nebula Background Plane */}
      <mesh position={[0, 0, -85]}>
        <circleGeometry args={[110, 64]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.03} />
      </mesh>
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
      
      {/* Cinematic Vignette Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 
        bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] opacity-85" 
      />
    </div>
  );
}