'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/** A soft clay blob that slowly kneads itself — matte, warm, hand-made. */
function ClayBlob() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<any>(null) // drei material impl (distort/speed setters)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    const m = meshRef.current
    if (m) {
      m.rotation.y += delta * (hovered ? 0.4 : 0.16)
      m.rotation.x += delta * 0.05
    }
    if (matRef.current) {
      // knead harder + faster when hovered, easing between states
      matRef.current.distort = THREE.MathUtils.damp(matRef.current.distort, hovered ? 0.5 : 0.3, 3, delta)
      matRef.current.speed = THREE.MathUtils.damp(matRef.current.speed, hovered ? 2.8 : 1.4, 3, delta)
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
            High detail: MeshDistortMaterial doesn't recompute normals, so
            faceting only vanishes with enough subdivisions. */}
        {/* ponytail: detail 7 = 1280 tris. Cheap; the blob's cost is fill
            rate, not geometry, so don't trade silhouette away here. */}
        <icosahedronGeometry args={[1.4, 7]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#ff6a45"
          metalness={0}
          roughness={0.55}
          clearcoat={0.45}
          clearcoatRoughness={0.4}
          sheen={0.6}
          sheenColor="#7a6bff"
          distort={0.3}
          speed={1.4}
        />
      </mesh>
    </Float>
  )
}

export default function AboutOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      {/* Studio lights only — no <Environment>, so nothing can suspend and
          blank the canvas while an HDRI loads. */}
      <hemisphereLight args={['#ffffff', '#ddd5c4', 1.2]} />
      <directionalLight position={[3, 5, 4]} intensity={2.6} color="#fff4e4" />
      <directionalLight position={[-4, -1, -2]} intensity={1.2} color="#b9aeff" />
      <ClayBlob />
    </Canvas>
  )
}
