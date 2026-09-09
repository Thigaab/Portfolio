'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const SIDE = 1.7
const H = SIDE / 2
const BAR = 0.072 // square section, thick enough to never thin out to nothing
const JOINT = 0.112 // corner radius, > BAR/2 so it hides the bar ends

/**
 * The 12 edges of a cube. Every edge is axis aligned, so each one is a thin
 * box needing no rotation at all: `args` picks the axis it spans, `pos` sits
 * it on the matching pair of faces. Bars run slightly long so the corners
 * overlap instead of leaving gaps.
 */
const EDGES: { args: [number, number, number]; pos: [number, number, number] }[] = []
for (const a of [-H, H]) {
  for (const b of [-H, H]) {
    EDGES.push({ args: [SIDE + BAR, BAR, BAR], pos: [0, a, b] })
    EDGES.push({ args: [BAR, SIDE + BAR, BAR], pos: [a, 0, b] })
    EDGES.push({ args: [BAR, BAR, SIDE + BAR], pos: [a, b, 0] })
  }
}

/**
 * The 8 corners, coloured by parity. Even and odd corners of a cube each form
 * a tetrahedron, so every face ends up showing two of each accent rather than
 * one face coming out all iris and another all coral.
 */
const CORNERS: { pos: [number, number, number]; iris: boolean }[] = []
for (const x of [-H, H]) {
  for (const y of [-H, H]) {
    for (const z of [-H, H]) {
      const parity = (x > 0 ? 1 : 0) + (y > 0 ? 1 : 0) + (z > 0 ? 1 : 0)
      CORNERS.push({ pos: [x, y, z], iris: parity % 2 === 0 })
    }
  }
}

function Lattice({ hovered }: { hovered: React.RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)

  const spin = useRef(0.2)
  const clock = useRef(0)
  const axis = useRef(new THREE.Vector3(0, 1, 0))
  const step = useRef(new THREE.Quaternion())

  useFrame((_, delta) => {
    const el = group.current
    if (!el) return

    spin.current = THREE.MathUtils.damp(spin.current, hovered.current ? 0.45 : 0.2, 3, delta)
    clock.current += delta
    const t = clock.current

    // The tumble axis wanders on frequencies with no common multiple (periods
    // of 58s to 170s), so the motion never settles into a visible loop and
    // never lines up with a face axis. That alignment was the real reason the
    // old version looked like it sped up and slowed down: a cube spun about
    // its own vertical axis has 4-fold symmetry, so its silhouette swings
    // between narrowest face-on and sqrt(2) wider at 45 degrees, which reads
    // as a pulse four times a revolution even at constant angular velocity.
    axis.current
      .set(
        Math.sin(t * 0.109) + 0.6 * Math.sin(t * 0.041 + 1.3),
        0.85 + 0.5 * Math.sin(t * 0.073 + 0.4),
        Math.cos(t * 0.089 + 2.1) + 0.6 * Math.cos(t * 0.037)
      )
      .normalize()

    // Turning by a fixed angle every frame is what makes the speed genuinely
    // constant: the step quaternion's rotation angle is exactly
    // `spin * delta`, whatever the current orientation. Composing Euler
    // angles could not do that, since a steady yaw plus an oscillating pitch
    // combine into a net angular velocity that speeds up and slows down.
    // premultiply applies the step in world space, so the cube tumbles freely
    // instead of orbiting its own local axis.
    step.current.setFromAxisAngle(axis.current, spin.current * delta)
    el.quaternion.premultiply(step.current).normalize()

    el.position.y = Math.sin(t * 0.51) * 0.06 + Math.sin(t * 0.83 + 1.1) * 0.04
  })

  return (
    // Starting orientation only. Nothing re-renders this component, so R3F
    // applies it once at mount and the frame loop owns the quaternion after.
    <group ref={group} rotation={[0.35, 0.6, 0.12]}>
      {EDGES.map((e, i) => (
        <mesh key={`e${i}`} position={e.pos}>
          <boxGeometry args={e.args} />
          <meshStandardMaterial color="#17161d" roughness={0.55} metalness={0} />
        </mesh>
      ))}
      {CORNERS.map((c, i) => (
        <mesh key={`c${i}`} position={c.pos}>
          <sphereGeometry args={[JOINT, 20, 20]} />
          <meshStandardMaterial
            color={c.iris ? '#4a3aed' : '#ff6a45'}
            roughness={0.4}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function LatticeCube() {
  // A ref, not state: re-rendering on hover would let R3F re-apply the
  // group's `rotation` prop and snap the tumble back to its start.
  const hovered = useRef(false)

  return (
    // Hover on the wrapper rather than the meshes: chasing thin bars with the
    // cursor in a 224px canvas would be miserable, and an invisible hit mesh
    // would be picked up by ContactShadows and cast a square shadow.
    <div
      className="h-full w-full"
      onMouseEnter={() => {
        hovered.current = true
      }}
      onMouseLeave={() => {
        hovered.current = false
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Studio lights only, no <Environment>, so nothing can suspend and
            blank the canvas while an HDRI loads. */}
        <hemisphereLight args={['#ffffff', '#ddd5c4', 1.15]} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} color="#fff4e4" />
        <directionalLight position={[-4, -1, -2]} intensity={0.9} color="#b9aeff" />

        <Lattice hovered={hovered} />

        <ContactShadows
          position={[0, -1.8, 0]}
          scale={7}
          blur={2.6}
          opacity={0.22}
          far={3}
          resolution={256}
          color="#17161d"
        />
      </Canvas>
    </div>
  )
}
