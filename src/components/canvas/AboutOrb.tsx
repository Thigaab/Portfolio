'use client'

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/** A blob of molten gold that slowly churns — abstract, premium, finance-luxe. */
function LiquidGold() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<any>(null) // drei material impl (distort/speed setters)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    const m = meshRef.current
    if (m) {
      m.rotation.y += delta * (hovered ? 0.45 : 0.18)
      m.rotation.x += delta * 0.05
    }
    if (matRef.current) {
      // churn harder + faster when hovered, easing between states
      matRef.current.distort = THREE.MathUtils.damp(matRef.current.distort, hovered ? 0.55 : 0.34, 3, delta)
      matRef.current.speed = THREE.MathUtils.damp(matRef.current.speed, hovered ? 3.2 : 1.6, 3, delta)
    }
  })

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* icosahedron = even tessellation, no pole pinching under distortion.
            High detail: MeshDistortMaterial doesn't recompute normals, so faceting
            only vanishes with enough subdivisions. */}
        {/* ponytail: detail 7 ≈ 328k tris — smooth silhouette without tanking
            the framerate; detail 8 (1.3M) is overkill for a small orb. */}
        <icosahedronGeometry args={[1.4, 7]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#E0AE4E"
          metalness={0.95}
          roughness={0.14}
          envMapIntensity={1.4}
          emissive="#3a2708"
          emissiveIntensity={0.2}
          distort={0.34}
          speed={1.6}
        />
      </mesh>
    </Float>
  )
}

export default function AboutOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.2} />
      <Suspense fallback={null}>
        <LiquidGold />
        {/* Shanghai night skyline (CC0, Poly Haven) — the city lights reflect
            across the gold. Reflections only; the page background stays dark. */}
        <Environment files="/hdri/shanghai_bund_2k.hdr" environmentIntensity={1.1} />
      </Suspense>
    </Canvas>
  )
}
