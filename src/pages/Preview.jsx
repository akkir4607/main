// Preview.jsx - PERFORMANCE OPTIMIZED & CLEAN UI
import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Float,
  Sparkles,
  Environment,
  ContactShadows,
  Html,
  Stars,
  Instances,
  Instance,
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from '@react-three/drei';
import * as THREE from 'three';
import m1 from '../images/m1.png';
import './Preview.css';

/* ============================================================
   SHARED GEOMETRIES & MATERIALS (created ONCE, reused everywhere)
   ============================================================ */
const GEO = {
  box1: new THREE.BoxGeometry(1, 1, 1),
  sphere8: new THREE.SphereGeometry(1, 8, 8),
  sphere10: new THREE.SphereGeometry(1, 10, 10),
  sphere6: new THREE.SphereGeometry(1, 6, 6),
  cylinder6: new THREE.CylinderGeometry(1, 1, 1, 6),
  cylinder8: new THREE.CylinderGeometry(1, 1, 1, 8),
  cylinder12: new THREE.CylinderGeometry(1, 1, 1, 12),
  plane: new THREE.PlaneGeometry(1, 1),
  torus: new THREE.TorusGeometry(1, 0.05, 8, 16),
  circle: new THREE.CircleGeometry(1, 8),
  octahedron: new THREE.OctahedronGeometry(1, 0),
  cone: new THREE.ConeGeometry(1, 1, 16),
};

// Window shared geometries
const WINDOW_GLASS_GEO = new THREE.PlaneGeometry(0.14, 0.2);
const WINDOW_FRAME_GEO = new THREE.PlaneGeometry(0.17, 0.24);

// Shared materials for common items
const MAT_TRUNK = new THREE.MeshStandardMaterial({ color: '#5c3a1e', roughness: 0.95 });
const MAT_TRUNK_DARK = new THREE.MeshStandardMaterial({ color: '#4a2a0e', roughness: 0.95 });
const MAT_ROOT = new THREE.MeshStandardMaterial({ color: '#3a1a0a', roughness: 1 });
const MAT_METAL_DARK = new THREE.MeshStandardMaterial({ color: '#444', metalness: 0.85, roughness: 0.2 });
const MAT_METAL_LIGHT = new THREE.MeshStandardMaterial({ color: '#555', metalness: 0.7, roughness: 0.3 });
const MAT_WHEEL = new THREE.MeshStandardMaterial({ color: '#1a1a2e', metalness: 0.3, roughness: 0.7 });
const MAT_SKIN = new THREE.MeshStandardMaterial({ color: '#f5c99b' });
const MAT_PANTS = new THREE.MeshStandardMaterial({ color: '#2c3e50' });

const achievements = [
  { id: 1, title: "Innoverse'36", subtitle: '1st Place Hackathon', year: '2025', color: '#ffaa00', angle: 0, rarity: 'LEGENDARY', icon: '👑', description: 'Conquered the ultimate hackathon challenge with innovative solutions' },
  { id: 2, title: 'HackCraft 2.0', subtitle: 'Organizer', year: '2025', color: '#b344f0', angle: Math.PI / 3, rarity: 'EPIC', icon: '🎯', description: 'Led and organized groundbreaking tech event for 500+ participants' },
  { id: 3, title: 'KPMG Intern', subtitle: 'Data Analytics', year: '2023', color: '#3baaff', angle: (2 * Math.PI) / 3, rarity: 'RARE', icon: '💼', description: 'Mastered data analytics and business intelligence in corporate world' },
  { id: 4, title: 'Honeywell', subtitle: 'Industry Visit', year: '2024', color: '#3baaff', angle: Math.PI, rarity: 'RARE', icon: '🏭', description: 'Explored cutting-edge industrial automation and IoT technologies' },
  { id: 5, title: 'SnapAR', subtitle: 'Workshop Lead', year: '2023', color: '#55cc44', angle: (4 * Math.PI) / 3, rarity: 'UNCOMMON', icon: '📸', description: 'Pioneered AR workshop teaching next-gen developers about spatial computing' },
  { id: 6, title: 'GITM Hack', subtitle: 'Organizer', year: '2024', color: '#b344f0', angle: (5 * Math.PI) / 3, rarity: 'EPIC', icon: '⚡', description: 'Orchestrated massive 48-hour coding marathon with 300+ participants' },
];

const projects = [
  { id: 1, name: 'SARA', desc: 'AI Voice Assistant', color: '#943fff', link: '/sara', pos: [9, 2.5, -6], icon: '🤖' },
  { id: 2, name: 'PHISH', desc: 'Security Scanner', color: '#00ff88', link: '/phish', pos: [-9, 2.5, -6], icon: '🛡️' },
  { id: 3, name: 'AIRGUARD', desc: 'IoT Air Monitor', color: '#00e676', link: '/airguard', pos: [9, 2.5, 6], icon: '🌿' },
  { id: 4, name: 'MGSHARE', desc: 'File Transfer', color: '#00d9ff', link: '/m', pos: [-9, 2.5, 6], icon: '📡' },
];

/* ============================================================
   REALISTIC BUILDING (OPTIMIZED with InstancedMesh for windows)
   ============================================================ */
const RealisticBuilding = React.memo(({ position, height = 2, width = 1, depth = 1, color = '#4a4a6e', nightMode, style = 0 }) => {
  const windowRows = Math.floor(height / 0.35);
  const windowCols = Math.max(2, Math.floor(width / 0.35));
  const totalWindows = windowRows * windowCols;

  // Cache window states
  const windowStates = useMemo(() => {
    const states = [];
    for (let i = 0; i < totalWindows; i++) {
      states.push({
        lit: Math.random() > 0.3,
        litBack: Math.random() > 0.5,
      });
    }
    return states;
  }, [totalWindows]);

  const darkerColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.7);
    return '#' + c.getHexString();
  }, [color]);

  const lighterColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(1.15);
    return '#' + c.getHexString();
  }, [color]);

  // Cached geometries per building instance
  const mainGeo = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth]);
  const topGeo = useMemo(() => new THREE.BoxGeometry(width * 0.7, 0.7, depth * 0.7), [width, depth]);
  const roofGeo = useMemo(() => new THREE.BoxGeometry(width + 0.06, 0.12, depth + 0.06), [width, depth]);
  const ledgeGeo = useMemo(() => new THREE.BoxGeometry(width + 0.04, 0.04, 0.02), [width]);
  const entranceGeo = useMemo(() => new THREE.BoxGeometry(width * 0.25, 0.4, 0.02), [width]);

  // Pre-compute window positions & materials
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
        });
      }
    }
    return data;
  }, [windowRows, windowCols, width, depth, nightMode, windowStates]);

  return (
    <group position={position}>
      {/* Main body - THE ONLY shadow caster per building */}
      <mesh geometry={mainGeo} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={nightMode ? darkerColor : color}
          roughness={0.85}
          metalness={0.15}
          emissive={nightMode ? color : '#000000'}
          emissiveIntensity={nightMode ? 0.02 : 0}
        />
      </mesh>

      {/* Top setback */}
      {height > 2.5 && style !== 2 && (
        <mesh geometry={topGeo} position={[0, height + 0.35, 0]}>
          <meshStandardMaterial color={lighterColor} roughness={0.8} metalness={0.2} />
        </mesh>
      )}

      {/* Roof slab */}
      <mesh geometry={roofGeo} position={[0, height + 0.06, 0]}>
        <meshStandardMaterial
          color={nightMode ? '#1a1a2e' : '#3a3a4e'}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* Ledges */}
      {[height * 0.33, height * 0.66].map((y, i) => (
        <mesh key={`ledge-${i}`} geometry={ledgeGeo} position={[0, y, depth / 2 + 0.01]}>
          <meshStandardMaterial color={nightMode ? '#2a2a4e' : '#5a5a7e'} roughness={0.6} metalness={0.4} />
        </mesh>
      ))}

      {/* Entrance */}
      <mesh geometry={entranceGeo} position={[0, 0.2, depth / 2 + 0.01]}>
        <meshStandardMaterial
          color={nightMode ? '#1a1a3e' : '#2a2a4e'}
          emissive={nightMode ? '#ffcc44' : '#000000'}
          emissiveIntensity={nightMode ? 0.3 : 0}
        />
      </mesh>

      {/* Antenna on tall buildings - simpler */}
      {height > 3 && (
        <group position={[width * 0.3, height + 0.12, -depth * 0.2]}>
          <mesh position={[0, 0.25, 0]} scale={[0.015, 0.5, 0.015]} geometry={GEO.cylinder6}>
            <meshStandardMaterial color="#777" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.52, 0]} scale={0.025} geometry={GEO.sphere6}>
            <meshStandardMaterial
              color="#ff4757"
              emissive="#ff4757"
              emissiveIntensity={nightMode ? 2.5 : 0.5}
            />
          </mesh>
        </group>
      )}

      {/* WINDOWS - single mesh per window but no shadows */}
      {windowFrontData.map((w, i) => (
        <React.Fragment key={i}>
          {/* Front glass */}
          <mesh position={w.pos}>
            <primitive object={WINDOW_GLASS_GEO} attach="geometry" />
            <meshStandardMaterial
              color={w.litFront ? '#ffe082' : '#88bbdd'}
              transparent
              opacity={w.litFront ? 0.95 : 0.55}
              emissive={w.litFront ? '#ffcc33' : '#88bbdd'}
              emissiveIntensity={w.litFront ? 0.5 : 0.08}
              roughness={0.1}
              metalness={w.litFront ? 0 : 0.6}
              depthWrite={false}
            />
          </mesh>
          {/* Back glass */}
          <mesh position={[w.pos[0], w.pos[1], -depth / 2 - 0.008]} rotation={[0, Math.PI, 0]}>
            <primitive object={WINDOW_GLASS_GEO} attach="geometry" />
            <meshStandardMaterial
              color={w.litBack ? '#ffe082' : '#88bbdd'}
              transparent
              opacity={w.litBack ? 0.85 : 0.4}
              emissive={w.litBack ? '#ffcc33' : '#88bbdd'}
              emissiveIntensity={w.litBack ? 0.35 : 0.05}
              depthWrite={false}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
});

/* ============================================================
   STREET LAMP (no updates - pure static)
   ============================================================ */
const StreetLamp = React.memo(({ position, nightMode }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} scale={[0.03, 1.2, 0.03]} geometry={GEO.cylinder8} material={MAT_METAL_DARK} />
      <mesh position={[0.12, 1.15, 0]} rotation={[0, 0, -0.4]} scale={[0.015, 0.25, 0.015]} geometry={GEO.cylinder6} material={MAT_METAL_DARK} />
      <mesh position={[0.2, 1.19, 0]} scale={0.035} geometry={GEO.sphere8}>
        <meshStandardMaterial
          color={nightMode ? '#fff5cc' : '#888'}
          emissive={nightMode ? '#ffdd44' : '#000'}
          emissiveIntensity={nightMode ? 3 : 0}
        />
      </mesh>
      {/* Only ONE light per lamp at night, low intensity */}
      {nightMode && (
        <pointLight
          position={[0.2, 1.15, 0]}
          intensity={0.5}
          color="#ffdd88"
          distance={3.5}
          decay={2}
        />
      )}
    </group>
  );
});

/* ============================================================
   NPC - shared materials, no shadows on small parts
   ============================================================ */
const NPC = React.memo(({ pathRadius, speed, offset, color = '#ff6b9d' }) => {
  const ref = useRef();
  const legLeft = useRef();
  const legRight = useRef();

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color }), [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * pathRadius;
      ref.current.position.z = Math.sin(t) * pathRadius;
      ref.current.position.y = 0.25;
      ref.current.rotation.y = -t + Math.PI / 2;
      const wc = state.clock.elapsedTime * 8 * speed;
      if (legLeft.current) legLeft.current.rotation.x = Math.sin(wc) * 0.4;
      if (legRight.current) legRight.current.rotation.x = Math.sin(wc + Math.PI) * 0.4;
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow scale={[0.12, 0.25, 0.1]} geometry={GEO.box1} material={bodyMat} />
      <mesh position={[0, 0.2, 0]} scale={0.07} geometry={GEO.sphere8} material={MAT_SKIN} />
      <mesh position={[0.09, 0.05, 0]} scale={[0.03, 0.18, 0.03]} geometry={GEO.box1} material={bodyMat} />
      <mesh position={[-0.09, 0.05, 0]} scale={[0.03, 0.18, 0.03]} geometry={GEO.box1} material={bodyMat} />
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
   CAR - shared materials
   ============================================================ */
const Car = React.memo(({ pathRadius, speed, offset, color = '#ff4757', direction = 1, nightMode }) => {
  const ref = useRef();
  const wheelRefs = [useRef(), useRef(), useRef(), useRef()];

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.25 }), [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed * direction + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * pathRadius;
      ref.current.position.z = Math.sin(t) * pathRadius;
      ref.current.position.y = 0.12;
      ref.current.rotation.y = -t + (direction > 0 ? Math.PI / 2 : -Math.PI / 2);
    }
    const ws = speed * 0.3 * direction;
    for (let i = 0; i < 4; i++) {
      if (wheelRefs[i].current) wheelRefs[i].current.rotation.z += ws;
    }
  });

  return (
    <group ref={ref}>
      <mesh castShadow scale={[0.5, 0.1, 0.22]} geometry={GEO.box1} material={bodyMat} />
      <mesh position={[0.02, 0.11, 0]} scale={[0.22, 0.09, 0.18]} geometry={GEO.box1}>
        <meshStandardMaterial color="#1a1a3e" transparent opacity={0.5} metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0.27, -0.02, 0]} scale={[0.04, 0.06, 0.2]} geometry={GEO.box1}>
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-0.27, -0.02, 0]} scale={[0.04, 0.06, 0.18]} geometry={GEO.box1}>
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      {[[-0.17, -0.06, 0.12], [-0.17, -0.06, -0.12], [0.17, -0.06, 0.12], [0.17, -0.06, -0.12]].map(
        (pos, i) => (
          <mesh key={i} ref={wheelRefs[i]} position={pos} rotation={[Math.PI / 2, 0, 0]} scale={[0.04, 0.03, 0.04]} geometry={GEO.cylinder12} material={MAT_WHEEL} />
        )
      )}
      <mesh position={[0.26, 0.01, 0.08]} scale={0.018} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={nightMode ? 3 : 1} />
      </mesh>
      <mesh position={[0.26, 0.01, -0.08]} scale={0.018} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#fff" emissive="#ffffff" emissiveIntensity={nightMode ? 3 : 1} />
      </mesh>
      <mesh position={[-0.26, 0.01, 0.08]} scale={0.015} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={nightMode ? 2 : 0.5} />
      </mesh>
      <mesh position={[-0.26, 0.01, -0.08]} scale={0.015} geometry={GEO.sphere6}>
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={nightMode ? 2 : 0.5} />
      </mesh>
    </group>
  );
});

/* ============================================================
   REALISTIC TREE - Frame skip animation
   ============================================================ */
const Tree = React.memo(({ position, scale = 1, nightMode, variant = 0 }) => {
  const leavesRef = useRef();
  const frameCount = useRef(0);

  const leafColor1 = nightMode ? '#0e3a1a' : (variant === 1 ? '#1a7a3a' : '#2d8a4e');
  const leafColor2 = nightMode ? '#0e4a1a' : (variant === 1 ? '#2a8a4a' : '#3d9a5e');

  const leafMat1 = useMemo(() => new THREE.MeshStandardMaterial({ color: leafColor1, roughness: 0.85 }), [leafColor1]);
  const leafMat2 = useMemo(() => new THREE.MeshStandardMaterial({ color: leafColor2, roughness: 0.85 }), [leafColor2]);

  // Only animate every 3rd frame - saves significant CPU
  useFrame((state) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    if (leavesRef.current) {
      const t = state.clock.getElapsedTime();
      leavesRef.current.rotation.y = Math.sin(t * 0.4 + position[0]) * 0.08;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} scale={[0.05, 0.6, 0.05]} geometry={GEO.cylinder8} material={variant === 1 ? MAT_TRUNK_DARK : MAT_TRUNK} />
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + (variant * 0.5);
        return (
          <mesh key={i} position={[Math.cos(a) * 0.07, 0.02, Math.sin(a) * 0.07]} rotation={[0, a, Math.PI / 5]} scale={[0.02, 0.08, 0.02]} geometry={GEO.cylinder6} material={MAT_ROOT} />
        );
      })}
      <group ref={leavesRef}>
        <mesh position={[0, 0.8, 0]} castShadow scale={0.3} geometry={GEO.sphere10} material={leafMat1} />
        <mesh position={[0.12, 0.9, 0.08]} scale={0.2} geometry={GEO.sphere8} material={leafMat2} />
        <mesh position={[-0.1, 0.85, -0.06]} scale={0.18} geometry={GEO.sphere8} material={leafMat2} />
      </group>
    </group>
  );
});

/* ============================================================
   BENCH
   ============================================================ */
const Bench = React.memo(({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    <mesh position={[0, 0.2, 0]} scale={[0.4, 0.03, 0.12]} geometry={GEO.box1}>
      <meshStandardMaterial color="#6b4226" roughness={0.9} />
    </mesh>
    <mesh position={[0, 0.35, -0.05]} scale={[0.4, 0.15, 0.02]} geometry={GEO.box1}>
      <meshStandardMaterial color="#6b4226" roughness={0.9} />
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

  const trackRadii = [4, 6, 8.5];
  const currentRadius = trackRadii[trackIndex] || radius;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const currentSpeed = speedRef.current;
    const angle = t * currentSpeed;
    const x = Math.cos(angle) * currentRadius;
    const z = Math.sin(angle) * currentRadius;

    if (groupRef.current) {
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
      groupRef.current.position.y = 0.15 + Math.sin(t * 8 * currentSpeed) * 0.015;
      groupRef.current.rotation.y = -angle + Math.PI / 2;

      // Throttle proximity checks to 10x/sec
      proxTimer.current += delta;
      if (proxTimer.current > 0.1) {
        proxTimer.current = 0;
        if (onProximity) onProximity({ x, z, angle });
      }
    }

    const ws = t * 12 * (currentSpeed / baseSpeed);
    if (wheelFrontRef.current) wheelFrontRef.current.rotation.x = ws;
    if (wheelBackRef.current) wheelBackRef.current.rotation.x = ws;
    if (legLeftRef.current) legLeftRef.current.rotation.x = Math.sin(ws) * 0.5;
    if (legRightRef.current) legRightRef.current.rotation.x = Math.sin(ws + Math.PI) * 0.5;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.25, 0]} castShadow scale={[0.6, 0.03, 0.03]} geometry={GEO.box1}>
        <meshStandardMaterial color="#ff4757" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[-0.12, 0.32, 0]} rotation={[0, 0, 0.15]} scale={[0.012, 0.15, 0.012]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#ff4757" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0.22, 0.32, 0]} rotation={[0, 0, -0.15]} scale={[0.012, 0.15, 0.012]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#ff4757" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0.24, 0.38, 0]} scale={[0.02, 0.02, 0.14]} geometry={GEO.box1} material={MAT_METAL_LIGHT} />
      <mesh ref={wheelFrontRef} position={[0.35, 0.12, 0]} castShadow>
        <torusGeometry args={[0.12, 0.02, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} />
      </mesh>
      <mesh ref={wheelBackRef} position={[-0.35, 0.12, 0]} castShadow>
        <torusGeometry args={[0.12, 0.02, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.38, 0]} scale={[0.1, 0.03, 0.06]} geometry={GEO.box1}>
        <meshStandardMaterial color="#0d0d1a" />
      </mesh>
      <mesh position={[-0.02, 0.56, 0]} castShadow scale={[0.16, 0.28, 0.14]} geometry={GEO.box1}>
        <meshStandardMaterial color="#00d4ff" />
      </mesh>
      <mesh position={[0.04, 0.84, 0]} castShadow scale={0.1} geometry={GEO.sphere10} material={MAT_SKIN} />
      <mesh position={[0.04, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.11, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff4757" />
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
        <Sparkles count={12} scale={1.2} size={3} speed={3} color="#00d4ff" position={[-0.35, 0.12, 0]} />
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
  const frameCount = useRef(0);

  const radius = 11;
  const x = Math.cos(achievement.angle) * radius;
  const z = Math.sin(achievement.angle) * radius;

  useFrame((state) => {
    frameCount.current++;
    if (!isNearby && frameCount.current % 2 !== 0) return;

    const t = state.clock.getElapsedTime();

    if (trophyRef.current) {
      trophyRef.current.rotation.y = t * (isNearby ? 3 : 1);
      trophyRef.current.position.y = 2.5 + Math.sin(t * 2 + achievement.id) * (isNearby ? 0.25 : 0.1);
      const ts = isNearby ? 1.3 : 1;
      const cs = trophyRef.current.scale.x;
      const ns = cs + (ts - cs) * 0.08;
      trophyRef.current.scale.set(ns, ns, ns);
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
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.1, 24]} />
        <meshStandardMaterial color={achievement.color} metalness={0.7} roughness={0.3} emissive={achievement.color} emissiveIntensity={isNearby ? 0.4 : 0.12} />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => ringRefs.current[i] = el} position={[0, 0.15 + i * 0.12, 0]}>
          <torusGeometry args={[0.45 + i * 0.12, 0.018, 10, 20]} />
          <meshStandardMaterial color={achievement.color} emissive={achievement.color} emissiveIntensity={isNearby ? 1.5 : 0.6} transparent opacity={0.4 - i * 0.08} metalness={0.8} roughness={0.2} depthWrite={false} />
        </mesh>
      ))}

      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2, 8]} />
        <meshStandardMaterial color={achievement.color} emissive={achievement.color} emissiveIntensity={isNearby ? 0.7 : 0.25} metalness={0.8} roughness={0.2} />
      </mesh>

      {[0.8, 1.2, 1.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.15, 0.012, 8, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={1} roughness={0.1} emissive="#ffd700" emissiveIntensity={0.4} />
        </mesh>
      ))}

      <group ref={trophyRef} position={[0, 2.5, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={achievement.color} emissive={achievement.color} emissiveIntensity={isNearby ? 2 : 0.7} metalness={1} roughness={0} />
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
  const frameCount = useRef(0);

  useFrame((state) => {
    frameCount.current++;
    if (!isNearby && frameCount.current % 2 !== 0) return;

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
      <mesh position={[0, -1.5, 0]} scale={[0.04, 3, 0.04]} geometry={GEO.cylinder8}>
        <meshStandardMaterial color="#2c2c2c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.7, 0.04, 10, 20]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNearby ? 2 : 0.8} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={innerRingRef}>
        <torusGeometry args={[0.5, 0.025, 8, 16]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNearby ? 1.2 : 0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={isNearby ? 0.6 : 0.3} transparent opacity={0.25} depthWrite={false} />
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
          {isNearby && <div className="preview__portal-hint">🚀 Click to Enter!</div>}
        </div>
      </Html>
    </group>
  );
};

/* ============================================================
   CENTRAL HUB
   ============================================================ */
const CentralHub = React.memo(({ avatarImg, nightMode }) => {
  const platformRef = useRef();
  const auraRef = useRef();
  const topRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (platformRef.current) platformRef.current.rotation.y = t * 0.12;
    if (auraRef.current) {
      auraRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
    }
    if (topRingRef.current) {
      topRingRef.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.9, 3, 8]} />
        <meshStandardMaterial color={nightMode ? '#1a1a4e' : '#4a4a8e'} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh ref={platformRef} position={[0, 3.1, 0]}>
        <cylinderGeometry args={[1.1, 0.8, 0.2, 8]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh ref={topRingRef} position={[0, 3.2, 0]}>
        <torusGeometry args={[1, 0.025, 12, 32]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={auraRef} position={[0, 3.15, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.03, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh position={[0, 4.3, 0]} scale={[0.018, 2.2, 0.018]} geometry={GEO.cylinder6}>
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
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
   ENHANCED GRASSY ISLAND
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
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 13;
      patches.push({
        pos: [Math.cos(angle) * dist, 0.015, Math.sin(angle) * dist],
        scale: 0.08 + Math.random() * 0.12,
        rot: Math.random() * Math.PI,
      });
    }
    return patches;
  }, []);

  return (
    <group>
      {/* Main island */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[15, 13.5, 0.8, 48]} />
        <meshStandardMaterial color={nightMode ? '#122218' : '#3a7a4a'} roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.3, 48]} />
        <meshStandardMaterial color={nightMode ? '#0e3a1a' : '#2d7a3e'} roughness={0.95} />
      </mesh>

      {/* Grass patches */}
      {grassPatches.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, p.rot]}>
          <circleGeometry args={[p.scale, 6]} />
          <meshBasicMaterial color={nightMode ? '#0e4a1a' : '#2a9a3e'} transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}

      {/* Roads */}
      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 4.6, 48]} />
        <meshStandardMaterial color={nightMode ? '#1e1e30' : '#4a4a55'} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.95, 4.05, 48]} />
        <meshBasicMaterial color="#ffff44" transparent opacity={nightMode ? 0.6 : 0.4} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.012, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.7, 5.4, 48]} />
        <meshStandardMaterial color={nightMode ? '#1a3a25' : '#6a9a6a'} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 6.6, 48]} />
        <meshStandardMaterial color={nightMode ? '#1e1e30' : '#4a4a55'} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.0, 6.08, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={nightMode ? 0.5 : 0.35} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.012, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.7, 7.9, 48]} />
        <meshStandardMaterial color={nightMode ? '#1a3a25' : '#6a9a6a'} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.016, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.0, 9.1, 48]} />
        <meshStandardMaterial color={nightMode ? '#1e1e30' : '#4a4a55'} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.48, 8.58, 48]} />
        <meshBasicMaterial color="#ffff44" transparent opacity={nightMode ? 0.6 : 0.4} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.008, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.2, 14.5, 48]} />
        <meshStandardMaterial color={nightMode ? '#122218' : '#3a7a4a'} roughness={0.95} />
      </mesh>

      {/* Rocky base */}
      <mesh position={[0, -1.8, 0]}>
        <coneGeometry args={[12, 3.5, 16]} />
        <meshStandardMaterial color={nightMode ? '#0a0a18' : '#5a4a3a'} roughness={1} />
      </mesh>
      <mesh position={[0, -2.5, 0]}>
        <coneGeometry args={[8, 2, 12]} />
        <meshStandardMaterial color={nightMode ? '#080812' : '#4a3a2a'} roughness={1} />
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
   GALAXY BACKGROUND
   ============================================================ */
const GalaxyBackground = React.memo(({ nightMode }) => {
  const { scene } = useThree();
  const currentBg = useRef(new THREE.Color('#7ec8e3'));
  const dayColor = useMemo(() => new THREE.Color('#7ec8e3'), []);
  const nightColor = useMemo(() => new THREE.Color('#020412'), []);
  const nebulaRef = useRef();
  const frameCount = useRef(0);

  useFrame(() => {
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
      <fog attach="fog" args={['#7ec8e3', 35, 70]} />

      {!nightMode && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={`cloud-${i}`} position={[Math.cos(i * 1.6) * 30, 15 + i * 2, Math.sin(i * 1.6) * 30 - 20]}>
              <sphereGeometry args={[3 + i * 0.5, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.25} depthWrite={false} />
            </mesh>
          ))}
          <mesh position={[20, 25, -40]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshBasicMaterial color="#fff8e1" />
          </mesh>
          <mesh position={[20, 25, -40]}>
            <sphereGeometry args={[5, 12, 12]} />
            <meshBasicMaterial color="#ffee88" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
          </mesh>
        </>
      )}

      {nightMode && (
        <>
          <Stars radius={180} depth={70} count={6000} factor={5} saturation={0.3} fade speed={0.3} />
          <Stars radius={80} depth={30} count={1500} factor={8} saturation={0.5} fade speed={0.15} />

          <group ref={nebulaRef}>
            <mesh position={[40, 25, -50]}>
              <sphereGeometry args={[15, 12, 12]} />
              <meshBasicMaterial color="#6b2fa0" transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[-50, 20, -40]}>
              <sphereGeometry args={[18, 12, 12]} />
              <meshBasicMaterial color="#1a3a8a" transparent opacity={0.035} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[0, 35, -60]}>
              <sphereGeometry args={[20, 12, 12]} />
              <meshBasicMaterial color="#ff4488" transparent opacity={0.02} side={THREE.BackSide} depthWrite={false} />
            </mesh>
            <mesh position={[-30, 15, 50]}>
              <sphereGeometry args={[14, 12, 12]} />
              <meshBasicMaterial color="#00aaaa" transparent opacity={0.025} side={THREE.BackSide} depthWrite={false} />
            </mesh>
          </group>

          <mesh position={[30, 40, -70]} rotation={[0.3, 0.5, 0.2]}>
            <ringGeometry args={[5, 12, 24]} />
            <meshBasicMaterial color="#8866cc" transparent opacity={0.015} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>

          <mesh position={[-25, 30, -50]}>
            <sphereGeometry args={[2, 24, 24]} />
            <meshStandardMaterial color="#e8e8d8" emissive="#ccccaa" emissiveIntensity={0.4} roughness={0.9} />
          </mesh>
          <mesh position={[-25, 30, -50]}>
            <sphereGeometry args={[4, 12, 12]} />
            <meshBasicMaterial color="#ccccaa" transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
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
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 4 !== 0) return;

    if (ambientRef.current) {
      const t = nightMode ? 0.1 : 0.55;
      ambientRef.current.intensity += (t - ambientRef.current.intensity) * 0.08;
    }
    if (dirRef.current) {
      const t = nightMode ? 0.15 : 1.1;
      dirRef.current.intensity += (t - dirRef.current.intensity) * 0.08;
    }
    if (hemiRef.current) {
      const t = nightMode ? 0.15 : 0.45;
      hemiRef.current.intensity += (t - hemiRef.current.intensity) * 0.08;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.55} />
      <directionalLight
        ref={dirRef}
        position={[15, 20, 10]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.001}
      />
      <hemisphereLight
        ref={hemiRef}
        args={[
          nightMode ? '#0a0a3e' : '#87ceeb',
          nightMode ? '#0a0a1e' : '#3a5a2a',
          0.45,
        ]}
      />
      <pointLight position={[0, 8, 0]} intensity={nightMode ? 0.8 : 0.3} color="#00d4ff" distance={12} />
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

  useFrame(() => {
    if (keysPressed.current.a || keysPressed.current.ArrowLeft) targetRef.current -= 0.02;
    if (keysPressed.current.d || keysPressed.current.ArrowRight) targetRef.current += 0.02;

    if (Math.abs(targetRef.current - rotRef.current) > 0.001) {
      rotRef.current += (targetRef.current - rotRef.current) * 0.06;
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
        speedRef.current = Math.min(speedRef.current + 0.05, 1.2);
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        speedRef.current = Math.max(speedRef.current - 0.05, 0.05);
      }
      if (e.key === ' ') {
        e.preventDefault();
        boostRef.current = true;
        speedRef.current = 1.5;
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

  const handleNavigate = (link) => {
    window.location.href = link;
  };

  const trackNames = ['Inner', 'Middle', 'Outer'];

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

      <div className="preview__hud-top">
        <div className="preview__logo">
          <span className="preview__logo-mohit"></span>
          <span className="preview__logo-world"></span>
        </div>
        <div className="preview__hud-actions">
          <button
            className={`preview__hud-btn preview__night-toggle ${nightMode ? 'is-active' : ''}`}
            onClick={() => setNightMode(!nightMode)}
            aria-label="Toggle night mode"
          >
            <span className="preview__toggle-icon">{nightMode ? '☀️' : '🌙'}</span>
          </button>
          <Link to="/about" className="preview__hud-btn" aria-label="About">👤</Link>
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
        shadows
        camera={{ position: [0, 14, 24], fov: 42 }}
        dpr={[0.8, dpr]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
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

        <GalaxyBackground nightMode={nightMode} />
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
            opacity={nightMode ? 0.2 : 0.35}
            scale={30}
            blur={2}
            far={4}
            resolution={512}
          />

          {!nightMode && <Environment preset="sunset" background={false} />}
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
          dampingFactor={0.08}
          rotateSpeed={0.6}
          zoomSpeed={0.8}
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
        <Link to="/sara" className="preview__next-link">
          <span className="preview__next-label">PROJECTS</span>
          <span className="preview__next-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Preview;