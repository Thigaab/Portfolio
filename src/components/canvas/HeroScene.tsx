'use client'

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Points, PointMaterial, Sparkles, Preload } from '@react-three/drei'
import * as THREE from 'three'

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

const UP = new THREE.Color('#E8B24A')
const UP_EMISSIVE = new THREE.Color('#A9781F')
const DOWN = new THREE.Color('#5A4424')
const DOWN_EMISSIVE = new THREE.Color('#2A1E0C')

/** Animated 3D candlestick chart — the finance-themed centerpiece. */
function CandleChart({ progress }: { progress: React.RefObject<number> }) {
  const COUNT = 14
  const SPACING = 0.42

  const candles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (i - (COUNT - 1) / 2) * SPACING,
        phase: Math.random() * Math.PI * 2,
        speed: 0.12 + Math.random() * 0.16,
        trend: i / (COUNT - 1),
      })),
    []
  )

  const groupRef = useRef<THREE.Group>(null)
  const bodyRefs = useRef<THREE.Mesh[]>([])
  const wickRefs = useRef<THREE.Mesh[]>([])

  // Glowing trend line connecting the closes.
  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3))
    const mat = new THREE.LineBasicMaterial({ color: '#F0C060', transparent: true, opacity: 0.85 })
    return new THREE.Line(geo, mat)
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const posAttr = line.geometry.attributes.position as THREE.BufferAttribute | undefined
    const linePos = posAttr?.array as Float32Array | undefined

    candles.forEach((c, i) => {
      const base = -0.9 + c.trend * 1.7
      const close = base + Math.sin(t * c.speed + c.phase) * 0.5
      const open = base + Math.sin(t * c.speed + c.phase - 0.6) * 0.5
      const top = Math.max(open, close)
      const bot = Math.min(open, close)
      const high = top + 0.22
      const low = bot - 0.22
      const up = close >= open

      const body = bodyRefs.current[i]
      if (body) {
        const h = Math.max(0.07, top - bot)
        body.position.y = (top + bot) / 2
        body.scale.y = h
        const mat = body.material as THREE.MeshStandardMaterial
        mat.color.copy(up ? UP : DOWN)
        mat.emissive.copy(up ? UP_EMISSIVE : DOWN_EMISSIVE)
      }
      const wick = wickRefs.current[i]
      if (wick) {
        wick.position.y = (high + low) / 2
        wick.scale.y = Math.max(0.01, high - low)
      }

      if (linePos) {
        linePos[i * 3] = c.x
        linePos[i * 3 + 1] = close
        linePos[i * 3 + 2] = 0.18
      }
    })
    if (posAttr) posAttr.needsUpdate = true

    const g = groupRef.current
    if (g) {
      const p = progress.current
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.4, 1.4, delta)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.25 + p * 0.4, 1.4, delta)
      g.position.y = THREE.MathUtils.damp(g.position.y, p * 2, 2, delta)
      const s = 1 - p * 0.3
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 2, delta))
    }
  })

  return (
    <group ref={groupRef}>
      {candles.map((c, i) => (
        <group key={i} position={[c.x, 0, 0]}>
          <mesh ref={(el) => { if (el) wickRefs.current[i] = el }}>
            <boxGeometry args={[0.035, 1, 0.035]} />
            <meshStandardMaterial color="#D4A853" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh ref={(el) => { if (el) bodyRefs.current[i] = el }}>
            <boxGeometry args={[0.24, 1, 0.24]} />
            <meshStandardMaterial metalness={0.7} roughness={0.28} emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
      <primitive object={line} />
      <Sparkles count={35} scale={[6, 3, 3]} size={2.5} speed={0.3} color="#F0C060" opacity={0.5} />
    </group>
  )
}

/** Undulating point grid that ripples away from the cursor — a live data field. */
function WaveField() {
  const SIZE = 30
  const SEG = 56
  const geom = useMemo(() => new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG), [])
  const base = useMemo(() => Float32Array.from(geom.attributes.position.array), [geom])
  const ref = useRef<THREE.Points>(null)

  // Reusable math objects + the smoothed cursor position in the grid's local space.
  const plane = useMemo(() => new THREE.Plane(), [])
  const normal = useMemo(() => new THREE.Vector3(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])
  const cursor = useRef(new THREE.Vector2(9999, 9999))

  // The hero overlays (gradients, text) sit on top of the canvas with
  // pointer-events, so R3F's `state.pointer` never updates here. Track the
  // real cursor from `window` and derive NDC from the canvas rect ourselves.
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

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    mesh.updateMatrixWorld()

    // Build the grid's surface as a world-space plane, then raycast the
    // cursor onto it and bring the hit point into the grid's local space.
    normal.set(0, 0, 1).applyQuaternion(mesh.quaternion).normalize()
    plane.setFromNormalAndCoplanarPoint(normal, mesh.position)
    state.raycaster.setFromCamera(ndc.current, state.camera)
    if (active.current && state.raycaster.ray.intersectPlane(plane, hit)) {
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

      // Gentle idle swell so the grid breathes even without the mouse.
      const wave =
        Math.sin(x * 0.3 + t * 0.25) * 0.3 +
        Math.cos(y * 0.26 + t * 0.2) * 0.3 +
        Math.sin((x + y) * 0.14 + t * 0.15) * 0.18

      // In-plane repulsion: each point is shoved directly away from the
      // projected cursor, strongest next to it, fading with distance — the
      // grid tears open a moving crater that flees the cursor. `z` also dips
      // away so the field visibly bends down under the pointer.
      const dx = x - cx
      const dy = y - cy
      const dist = Math.hypot(dx, dy) || 0.0001
      const influence = Math.exp(-dist * dist * 0.05) // 1 at cursor → ~0 far
      const repel = influence * 2.4
      arr[ix] = x + (dx / dist) * repel
      arr[ix + 1] = y + (dy / dist) * repel
      arr[ix + 2] = wave - influence * 1.1
    }
    pos.needsUpdate = true
    mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, ndc.current.x * 0.03, 1.2, delta)
  })

  return (
    <points ref={ref} geometry={geom} rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -3.4, -1]}>
      <pointsMaterial
        color="#D4A853"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  )
}

function ParticleField() {
  const count = 1800
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 16 + 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  const ref = useRef<THREE.Points>(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.012
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, state.pointer.x * 0.06, 1.2, delta)
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#D4A853" size={0.018} sizeAttenuation depthWrite={false} opacity={0.45} />
    </Points>
  )
}

function CameraRig() {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.7, 1.2, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, state.pointer.y * 0.4, 1.2, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene() {
  const progress = useScrollProgress()

  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#050505', 7, 19]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[6, 8, 8]} color="#FFD770" intensity={2.6} />
      <pointLight position={[-8, -2, -6]} color="#FF8C30" intensity={1} />
      <pointLight position={[0, 6, 4]} color="#FFF0C0" intensity={0.8} />

      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.4}>
        <CandleChart progress={progress} />
      </Float>
      <WaveField />
      <ParticleField />
      <CameraRig />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}
