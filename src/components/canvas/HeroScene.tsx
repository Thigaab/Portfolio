'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const PAPER = '#f4f1ea'

/** Scroll progress across the first viewport (ref only — no re-renders). */
function useScrollProgress() {
  const progress = useRef(0)
  useEffect(() => {
    const onScroll = () => {
      progress.current = Math.min(window.scrollY / window.innerHeight, 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

type Pointer = { ndc: React.RefObject<THREE.Vector2>; active: React.RefObject<boolean> }

/**
 * The real cursor, in canvas NDC. R3F's own `state.pointer` is useless here:
 * the hero's gradient/text overlays sit on top of the canvas and swallow every
 * pointer event, so it would stay frozen at its initial value. Read `window`
 * instead and derive NDC from the canvas rect.
 */
function usePointerNDC(): Pointer {
  const { gl } = useThree()
  const ndc = useRef(new THREE.Vector2())
  const active = useRef(false)
  useEffect(() => {
    const el = gl.domElement
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      ndc.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      )
      active.current = true
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])
  return { ndc, active }
}

/**
 * A loose still-life of soft clay objects, offset to the right so it never
 * fights the left-aligned hero type. Matte physical materials + studio lights
 * only — deliberately no `<Environment>`, so nothing can suspend and blank
 * the canvas mid-load.
 */
function ClayStill({
  pointer,
  progress,
}: {
  pointer: Pointer
  progress: React.RefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const knotRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const knot = knotRef.current
    if (knot) {
      knot.rotation.y += delta * 0.14
      knot.rotation.x += delta * 0.05
    }

    const g = groupRef.current
    if (!g) return
    const p = progress.current
    const { x, y } = pointer.ndc.current
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.34, 1.4, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -y * 0.2 + p * 0.35, 1.4, delta)
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 2.2, 2, delta)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1 - p * 0.28, 2, delta))
  })

  return (
    <group ref={groupRef} position={[1.9, 0.1, 0]}>
      <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.5}>
        <mesh ref={knotRef}>
          <torusKnotGeometry args={[1.15, 0.4, 240, 40]} />
          <meshPhysicalMaterial
            color="#4a3aed"
            roughness={0.32}
            metalness={0}
            clearcoat={0.9}
            clearcoatRoughness={0.32}
            sheen={0.5}
            sheenColor="#ffb49c"
          />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.9}>
        <mesh position={[-2.5, 1.35, -0.6]}>
          <sphereGeometry args={[0.62, 64, 64]} />
          <meshPhysicalMaterial color="#ff6a45" roughness={0.5} metalness={0} clearcoat={0.5} />
        </mesh>
      </Float>

      <Float speed={0.7} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh position={[1.55, -1.75, 0.7]} rotation={[0.5, 0, -0.8]}>
          <capsuleGeometry args={[0.3, 0.95, 16, 32]} />
          <meshPhysicalMaterial color="#fbf9f5" roughness={0.6} metalness={0} clearcoat={0.35} />
        </mesh>
      </Float>

      <Float speed={1.05} rotationIntensity={0.45} floatIntensity={0.8}>
        <RoundedBox args={[0.82, 0.82, 0.82]} radius={0.19} smoothness={5} position={[-1.7, -1.9, -1.4]}>
          <meshPhysicalMaterial color="#a97a18" roughness={0.45} metalness={0} clearcoat={0.6} />
        </RoundedBox>
      </Float>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.1}>
        <mesh position={[2.7, 1.75, -1.8]}>
          <sphereGeometry args={[0.3, 48, 48]} />
          <meshPhysicalMaterial color="#7a6bff" roughness={0.4} metalness={0} clearcoat={0.7} />
        </mesh>
      </Float>
    </group>
  )
}

/**
 * Halftone floor: a point grid that swells gently and tears open a crater that
 * flees the cursor. The grid is a tilted plane, so the cursor has to be
 * raycast onto that plane and brought into local space — NDC can't be used
 * directly as grid coordinates.
 */
function HalftoneFloor({ pointer }: { pointer: Pointer }) {
  const SIZE = 30
  const SEG = 44
  const geom = useMemo(() => new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG), [])
  const base = useMemo(() => Float32Array.from(geom.attributes.position.array), [geom])
  const ref = useRef<THREE.Points>(null)

  const plane = useMemo(() => new THREE.Plane(), [])
  const normal = useMemo(() => new THREE.Vector3(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const cursor = useRef(new THREE.Vector2(9999, 9999))

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    mesh.updateMatrixWorld()

    normal.set(0, 0, 1).applyQuaternion(mesh.quaternion).normalize()
    plane.setFromNormalAndCoplanarPoint(normal, mesh.position)
    state.raycaster.setFromCamera(pointer.ndc.current, state.camera)
    if (pointer.active.current && state.raycaster.ray.intersectPlane(plane, hit)) {
      mesh.worldToLocal(hit)
      cursor.current.x += (hit.x - cursor.current.x) * 0.09
      cursor.current.y += (hit.y - cursor.current.y) * 0.09
    }
    const cx = cursor.current.x
    const cy = cursor.current.y

    const t = state.clock.elapsedTime
    const pos = geom.attributes.position
    const arr = pos.array as Float32Array
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3
      const x = base[ix]
      const y = base[ix + 1]

      // Gentle idle swell so the field breathes even without the mouse.
      const wave =
        Math.sin(x * 0.3 + t * 0.25) * 0.3 +
        Math.cos(y * 0.26 + t * 0.2) * 0.3 +
        Math.sin((x + y) * 0.14 + t * 0.15) * 0.18

      // In-plane repulsion: each dot is shoved directly away from the projected
      // cursor, strongest next to it, fading with distance. `z` dips too, so
      // the field visibly bends away under the pointer.
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
      const influence = Math.exp(-dist * dist * 0.05) // 1 at cursor → ~0 far
      const repel = influence * 2.4
      arr[ix] = x + (dx / dist) * repel
      arr[ix + 1] = y + (dy / dist) * repel
      arr[ix + 2] = wave - influence * 1.1
    }
    pos.needsUpdate = true
    mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, pointer.ndc.current.x * 0.03, 1.2, delta)
  })

  return (
    <points ref={ref} geometry={geom} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -3.3, -1]}>
      <pointsMaterial
        color="#17161d"
        size={0.032}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
      />
    </points>
  )
}

function CameraRig({ pointer }: { pointer: Pointer }) {
  useFrame((state, delta) => {
    const { x, y } = pointer.ndc.current
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, x * 0.7, 1.2, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, y * 0.4 + 0.4, 1.2, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

/** Everything inside the Canvas, so the pointer is tracked once and shared. */
function Scene({ progress }: { progress: React.RefObject<number> }) {
  const pointer = usePointerNDC()
  return (
    <>
      <ClayStill pointer={pointer} progress={progress} />
      <HalftoneFloor pointer={pointer} />
      <CameraRig pointer={pointer} />
    </>
  )
}

export default function HeroScene() {
  const progress = useScrollProgress()

  return (
    <Canvas
      camera={{ position: [0, 0.4, 6.6], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={[PAPER, 10, 24]} />
      <hemisphereLight args={['#ffffff', '#d9d1c0', 1.1]} />
      <directionalLight position={[5, 7, 6]} intensity={2.4} color="#fff4e4" />
      <directionalLight position={[-6, 2, -4]} intensity={1.1} color="#c3bbff" />
      <pointLight position={[2, -3, 4]} intensity={12} distance={14} color="#ffb49c" />
      <Scene progress={progress} />
    </Canvas>
  )
}
