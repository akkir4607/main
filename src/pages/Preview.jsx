// Preview.jsx - REALISTIC GRAPHICS & SMOOTH MECHANICS
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Sparkles,
  Environment,
  ContactShadows,
  Html,
  Stars,
  Sky,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
  BakeShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import m1 from '../images/m1.png';
import './Preview.css';

/* ============================================================
   SHARED GEOMETRIES (created ONCE)
   ============================================================ */
const GEO = {
  box1: new THREE.BoxGeometry(1, 1, 1),
  sphere8: new THREE.SphereGeometry(1, 12, 12),
  sphere10: new THREE.SphereGeometry(1, 14, 14),
  sphere6: new THREE.SphereGeometry(1, 8, 8),
  cylinder6: new THREE.CylinderGeometry(1, 1, 1, 8),
  cylinder8: new THREE.CylinderGeometry(1, 1, 1, 10),
  cylinder12: new THREE.CylinderGeometry(1, 1, 1, 16),
  plane: new THREE.PlaneGeometry(1, 1),
  torus: new THREE.TorusGeometry(1, 0.05, 10, 20),
  circle: new THREE.CircleGeometry(1, 12),
  octahedron: new THREE.OctahedronGeometry(1, 0),
  cone: new THREE.ConeGeometry(1, 1, 16),
};

const WINDOW_GLASS_GEO = new THREE.PlaneGeometry(0.14, 0.2);

// Realistic PBR shared materials
const MAT_TRUNK = new THREE.MeshStandardMaterial({
  color: '#5c3a1e', roughness: 0.95, metalness: 0.02
});
const MAT_TRUNK_DARK = new THREE.MeshStandardMaterial({
  color: '#4a2a0e', roughness: 0.95, metalness: 0.02
});
const MAT_ROOT = new THREE.MeshStandardMaterial({ color: '#3a1a0a', roughness: 1 });
const MAT_METAL_DARK = new THREE.MeshStandardMaterial({
  color: '#3a3a3a', metalness: 0.9, roughness: 0.35
});
const MAT_METAL_LIGHT = new THREE.MeshStandardMaterial({
  color: '#5a5a5a', metalness: 0.75, roughness: 0.4
});
const MAT_WHEEL = new THREE.MeshStandardMaterial({
  color: '#0a0a15', metalness: 0.4, roughness: 0.8
});
const MAT_SKIN = new THREE.MeshStandardMaterial({
  color: '#f5c99b', roughness: 0.7, metalness: 0
});
const MAT_PANTS = new THREE.MeshStandardMaterial({
  color: '#1f2d3d', roughness: 0.85, metalness: 0
});

/* ============================================================
   ACHIEVEMENTS - synced with About.jsx (8 items)
   ============================================================ */
const achievements = [
  {
    id: 1,
    title: 'HackCraft 3.0',
    subtitle: 'Coordinator',
    year: '2025',
    color: '#b344f0',
    angle: 0,
    rarity: 'EPIC',
    icon: '🎯',
    description: 'Coordinated HackCraft 3.0, managing logistics and fostering innovation.',
  },
  {
    id: 2,
    title: "Innoverse'36",
    subtitle: '1st Place Hackathon',
    year: '2025',
    color: '#ffaa00',
    angle: (2 * Math.PI) / 8,
    rarity: 'LEGENDARY',
    icon: '👑',
    description: 'Team Byte Wizards secured 1st place at SGT 36-Hour National Hackathon.',
  },
  {
    id: 3,
    title: 'SnapAR',
    subtitle: 'Workshop Lead',
    year: '2023',
    color: '#55cc44',
    angle: (4 * Math.PI) / 8,
    rarity: 'UNCOMMON',
    icon: '📸',
    description: 'Co-organized SnapAR workshop with BharatXR at GITM Gurgaon.',
  },
  {
    id: 4,
    title: 'GITM Hack',
    subtitle: 'Organizer',
    year: '2024',
    color: '#b344f0',
    angle: (6 * Math.PI) / 8,
    rarity: 'EPIC',
    icon: '⚡',
    description: 'Led end-to-end organization of a major hackathon at GITM.',
  },
  {
    id: 5,
    title: 'Honeywell',
    subtitle: 'Industry Visit',
    year: '2024',
    color: '#3baaff',
    angle: (8 * Math.PI) / 8,
    rarity: 'RARE',
    icon: '🏭',
    description: 'Explored cutting-edge industrial automation at Honeywell India.',
  },
  {
    id: 6,
    title: 'StarkSeek Meet',
    subtitle: 'Co-Organizer',
    year: '2021',
    color: '#00d4ff',
    angle: (10 * Math.PI) / 8,
    rarity: 'RARE',
    icon: '🤝',
    description: 'StarkSeek x HackCraft meet-up with Microsoft Azure Community.',
  },
  {
    id: 7,
    title: 'HackCraft 2.0',
    subtitle: 'Lead Organizer',
    year: '2025',
    color: '#ff6b9d',
    angle: (12 * Math.PI) / 8,
    rarity: 'EPIC',
    icon: '🚀',
    description: 'Led teams and drove innovation-focused initiatives at HackCraft 2.0.',
  },
  {
    id: 8,
    title: 'KPMG Intern',
    subtitle: 'Data Analytics',
    year: '2023',
    color: '#3baaff',
    angle: (14 * Math.PI) / 8,
    rarity: 'RARE',
    icon: '💼',
    description: 'Virtual internship in Data Analytics at KPMG with real-world projects.',
  },
];

/* ============================================================
   PROJECTS - all link to /work (Work2.jsx)
   ============================================================ */
const projects = [
  { id: 1, name: 'SARA', desc: 'AI Voice Assistant', color: '#943fff', link: '/work', pos: [9, 2.5, -6], icon: '🤖' },
  { id: 2, name: 'PHISH', desc: 'Security Scanner', color: '#00ff88', link: '/work', pos: [-9, 2.5, -6], icon: '🛡️' },
  { id: 3, name: 'AIRGUARD', desc: 'IoT Air Monitor', color: '#00e676', link: '/work', pos: [9, 2.5, 6], icon: '🌿' },
  { id: 4, name: 'MGSHARE', desc: 'File Transfer', color: '#00d9ff', link: '/work', pos: [-9, 2.5, 6], icon: '📡' },
];

/* Utility: smooth damping (frame-rate independent) */
const damp = (current, target, lambda, dt) => {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
};

/* ============================================================
   REALISTIC BUILDING
   ============================================================ */
const RealisticBuilding = React.memo(({ position, height = 2, width = 1, depth = 1, color = '#4a4a6e', nightMode, style = 0 }) => {
  const windowRows = Math.floor(height / 0.35);
  const windowCols = Math.max(2, Math.floor(width / 0.35));
  const totalWindows = windowRows * windowCols;

  const windowStates = useMemo(() => {
    const states = [];
    for (let i = 0; i < totalWindows; i++) {
      states.push({
        lit: Math.random() > 0.35,
        litBack: Math.random() > 0.5,
        flickerSpeed: 0.5 + Math.random() * 2,
      });
    }
    return states;
  }, [totalWindows]);

  const darkerColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.65);
    return '#' + c.getHexString();
  }, [color]);

  const lighterColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(1.2);
    return '#' + c.getHexString();
  }, [color]);

  const mainGeo = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);
  const topGeo = useMemo(() => new THREE.BoxGeometry(width * 0.7, 0.7, depth * 0.7), [width, depth]);
  const roofGeo = useMemo(() => new THREE.BoxGeometry(width + 0.08, 0.14, depth + 0.08), [width, depth]);
  const ledgeGeo = useMemo(() => new THREE.BoxGeometry(width + 0.05, 0.05, 0.025), [width]);
  const entranceGeo = useMemo(() => new THREE.BoxGeometry(width * 0.28, 0.45, 0.03), [width]);
  const acUnitGeo = useMemo(() => new THREE.BoxGeometry(0.08, 0.06, 0.05), []);

  const windowFrontData = useMemo(() => {
    const data = [];
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const idx = row * windowCols + col;
        const ws = windowStates[idx];
        const isLit = nightMode && ws.lit;
        data.push({
          pos: [
            -width / 2 + (width / (windowCols + 1)) * (col + 1),
            0.35 + row * 0.35,
            depth / 2 + 0.008,
          ],
          litFront: isLit,
          litBack: nightMode && ws.litBack,
          hasAC: row > 0 && col % 2 === 0 && Math.random() > 0.6,
        });
      }
    }
    return data;
  }, [windowRows, windowCols, width, depth, nightMode, windowStates]);

  return (
    <group position={position}>
      <mesh geometry={mainGeo} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={nightMode ? darkerColor : color}
          roughness={0.75}
          metalness={0.2}
          emissive={nightMode ? color : '#000000'}
          emissiveIntensity={nightMode ? 0.03 : 0}
        />
      </mesh>

      {height > 2.5 && style !== 2 && (
        <mesh geometry={topGeo} position={[0, height + 0.35, 0]} castShadow>
          <meshStandardMaterial color={lighterColor} roughness={0.72} metalness={0.25} />
        </mesh>
      )}

      <mesh geometry={roofGeo} position={[0, height + 0.07, 0]} castShadow>
        <meshStandardMaterial
          color={nightMode ? '#0a0a1e' : '#2a2a3e'}
          roughness={0.6}
          metalness={0.55}
        />
      </mesh>

      {height > 3 && (
        <mesh position={[width * 0.15, height + 0.22, depth * 0.1]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.15]} />
          <meshStandardMaterial color="#7a7a7a" metalness={0.6} roughness={0.5} />
        </mesh>
      )}

      {[height * 0.33, height * 0.66].map((y, i) => (
        <mesh key={`ledge-${i}`} geometry={ledgeGeo} position={[0, y, depth / 2 + 0.012]}>
          <meshStandardMaterial color={nightMode ? '#1a1a3e' : '#3a3a5e'} roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      <mesh geometry={entranceGeo} position={[0, 0.22, depth / 2 + 0.015]}>
        <meshStandardMaterial
          color={nightMode ? '#0a0a2e' : '#1a1a3e'}
          emissive={nightMode ? '#ffbb44' : '#000000'}
          emissiveIntensity={nightMode ? 0.4 : 0}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {height > 3 && (
        <group position={[width * 0.3, height + 0.14, -depth * 0.2]}>
          <mesh position={[0, 0.28, 0]} scale={[0.018, 0.55, 0.018]} geometry={GEO.cylinder6}>
            <meshStandardMaterial color="#888" metalness={0.95} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.58, 0]} scale={0.028} geometry={GEO.sphere6}>
            <meshStandardMaterial
              color="#ff4757"
              emissive="#ff4757"
              emissiveIntensity={nightMode ? 3 : 0.5}
            />
          </mesh>
        </group>
      )}

      {windowFrontData.map((w, i) => (
        <React.Fragment key={i}>
          <mesh position={w.pos}>
            <primitive object={WINDOW_GLASS_GEO} attach="geometry" />
            <meshStandardMaterial
              color={w.litFront ? '#ffe082' : '#a8ccdd'}
              transparent
              opacity={w.litFront ? 0.98 : 0.6}
              emissive={w.litFront ? '#ffcc33' : '#88aac2'}
              emissiveIntensity={w.litFront ? 0.7 : 0.1}
              roughness={0.05}
              metalness={w.litFront ? 0 : 0.8}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[w.pos[0], w.pos[1], -depth / 2 - 0.008]} rotation={[0, Math.PI, 0]}>
            <primitive object={WINDOW_GLASS_GEO} attach="geometry" />
            <meshStandardMaterial
              color={w.litBack ? '#ffe082' : '#a8ccdd'}
              transparent
              opacity={w.litBack ? 0.9 : 0.45}
              emissive={w.litBack ? '#ffcc33' : '#88aac2'}
              emissiveIntensity={w.litBack ? 0.5 : 0.06}
              roughness={0.05}
              metalness={0.8}
              depthWrite={false}
            />
          </mesh>
          {w.hasAC && (
            <mesh geometry={acUnitGeo} position={[w.pos[0], w.pos[1] - 0.13, depth / 2 + 0.03]}>
              <meshStandardMaterial color="#888" metalness={0.6} roughness={0.5} />
            </mesh>
          )}
        </React.Fragment>
      ))}
    </group>
  );
});

/* ============================================================
   STREET LAMP
   ============================================================ */
const StreetLamp = React.memo(({ position, nightMode }) => (
  <group position={position}>
    <mesh position={[0, 0.05, 0]} scale={[0.09, 0.1, 0.09]} geometry={GEO.cylinder8}>
      <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.6, 0]} scale={[0.028, 1.2, 0.028]} geometry={GEO.cylinder8} material={MAT_METAL_DARK} castShadow />
    <mesh position={[0.12, 1.15, 0]} rotation={[0, 0, -0.4]} scale={[0.015, 0.25, 0.015]} geometry={GEO.cylinder6} material={MAT_METAL_DARK} />
    <mesh position={[0.2, 1.19, 0]} scale={0.04} geometry={GEO.sphere8}>
      <meshStandardMaterial
        color={nightMode ? '#fff5cc' : '#666'}
        emissive={nightMode ? '#ffdd44' : '#000'}
        emissiveIntensity={nightMode ? 4 : 0}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
    {nightMode && (
      <pointLight
        position={[0.2, 1.15, 0]}
        intensity={0.6}
        color="#ffdd88"
        distance={4}
        decay={2}
      />
    )}
  </group>
));

/* ============================================================
   NPC
   ============================================================ */
const NPC = React.memo(({ pathRadius, speed, offset, color = '#ff6b9d' }) => {
  const ref = useRef();
  const legLeft = useRef();
  const legRight = useRef();
  const armLeft = useRef();
  const armRight = useRef();

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, roughness: 0.7, metalness: 0.05
  }), [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * pathRadius;
      ref.current.position.z = Math.sin(t) * pathRadius;
      ref.current.position.y = 0.25 + Math.abs(Math.sin(state.clock.elapsedTime * 8 * speed)) * 0.02;
      ref.current.rotation.y = -t + Math.PI / 2;
      const wc = state.clock.elapsedTime * 8 * speed;
      if (legLeft.current) legLeft.current.rotation.x = Math.sin(wc) * 0.5;
      if (legRight.current) legRight.current.rotation.x = Math.sin(wc + Math.PI) * 0.5;
      if (armLeft.current) armLeft.current.rotation.x = Math.sin(wc + Math.PI) * 0.4;
      if (armRight.current) armRight.current.rotation.x = Math.sin(wc) * 0.4;
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow scale={[0.12, 0.25, 0.1]} geometry={GEO.box1} material={bodyMat} />
      <mesh castShadow position={[0, 0.2, 0]} scale={0.075} geometry={GEO.sphere8} material={MAT_SKIN} />
      <group ref={armLeft} position={[0.08, 0.08, 0]}>
        <mesh position={[0, -0.09, 0]} scale={[0.028, 0.18, 0.028]} geometry={GEO.box1} material={bodyMat} />
      </group>
      <group ref={armRight} position={[-0.08, 0.08, 0]}>
        <mesh position={[0, -0.09, 0]} scale={[0.028, 0.18, 0.028]} geometry={GEO.box1} material={bodyMat} />
      </group>
      <group ref={legLeft} position={[-0.03, -0.125, 0]}>
        <mesh position={[0, -0.06, 0]} scale={[0.04, 0.12, 0.04]} geometry={GEO.box1} material={MAT_PANTS} />
      </group>
      <group ref={legRight} position={[0.03, -0.125, 0]}>
        <mesh position={[0, -0.06, 0]} scale={[0.04, 0.12, 0.04]} geometry={GEO.box1} material={MAT_PANTS} />
      </group>
    </group>
  );
});

/* ============================================================
   CAR
   ============================================================ */
const Car = React.memo(({ pathRadius, speed, offset, color = '#ff4757', direction = 1, nightMode }) => {
  const ref = useRef();
  const wheelRefs = [useRef(), useRef(), useRef(), useRef()];

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.85, roughness: 0.15, envMapIntensity: 1.5
  }), [color]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime() * speed * direction + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * pathRadius;
      ref.current.position.z = Math.sin(t) * pathRadius;
      ref.current.position.y = 0.12 + Math.sin(state.clock.elapsedTime * 15) * 0.005;
      ref.current.rotation.y = -t + (direction > 0 ? Math.PI / 2 : -Math.PI / 2);
      ref.current.rotation.z = Math.sin(t) * 0.02 * direction;
    }
    const ws = speed * 0.35 * direction;
    for (let i = 0; i < 4; i++) {
      if (wheelRefs[i].current) wheelRefs[i].current.rotation.z += ws;
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow scale={[0.5, 0.09, 0.22]} geometry={GEO.box1} material={bodyMat} />
      <mesh castShadow position={[0.02, 0.1, 0]} scale={[0.28, 0.11, 0.2]} geometry={GEO.box1} material={bodyMat} />
      <mesh position={[0.02, 0.11, 0]} scale={[0.22, 0.09, 0.19]} geometry={GEO.box1}>
        <meshStandardMaterial
          color="#0a0a2e"
          transparent
          opacity={0.7}
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={2}
        />
      </mesh>
      <mesh position={[0.27, -0.02, 0]} scale={[0.045, 0.07, 0.22]} geometry={GEO.box1}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.27, -0.02, 0]} scale={[0.045, 0.07, 0.2]} geometry={GEO.box1}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {[[-0.17, -0.06, 0.12], [-0.17, -0.06, -0.12], [0.17, -0.06, 0.12], [0.17, -0.06, -0.12]].map(
        (pos, i) => (
          <group key={i} position={pos}>
            <mesh ref={wheelRefs[i]} rotation={[Math.PI / 2, 0, 0]} scale={[0.045, 0.03, 0.045]} geometry={GEO.cylinder12} material={MAT_WHEEL} castShadow />
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.025, 0.031, 0.025]} geometry={GEO.cylinder12}>
              <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )
      )}
      <mesh position={[0.26, 0.01, 0.08]} scale={0.02} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#fff" emissive="#ffffee" emissiveIntensity={nightMode ? 4 : 1.2} />
      </mesh>
      <mesh position={[0.26, 0.01, -0.08]} scale={0.02} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#fff" emissive="#ffffee" emissiveIntensity={nightMode ? 4 : 1.2} />
      </mesh>
      <mesh position={[-0.26, 0.01, 0.08]} scale={0.016} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#ff0000" emissive="#ff2222" emissiveIntensity={nightMode ? 2.5 : 0.6} />
      </mesh>
      <mesh position={[-0.26, 0.01, -0.08]} scale={0.016} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#ff0000" emissive="#ff2222" emissiveIntensity={nightMode ? 2.5 : 0.6} />
      </mesh>
      {nightMode && (
        <spotLight
          position={[0.26, 0.01, 0]}
          angle={0.5}
          penumbra={0.4}
          intensity={2}
          color="#ffffcc"
          distance={4}
          decay={2}
          target-position={[1, 0, 0]}
        />
      )}
    </group>
  );
});

/* ============================================================
   TREE
   ============================================================ */
const Tree = React.memo(({ position, scale = 1, nightMode, variant = 0 }) => {
  const leavesRef = useRef();
  const frameCount = useRef(0);

  const leafColor1 = nightMode ? '#0e2a1a' : (variant === 1 ? '#1a6a3a' : '#2d7a3e');
  const leafColor2 = nightMode ? '#0e3a1a' : (variant === 1 ? '#2a7a4a' : '#3d8a4e');
  const leafColor3 = nightMode ? '#0e4a1a' : (variant === 1 ? '#3a8a5a' : '#4d9a5e');

  const leafMat1 = useMemo(() => new THREE.MeshStandardMaterial({
    color: leafColor1, roughness: 0.9, metalness: 0
  }), [leafColor1]);
  const leafMat2 = useMemo(() => new THREE.MeshStandardMaterial({
    color: leafColor2, roughness: 0.88, metalness: 0
  }), [leafColor2]);
  const leafMat3 = useMemo(() => new THREE.MeshStandardMaterial({
    color: leafColor3, roughness: 0.85, metalness: 0
  }), [leafColor3]);

  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    if (leavesRef.current) {
      const t = state.clock.getElapsedTime();
      leavesRef.current.rotation.y = Math.sin(t * 0.4 + position[0]) * 0.08;
      leavesRef.current.rotation.z = Math.cos(t * 0.3 + position[2]) * 0.04;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow scale={[0.06, 0.7, 0.06]} geometry={GEO.cylinder8} material={variant === 1 ? MAT_TRUNK_DARK : MAT_TRUNK} />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + (variant * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * 0.08, 0.02, Math.sin(a) * 0.08]} rotation={[0, a, Math.PI / 5]} scale={[0.022, 0.09, 0.022]} geometry={GEO.cylinder6} material={MAT_ROOT} />
        );
      })}
      <group ref={leavesRef}>
        <mesh position={[0, 0.85, 0]} castShadow scale={0.32} geometry={GEO.sphere10} material={leafMat1} />
        <mesh position={[0.13, 0.95, 0.09]} castShadow scale={0.22} geometry={GEO.sphere8} material={leafMat2} />
        <mesh position={[-0.11, 0.9, -0.07]} castShadow scale={0.2} geometry={GEO.sphere8} material={leafMat2} />
        <mesh position={[0.05, 1.05, -0.05]} scale={0.17} geometry={GEO.sphere8} material={leafMat3} />
        <mesh position={[-0.08, 1.0, 0.1]} scale={0.15} geometry={GEO.sphere8} material={leafMat3} />
      </group>
    </group>
  );
});

/* ============================================================
   BENCH
   ============================================================ */
const Bench = React.memo(({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    <mesh castShadow position={[0, 0.2, 0]} scale={[0.4, 0.03, 0.12]} geometry={GEO.box1}>
      <meshStandardMaterial color="#6b4226" roughness={0.85} metalness={0.05} />
    </mesh>
    <mesh castShadow position={[0, 0.35, -0.05]} scale={[0.4, 0.15, 0.02]} geometry={GEO.box1}>
      <meshStandardMaterial color="#6b4226" roughness={0.85} metalness={0.05} />
    </mesh>
    <mesh position={[-0.16, 0.1, 0]} scale={[0.02, 0.2, 0.1]} geometry={GEO.box1} material={MAT_METAL_DARK} />
    <mesh position={[0.16, 0.1, 0]} scale={[0.02, 0.2, 0.1]} geometry={GEO.box1} material={MAT_METAL_DARK} />
  </group>
));

/* ============================================================
   CYCLIST
   ============================================================ */
const Cyclist = ({ radius = 6, baseSpeed = 0.35, onProximity, speedRef, boostRef, trackIndex = 0 }) => {
  const groupRef = useRef();
  const wheelFrontRef = useRef();
  const wheelBackRef = useRef();
  const legLeftRef = useRef();
  const legRightRef = useRef();
  const proxTimer = useRef(0);

  const smoothSpeed = useRef(baseSpeed);
  const smoothRadius = useRef(radius);
  const smoothLean = useRef(0);
  const angleRef = useRef(0);

  const trackRadii = [4, 6, 8.5];
  const targetRadius = trackRadii[trackIndex] || radius;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    smoothSpeed.current = damp(smoothSpeed.current, speedRef.current, 4, dt);
    smoothRadius.current = damp(smoothRadius.current, targetRadius, 3, dt);

    angleRef.current += smoothSpeed.current * dt;
    const angle = angleRef.current;

    const x = Math.cos(angle) * smoothRadius.current;
    const z = Math.sin(angle) * smoothRadius.current;

    const targetLean = -Math.min(smoothSpeed.current * 0.3, 0.35);
    smoothLean.current = damp(smoothLean.current, targetLean, 5, dt);

    if (groupRef.current) {
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
      const bobFreq = state.clock.elapsedTime * 10 * smoothSpeed.current;
      groupRef.current.position.y = 0.15 + Math.abs(Math.sin(bobFreq)) * 0.018;
      groupRef.current.rotation.y = -angle + Math.PI / 2;
      groupRef.current.rotation.z = smoothLean.current;

      proxTimer.current += dt;
      if (proxTimer.current > 0.066) {
        proxTimer.current = 0;
        if (onProximity) onProximity({ x, z, angle });
      }
    }

    const wheelRotSpeed = state.clock.elapsedTime * 12 * (smoothSpeed.current / baseSpeed);
    if (wheelFrontRef.current) wheelFrontRef.current.rotation.x = wheelRotSpeed;
    if (wheelBackRef.current) wheelBackRef.current.rotation.x = wheelRotSpeed;
    if (legLeftRef.current) legLeftRef.current.rotation.x = Math.sin(wheelRotSpeed) * 0.55;
    if (legRightRef.current) legRightRef.current.rotation.x = Math.sin(wheelRotSpeed + Math.PI) * 0.55;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0.25, 0]} scale={[0.6, 0.03, 0.03]} geometry={GEO.box1}>
        <meshStandardMaterial color="#ff4757" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[-0.12, 0.32, 0]} rotation={[0, 0, 0.15]} scale={[0.012, 0.15, 0.012]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#ff4757" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.22, 0.32, 0]} rotation={[0, 0, -0.15]} scale={[0.012, 0.15, 0.012]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#ff4757" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.24, 0.38, 0]} scale={[0.02, 0.02, 0.14]} geometry={GEO.box1} material={MAT_METAL_LIGHT} />
      <mesh ref={wheelFrontRef} castShadow position={[0.35, 0.12, 0]}>
        <torusGeometry args={[0.12, 0.022, 10, 20]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh ref={wheelBackRef} castShadow position={[-0.35, 0.12, 0]}>
        <torusGeometry args={[0.12, 0.022, 10, 20]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.1, 0.38, 0]} scale={[0.1, 0.03, 0.06]} geometry={GEO.box1}>
        <meshStandardMaterial color="#0d0d1a" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.02, 0.56, 0]} scale={[0.16, 0.28, 0.14]} geometry={GEO.box1}>
        <meshStandardMaterial color="#00d4ff" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0.04, 0.84, 0]} scale={0.1} geometry={GEO.sphere10} material={MAT_SKIN} />
      <mesh castShadow position={[0.04, 0.9, 0]}>
        <sphereGeometry args={[0.11, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff4757" roughness={0.3} metalness={0.4} />
      </mesh>
      <group position={[-0.08, 0.42, 0.05]}>
        <mesh ref={legLeftRef} scale={[0.04, 0.24, 0.04]} geometry={GEO.box1} material={MAT_PANTS} />
      </group>
      <group position={[-0.08, 0.42, -0.05]}>
        <mesh ref={legRightRef} scale={[0.04, 0.24, 0.04]} geometry={GEO.box1} material={MAT_PANTS} />
      </group>
      <mesh position={[0.1, 0.55, 0.08]} rotation={[0, 0, -0.6]} scale={[0.03, 0.16, 0.03]} geometry={GEO.box1} material={MAT_SKIN} />
      <mesh position={[0.1, 0.55, -0.08]} rotation={[0, 0, -0.6]} scale={[0.03, 0.16, 0.03]} geometry={GEO.box1} material={MAT_SKIN} />
      {boostRef.current && (
        <Sparkles count={15} scale={1.4} size={4} speed={4} color="#00d4ff" position={[-0.35, 0.12, 0]} />
      )}
    </group>
  );
};

/* ============================================================
   ACHIEVEMENT PILLAR
   ============================================================ */
const AchievementPillar = ({ achievement, onClick, isHovered, setHovered, isDiscovered, isNearby, nightMode }) => {
  const trophyRef = useRef();
  const glowRef = useRef();
  const ringRefs = useRef([]);
  const smoothScale = useRef(1);

  const radius = 11;
  const x = Math.cos(achievement.angle) * radius;
  const z = Math.sin(achievement.angle) * radius;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    if (trophyRef.current) {
      trophyRef.current.rotation.y = t * (isNearby ? 2 : 0.8);
      trophyRef.current.position.y = 2.5 + Math.sin(t * 2 + achievement.id) * (isNearby ? 0.25 : 0.1);
      const targetScale = isNearby ? 1.3 : 1;
      smoothScale.current = damp(smoothScale.current, targetScale, 6, dt);
      trophyRef.current.scale.setScalar(smoothScale.current);
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = isNearby
        ? 0.45 + Math.sin(t * 5) * 0.15
        : 0.15 + Math.sin(t * 2) * 0.08;
    }

    for (let i = 0; i < ringRefs.current.length; i++) {
      const ring = ringRefs.current[i];
      if (ring) {
        ring.rotation.y = t * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
        ring.position.y = 0.15 + i * 0.12 + Math.sin(t * 2 + i) * 0.04;
      }
    }
  });

  return (
    <group
      position={[x, 0, z]}
      onClick={(e) => { e.stopPropagation(); onClick(achievement); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(achievement.id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = 'grab'; }}
    >
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.1, 24]} />
        <meshStandardMaterial
          color={achievement.color}
          metalness={0.8}
          roughness={0.2}
          emissive={achievement.color}
          emissiveIntensity={isNearby ? 0.4 : 0.12}
        />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => ringRefs.current[i] = el} position={[0, 0.15 + i * 0.12, 0]}>
          <torusGeometry args={[0.45 + i * 0.12, 0.018, 10, 20]} />
          <meshStandardMaterial
            color={achievement.color}
            emissive={achievement.color}
            emissiveIntensity={isNearby ? 1.5 : 0.6}
            transparent
            opacity={0.4 - i * 0.08}
            metalness={0.9}
            roughness={0.15}
            depthWrite={false}
          />
        </mesh>
      ))}

      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 2, 12]} />
        <meshStandardMaterial
          color={achievement.color}
          emissive={achievement.color}
          emissiveIntensity={isNearby ? 0.7 : 0.25}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {[0.8, 1.2, 1.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.15, 0.012, 8, 16]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={1}
            roughness={0.05}
            emissive="#ffd700"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      <group ref={trophyRef} position={[0, 2.5, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={achievement.color}
            emissive={achievement.color}
            emissiveIntensity={isNearby ? 2 : 0.7}
            metalness={1}
            roughness={0}
          />
        </mesh>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshBasicMaterial color={achievement.color} transparent opacity={0.15} side={THREE.BackSide} depthWrite={false} />
        </mesh>
      </group>

      {isNearby && (
        <Sparkles count={25} scale={2.2} size={4} speed={1} color={achievement.color} position={[0, 2.5, 0]} />
      )}

      {isNearby && <pointLight position={[0, 2.5, 0]} intensity={3} color={achievement.color} distance={6} />}

      {isDiscovered && (
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 7, 6]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}

      <Html position={[0, 3.5, 0]} center distanceFactor={10} occlude={false}>
        <div className={`preview__marker-label ${isHovered ? 'is-hovered' : ''} ${isNearby ? 'is-nearby' : ''} ${isDiscovered ? 'is-discovered' : ''}`} style={{ '--marker-color': achievement.color }}>
          {isDiscovered && <div className="preview__marker-discovered">✓ DISCOVERED</div>}
          <div className="preview__marker-icon">{achievement.icon}</div>
          <div className="preview__marker-rarity">{achievement.rarity}</div>
          <div className="preview__marker-title">{achievement.title}</div>
          <div className="preview__marker-sub">{achievement.subtitle}</div>
          {isNearby && <div className="preview__marker-hint">🎯 Click to View!</div>}
        </div>
      </Html>
    </group>
  );
};

/* ============================================================
   PROJECT PORTAL
   ============================================================ */
const ProjectPortal = ({ project, onNavigate, isNearby }) => {
  const portalRef = useRef();
  const ringRef = useRef();
  const innerRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (portalRef.current) {
      portalRef.current.position.y = project.pos[1] + Math.sin(t + project.id) * 0.2;
      portalRef.current.rotation.y = t * 0.35;
    }
    if (ringRef.current) ringRef.current.rotation.z = t * (isNearby ? 2 : 1);
    if (innerRingRef.current) innerRingRef.current.rotation.z = -t * 1.3;
  });

  return (
    <group
      ref={portalRef}
      position={project.pos}
      onClick={(e) => { e.stopPropagation(); onNavigate(project.link); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'grab'; }}
    >
      <mesh castShadow position={[0, -1.5, 0]} scale={[0.04, 3, 0.04]} geometry={GEO.cylinder8}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.7, 0.04, 12, 24]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={isNearby ? 2 : 0.8}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.5, 0.025, 10, 20]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={isNearby ? 1.2 : 0.6}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={isNearby ? 0.6 : 0.3}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={0.1} geometry={GEO.sphere10}>
        <meshBasicMaterial color={project.color} />
      </mesh>
      {isNearby && (
        <>
          <Sparkles count={25} scale={1.3} size={3.5} speed={0.7} color={project.color} />
          <pointLight intensity={4} color={project.color} distance={7} decay={2} />
        </>
      )}
      <Html position={[0, -2.2, 0]} center distanceFactor={10}>
        <div className={`preview__portal-label ${isNearby ? 'is-nearby' : ''}`} style={{ '--portal-color': project.color }}>
          <div className="preview__portal-icon">{project.icon}</div>
          <div className="preview__portal-name">{project.name}</div>
          <div className="preview__portal-desc">{project.desc}</div>
          {isNearby && <div className="preview__portal-hint">🚀 View Work!</div>}
        </div>
      </Html>
    </group>
  );
};

/* ============================================================
   CENTRAL HUB (without name label - keeps avatar only)
   ============================================================ */
const CentralHub = React.memo(({ avatarImg, nightMode }) => {
  const platformRef = useRef();
  const auraRef = useRef();
  const topRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (platformRef.current) platformRef.current.rotation.y = t * 0.12;
    if (auraRef.current) auraRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
    if (topRingRef.current) topRingRef.current.rotation.y = t * 0.6;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 3, 16]} />
        <meshStandardMaterial
          color={nightMode ? '#1a1a4e' : '#4a4a8e'}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={platformRef} castShadow position={[0, 3.1, 0]}>
        <cylinderGeometry args={[1.1, 0.8, 0.2, 16]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
      <mesh ref={topRingRef} position={[0, 3.2, 0]}>
        <torusGeometry args={[1, 0.025, 14, 40]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1}
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={auraRef} position={[0, 3.15, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.03, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh position={[0, 4.3, 0]} scale={[0.018, 2.2, 0.018]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#888" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 5.5, 0]} scale={0.06} geometry={GEO.sphere8}>
        <meshStandardMaterial color="#ff4757" emissive="#ff4757" emissiveIntensity={1.5} />
      </mesh>
      <Sparkles count={20} scale={2.5} size={2.5} speed={0.25} color="#00d4ff" position={[0, 3.5, 0]} />
      <pointLight position={[0, 3.5, 0]} intensity={1.5} color="#00d4ff" distance={8} />
      <Html position={[0, 4, 0]} center distanceFactor={8}>
        <div className="preview__avatar-hub">
          <img src={avatarImg} alt="Mohit" className="preview__avatar-img" />
          <div className="preview__avatar-name">MOHIT GROVER</div>
          <div className="preview__avatar-title">🚀 Developer & Innovator</div>
        </div>
      </Html>
    </group>
  );
});

/* ============================================================
   ISLAND
   ============================================================ */
const EnhancedGrassyIsland = React.memo(({ nightMode }) => {
  const buildings = useMemo(() => [
    { pos: [5, 0, -5], h: 3.5, w: 1.5, d: 1.3, c: '#5a5a8e', s: 0 },
    { pos: [-6, 0, -4], h: 4.2, w: 1.3, d: 1.2, c: '#4a4a7e', s: 1 },
    { pos: [7, 0, 3], h: 2.8, w: 1.7, d: 1.5, c: '#6a6a9e', s: 0 },
    { pos: [-7, 0, 5], h: 3.2, w: 1.2, d: 1.1, c: '#505080', s: 2 },
    { pos: [4, 0, 6], h: 3.8, w: 1.1, d: 1.0, c: '#4848ae', s: 1 },
    { pos: [-4, 0, -7], h: 4.0, w: 1.4, d: 1.3, c: '#5858b8', s: 0 },
    { pos: [6.5, 0, -1.5], h: 2.5, w: 1.3, d: 1.2, c: '#6a5a9e', s: 2 },
    { pos: [-5.5, 0, 2], h: 3.6, w: 1.2, d: 1.4, c: '#4a5a8e', s: 1 },
    { pos: [3, 0, -8], h: 3.0, w: 1.0, d: 0.9, c: '#555588', s: 0 },
    { pos: [-3, 0, 8], h: 2.6, w: 1.1, d: 1.0, c: '#606090', s: 2 },
    { pos: [8, 0, -3], h: 2.2, w: 0.9, d: 0.8, c: '#5555aa', s: 1 },
    { pos: [-8, 0, -1], h: 2.9, w: 1.0, d: 1.0, c: '#4a4a88', s: 0 },
  ], []);

  const trees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 3.5 + Math.random() * 8.5;
      arr.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        scale: 0.5 + Math.random() * 0.7,
        variant: i % 2,
      });
    }
    return arr;
  }, []);

  const lamps = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      [4.8, 6.8, 8.8].forEach((r, idx) => {
        if ((i + idx) % 3 !== 0) arr.push([Math.cos(angle) * r, 0, Math.sin(angle) * r]);
      });
    }
    return arr;
  }, []);

  const benches = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + 0.2;
      const r = 5.2 + (i % 2) * 2.5;
      arr.push({ pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r], rot: angle + Math.PI / 2 });
    }
    return arr;
  }, []);

  const grassPatches = useMemo(() => {
    const patches = [];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 13;
      patches.push({
        pos: [Math.cos(angle) * dist, 0.015, Math.sin(angle) * dist],
        scale: 0.08 + Math.random() * 0.14,
        rot: Math.random() * Math.PI,
      });
    }
    return patches;
  }, []);

  return (
    <group>
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[15, 13.5, 0.8, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#0e2818' : '#3a7a4a'}
          roughness={0.98}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.3, 48]} />
        <meshStandardMaterial
          color={nightMode ? '#0e3a1a' : '#2d7a3e'}
          roughness={0.98}
          metalness={0}
        />
      </mesh>

      {grassPatches.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, p.rot]}>
          <circleGeometry args={[p.scale, 8]} />
          <meshStandardMaterial
            color={nightMode ? '#0e4a1a' : '#2a9a3e'}
            transparent
            opacity={0.6}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 4.6, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#1a1a28' : '#3a3a45'}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.95, 4.05, 64]} />
        <meshBasicMaterial color="#ffee44" transparent opacity={nightMode ? 0.7 : 0.5} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.012, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.7, 5.4, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#1a3a25' : '#5a8a5a'}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 6.6, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#1a1a28' : '#3a3a45'}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.0, 6.08, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={nightMode ? 0.6 : 0.4} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.012, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.7, 7.9, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#1a3a25' : '#5a8a5a'}
          roughness={0.95}
        />
      </mesh>

      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.0, 9.1, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#1a1a28' : '#3a3a45'}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.48, 8.58, 64]} />
        <meshBasicMaterial color="#ffee44" transparent opacity={nightMode ? 0.7 : 0.5} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.008, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.2, 14.5, 64]} />
        <meshStandardMaterial
          color={nightMode ? '#0e2818' : '#3a7a4a'}
          roughness={0.98}
        />
      </mesh>

      <mesh position={[0, -1.8, 0]}>
        <coneGeometry args={[12, 3.5, 20]} />
        <meshStandardMaterial
          color={nightMode ? '#0a0a18' : '#5a4a3a'}
          roughness={1}
        />
      </mesh>
      <mesh position={[0, -2.5, 0]}>
        <coneGeometry args={[8, 2, 16]} />
        <meshStandardMaterial
          color={nightMode ? '#080812' : '#4a3a2a'}
          roughness={1}
        />
      </mesh>

      {buildings.map((b, i) => (
        <RealisticBuilding key={i} position={b.pos} height={b.h} width={b.w} depth={b.d} color={nightMode ? '#2a2a5e' : b.c} nightMode={nightMode} style={b.s} />
      ))}

      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} scale={t.scale} nightMode={nightMode} variant={t.variant} />
      ))}

      {lamps.map((l, i) => (
        <StreetLamp key={i} position={l} nightMode={nightMode} />
      ))}

      {benches.map((b, i) => (
        <Bench key={i} position={b.pos} rotation={b.rot} />
      ))}
    </group>
  );
});

/* ============================================================
   SKY & ATMOSPHERE
   ============================================================ */
const SkyAtmosphere = React.memo(({ nightMode }) => {
  const { scene } = useThree();
  const currentBg = useRef(new THREE.Color('#87ceeb'));
  const dayColor = useMemo(() => new THREE.Color('#87ceeb'), []);
  const nightColor = useMemo(() => new THREE.Color('#020412'), []);
  const nebulaRef = useRef();
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    frameCount.current++;
    if (frameCount.current % 3 === 0) {
      const target = nightMode ? nightColor : dayColor;
      currentBg.current.lerp(target, 0.04);
      scene.background = currentBg.current;
      if (scene.fog) scene.fog.color.lerp(target, 0.04);
    }
    if (nebulaRef.current && frameCount.current % 5 === 0) {
      nebulaRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <>
      <fog attach="fog" args={['#87ceeb', 40, 90]} />

      {!nightMode && (
        <>
          <Sky
            distance={450000}
            sunPosition={[100, 40, 100]}
            inclination={0.5}
            azimuth={0.25}
            turbidity={8}
            rayleigh={2}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          <mesh position={[30, 25, -40]}>
            <sphereGeometry args={[2.5, 24, 24]} />
            <meshBasicMaterial color="#fff8e1" />
          </mesh>
          <mesh position={[30, 25, -40]}>
            <sphereGeometry args={[5, 16, 16]} />
            <meshBasicMaterial color="#ffee88" transparent opacity={0.15} side={THREE.BackSide} depthWrite={false} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => (
            <group key={`cloud-${i}`} position={[Math.cos(i * 1.4) * 35, 18 + i * 1.5, Math.sin(i * 1.4) * 35 - 15]}>
              <mesh>
                <sphereGeometry args={[3 + i * 0.4, 10, 10]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.7} roughness={1} depthWrite={false} />
              </mesh>
              <mesh position={[2, 0.3, 0]}>
                <sphereGeometry args={[2.5, 10, 10]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.65} roughness={1} depthWrite={false} />
              </mesh>
              <mesh position={[-1.8, -0.2, 0.5]}>
                <sphereGeometry args={[2, 10, 10]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.6} roughness={1} depthWrite={false} />
              </mesh>
            </group>
          ))}
        </>
      )}

      {nightMode && (
        <>
          <Stars radius={200} depth={80} count={7000} factor={5} saturation={0.3} fade speed={0.3} />
          <Stars radius={100} depth={40} count={2000} factor={8} saturation={0.5} fade speed={0.15} />

          <group ref={nebulaRef}>
            <mesh position={[40, 25, -50]}>
              <sphereGeometry args={[15, 14, 14]} />
              <meshBasicMaterial color="#6b2fa0" transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[-50, 20, -40]}>
              <sphereGeometry args={[18, 14, 14]} />
              <meshBasicMaterial color="#1a3a8a" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[0, 35, -60]}>
              <sphereGeometry args={[20, 14, 14]} />
              <meshBasicMaterial color="#ff4488" transparent opacity={0.025} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[-30, 15, 50]}>
              <sphereGeometry args={[14, 14, 14]} />
              <meshBasicMaterial color="#00aaaa" transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
            </mesh>
          </group>

          <mesh position={[-25, 30, -50]}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
              color="#e8e8d8"
              emissive="#ccccaa"
              emissiveIntensity={0.5}
              roughness={0.95}
              metalness={0}
            />
          </mesh>
          <mesh position={[-25, 30, -50]}>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial color="#ccccaa" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
          </mesh>
        </>
      )}
    </>
  );
});

/* ============================================================
   LIGHTING
   ============================================================ */
const SceneLighting = ({ nightMode }) => {
  const ambientRef = useRef();
  const dirRef = useRef();
  const hemiRef = useRef();
  const moonRef = useRef();
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    const dt = Math.min(delta * 3, 0.15);

    if (ambientRef.current) {
      const t = nightMode ? 0.12 : 0.5;
      ambientRef.current.intensity = damp(ambientRef.current.intensity, t, 2, dt);
    }
    if (dirRef.current) {
      const t = nightMode ? 0.1 : 1.3;
      dirRef.current.intensity = damp(dirRef.current.intensity, t, 2, dt);
      const targetColor = nightMode ? new THREE.Color('#4466aa') : new THREE.Color('#fff5e0');
      dirRef.current.color.lerp(targetColor, 0.05);
    }
    if (hemiRef.current) {
      const t = nightMode ? 0.2 : 0.55;
      hemiRef.current.intensity = damp(hemiRef.current.intensity, t, 2, dt);
    }
    if (moonRef.current) {
      moonRef.current.intensity = nightMode ? 0.4 : 0;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.5} />
      <directionalLight
        ref={dirRef}
        position={[20, 30, 15]}
        intensity={1.3}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight
        ref={moonRef}
        position={[-25, 30, -50]}
        intensity={0}
        color="#8899cc"
      />
      <hemisphereLight
        ref={hemiRef}
        args={[
          nightMode ? '#0a0a3e' : '#87ceeb',
          nightMode ? '#0a0a1e' : '#3a5a2a',
          0.55,
        ]}
      />
      <pointLight position={[0, 8, 0]} intensity={nightMode ? 0.9 : 0.3} color="#00d4ff" distance={12} />
    </>
  );
};

/* ============================================================
   CAMERA CONTROLLER
   ============================================================ */
const CameraController = ({ keysPressed }) => {
  const { camera } = useThree();
  const rotRef = useRef(0);
  const targetRef = useRef(0);
  const velRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    let input = 0;
    if (keysPressed.current.a || keysPressed.current.ArrowLeft) input -= 1;
    if (keysPressed.current.d || keysPressed.current.ArrowRight) input += 1;

    velRef.current += input * 2.5 * dt;
    velRef.current *= Math.pow(0.001, dt);
    velRef.current = Math.max(-1.5, Math.min(1.5, velRef.current));

    targetRef.current += velRef.current * dt;
    rotRef.current = damp(rotRef.current, targetRef.current, 6, dt);

    if (Math.abs(velRef.current) > 0.001 || Math.abs(targetRef.current - rotRef.current) > 0.001) {
      camera.position.x = Math.sin(rotRef.current) * 24;
      camera.position.z = Math.cos(rotRef.current) * 24;
      camera.position.y = 14;
      camera.lookAt(0, 2, 0);
    }
  });

  return null;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const Preview = () => {
  const navigate = useNavigate();
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [discoveredAchievements, setDiscoveredAchievements] = useState(new Set());
  const [nearbyAchievements, setNearbyAchievements] = useState(new Set());
  const [nearbyProjects, setNearbyProjects] = useState(new Set());
  const [discoveryNotification, setDiscoveryNotification] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(1);
  const [dpr, setDpr] = useState(1.25);

  const keysPressed = useRef({});
  const speedRef = useRef(0.35);
  const boostRef = useRef(false);
  const discoveredRef = useRef(new Set());
  const controlsRef = useRef();

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 1800);
    const t2 = setTimeout(() => setShowIntro(false), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const down = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'w' || e.key === 'ArrowUp') {
        speedRef.current = Math.min(speedRef.current + 0.08, 1.3);
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        speedRef.current = Math.max(speedRef.current - 0.08, 0.05);
      }
      if (e.key === ' ') {
        e.preventDefault();
        boostRef.current = true;
        speedRef.current = 1.6;
      }
      if (e.key === '1') setCurrentTrack(0);
      if (e.key === '2') setCurrentTrack(1);
      if (e.key === '3') setCurrentTrack(2);
      if (e.key === 'n' || e.key === 'N') setNightMode(prev => !prev);
    };

    const up = (e) => {
      keysPressed.current[e.key] = false;
      if (e.key === ' ') {
        boostRef.current = false;
        speedRef.current = 0.35;
      }
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const handleProximity = useCallback((pos) => {
    const achRadius = 11;
    const threshold = 3.5;
    const newNearby = new Set();

    achievements.forEach((a) => {
      const ax = Math.cos(a.angle) * achRadius;
      const az = Math.sin(a.angle) * achRadius;
      const dx = pos.x - ax;
      const dz = pos.z - az;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < threshold) {
        newNearby.add(a.id);
        if (!discoveredRef.current.has(a.id)) {
          discoveredRef.current.add(a.id);
          setDiscoveredAchievements(new Set(discoveredRef.current));
          setDiscoveryNotification(a);
          setTimeout(() => setDiscoveryNotification(null), 3500);
        }
      }
    });

    setNearbyAchievements(prev => {
      if (prev.size === newNearby.size && [...prev].every(id => newNearby.has(id))) return prev;
      return newNearby;
    });

    const newNP = new Set();
    projects.forEach((p) => {
      const dx = pos.x - p.pos[0];
      const dz = pos.z - p.pos[2];
      if (Math.sqrt(dx * dx + dz * dz) < 4.5) newNP.add(p.id);
    });
    setNearbyProjects(prev => {
      if (prev.size === newNP.size && [...prev].every(id => newNP.has(id))) return prev;
      return newNP;
    });
  }, []);

  const handleNavigate = useCallback((link) => {
    navigate(link);
  }, [navigate]);

  return (
    <div className={`preview ${nightMode ? 'is-night' : ''}`}>
      {loading && (
        <div className="preview__loader">
          <div className="preview__loader-inner">
            <div className="preview__loader-city">
              <div className="preview__loader-building b1" />
              <div className="preview__loader-building b2" />
              <div className="preview__loader-building b3" />
              <div className="preview__loader-building b4" />
              <div className="preview__loader-building b5" />
            </div>
            <div className="preview__loader-text">BUILDING MOHIT'S CITY</div>
            <div className="preview__loader-bar">
              <div className="preview__loader-fill" />
            </div>
          </div>
        </div>
      )}

      {showIntro && !loading && (
        <div className="preview__intro">
          <div className="preview__intro-emoji">🏙️</div>
          <div className="preview__intro-text">WELCOME TO THE CITY</div>
          <div className="preview__intro-sub">Explore Mohit's achievements</div>
          <div className="preview__intro-controls">
            <div className="preview__intro-row">
              <span className="key">W</span><span className="key">S</span>
              <span className="preview__intro-hint">Speed</span>
            </div>
            <div className="preview__intro-row">
              <span className="key">A</span><span className="key">D</span>
              <span className="preview__intro-hint">Rotate</span>
            </div>
            <div className="preview__intro-row">
              <span className="key key--wide">SPACE</span>
              <span className="preview__intro-hint">Boost</span>
            </div>
            <div className="preview__intro-row">
              <span className="key">1</span><span className="key">2</span><span className="key">3</span>
              <span className="preview__intro-hint">Track</span>
            </div>
            <div className="preview__intro-row">
              <span className="preview__intro-hint">🖱️ Hold & Drag • Scroll • Pinch on mobile</span>
            </div>
          </div>
        </div>
      )}

      {discoveryNotification && (
        <div className="preview__discovery" style={{ '--disc-color': discoveryNotification.color }}>
          <div className="preview__discovery-icon">{discoveryNotification.icon}</div>
          <div className="preview__discovery-content">
            <div className="preview__discovery-label">✨ ACHIEVEMENT!</div>
            <div className="preview__discovery-title">{discoveryNotification.title}</div>
            <div className="preview__discovery-sub">{discoveryNotification.description}</div>
          </div>
          <div className="preview__discovery-rarity" style={{ color: discoveryNotification.color }}>
            {discoveryNotification.rarity}
          </div>
        </div>
      )}

      {/* LOGO REMOVED — HUD now only has actions on right */}
      <div className="preview__hud-top">
        <div className="preview__hud-spacer" />
        <div className="preview__hud-actions">
          <button
            className={`preview__hud-btn preview__night-toggle ${nightMode ? 'is-active' : ''}`}
            onClick={() => setNightMode(!nightMode)}
            aria-label="Toggle night mode"
          >
            <span className="preview__toggle-icon">{nightMode ? '☀️' : '🌙'}</span>
          </button>
          <Link to="/about" className="preview__hud-btn" aria-label="About">👤</Link>
          <Link to="/work" className="preview__hud-btn" aria-label="Work">💼</Link>
        </div>
      </div>

      <div className="preview__touch-controls">
        <div className="preview__touch-tracks">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={`preview__touch-track ${currentTrack === i ? 'is-active' : ''}`}
              onClick={() => setCurrentTrack(i)}
            >{i + 1}</button>
          ))}
        </div>
        <button
          className="preview__touch-btn preview__touch-btn--night"
          onClick={() => setNightMode(!nightMode)}
        >{nightMode ? '☀️' : '🌙'}</button>
      </div>

      <div className="preview__side-hint">
        <div className="preview__hint-dot" />
        <span>Hold & drag to orbit • Scroll to zoom • Pinch on mobile</span>
      </div>

      <Canvas
        shadows="soft"
        camera={{ position: [0, 14, 24], fov: 42, near: 0.1, far: 200 }}
        dpr={[0.8, dpr]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        performance={{ min: 0.5 }}
        style={{ touchAction: 'none' }}
        frameloop="always"
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(1.5, dpr + 0.1))}
          onDecline={() => setDpr(Math.max(0.75, dpr - 0.15))}
          flipflops={3}
          onFallback={() => setDpr(0.8)}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <SkyAtmosphere nightMode={nightMode} />
        <SceneLighting nightMode={nightMode} />

        <Suspense fallback={null}>
          <CameraController keysPressed={keysPressed} />
          <EnhancedGrassyIsland nightMode={nightMode} />
          <CentralHub avatarImg={m1} nightMode={nightMode} />

          <Cyclist
            radius={6}
            baseSpeed={0.35}
            onProximity={handleProximity}
            speedRef={speedRef}
            boostRef={boostRef}
            trackIndex={currentTrack}
          />

          <NPC pathRadius={3} speed={0.18} offset={0} color="#ff6b9d" />
          <NPC pathRadius={3.2} speed={0.14} offset={Math.PI} color="#6bc5ff" />
          <NPC pathRadius={5} speed={0.11} offset={1} color="#ffaa00" />
          <NPC pathRadius={5.3} speed={0.16} offset={3} color="#55cc44" />
          <NPC pathRadius={7.2} speed={0.09} offset={2} color="#b344f0" />
          <NPC pathRadius={7.6} speed={0.13} offset={4.5} color="#ff4757" />

          <Car pathRadius={4} speed={0.45} offset={0} color="#ff4757" direction={1} nightMode={nightMode} />
          <Car pathRadius={4} speed={0.40} offset={Math.PI} color="#3baaff" direction={1} nightMode={nightMode} />
          <Car pathRadius={6} speed={0.35} offset={0.5} color="#ffaa00" direction={-1} nightMode={nightMode} />
          <Car pathRadius={6} speed={0.32} offset={Math.PI + 0.5} color="#00e676" direction={-1} nightMode={nightMode} />
          <Car pathRadius={8.5} speed={0.50} offset={1} color="#943fff" direction={1} nightMode={nightMode} />
          <Car pathRadius={8.5} speed={0.44} offset={Math.PI + 1} color="#ff6b9d" direction={1} nightMode={nightMode} />

          {achievements.map((a) => (
            <AchievementPillar
              key={a.id}
              achievement={a}
              onClick={setSelectedAchievement}
              isHovered={hoveredMarker === a.id}
              setHovered={setHoveredMarker}
              isDiscovered={discoveredAchievements.has(a.id)}
              isNearby={nearbyAchievements.has(a.id)}
              nightMode={nightMode}
            />
          ))}

          {projects.map((p) => (
            <ProjectPortal
              key={p.id}
              project={p}
              onNavigate={handleNavigate}
              isNearby={nearbyProjects.has(p.id)}
            />
          ))}

          <ContactShadows
            position={[0, -0.2, 0]}
            opacity={nightMode ? 0.25 : 0.5}
            scale={35}
            blur={2.5}
            far={5}
            resolution={1024}
          />

          <Environment preset={nightMode ? 'night' : 'sunset'} background={false} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={12}
          maxDistance={45}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.55}
          zoomSpeed={0.75}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
      </Canvas>

      {selectedAchievement && (
        <div className="preview__modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div
            className="preview__modal"
            onClick={(e) => e.stopPropagation()}
            style={{ '--modal-color': selectedAchievement.color }}
          >
            <button className="preview__modal-close" onClick={() => setSelectedAchievement(null)}>✕</button>
            <div className="preview__modal-glow" />
            <div className="preview__modal-icon">
              <div className="preview__modal-trophy">{selectedAchievement.icon}</div>
            </div>
            <div className="preview__modal-rarity">{selectedAchievement.rarity}</div>
            <h2 className="preview__modal-title">{selectedAchievement.title}</h2>
            <p className="preview__modal-sub">{selectedAchievement.subtitle}</p>
            <p className="preview__modal-description">{selectedAchievement.description}</p>
            <div className="preview__modal-year">Year · {selectedAchievement.year}</div>
            {discoveredAchievements.has(selectedAchievement.id) && (
              <div className="preview__modal-discovered-badge">✓ Discovered</div>
            )}
            <Link to="/about" className="preview__modal-btn">View Full Story →</Link>
          </div>
        </div>
      )}

      <div className="preview__next">
        <Link to="/work" className="preview__next-link">
          <span className="preview__next-label">PROJECTS</span>
          <span className="preview__next-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Preview;