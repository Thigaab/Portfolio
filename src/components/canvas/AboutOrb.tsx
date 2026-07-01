'use client'

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

/** A gently rotating stack of gold coins — finance-themed, spins on hover. */
function CoinStack() {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const coins = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        y: (i - 3) * 0.26,
        rot: Math.random() * Math.PI,
        offset: (Math.random() - 0.5) * 0.08,
      })),
    []
  )

  useFrame((state, delta) => {
    const g = groupRef.current
    if (!g) return
    g.rotation.y += delta * (hovered ? 0.9 : 0.3)
    const tilt = THREE.MathUtils.damp(g.rotation.x, hovered ? 0.1 : 0.32, 4, delta)
    g.rotation.x = tilt
    const s = THREE.MathUtils.damp(g.scale.x, hovered ? 1.06 : 1, 5, delta)
    g.scale.setScalar(s)
  })

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
      <group
        ref={groupRef}
        rotation={[0.32, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {coins.map((c, i) => (
          <group key={i} position={[c.offset, c.y, c.offset]} rotation={[0, c.rot, 0]}>
            {/* coin body */}
            <mesh>
              <cylinderGeometry args={[1, 1, 0.2, 56]} />
              <meshStandardMaterial color="#D4A853" metalness={0.95} roughness={0.22} envMapIntensity={1.8} />
            </mesh>
            {/* raised rim for a minted look */}
            <mesh>
              <torusGeometry args={[0.92, 0.06, 12, 56]} />
              <meshStandardMaterial color="#F0C060" metalness={0.95} roughness={0.18} envMapIntensity={2} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  )
}

export default function AboutOrb() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 6, 5]} color="#FFD770" intensity={2.2} />
      <pointLight position={[-5, -2, 3]} color="#FF8C30" intensity={1} />
      <CoinStack />
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
