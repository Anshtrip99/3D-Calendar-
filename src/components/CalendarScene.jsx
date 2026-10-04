import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { months } from '../data/months.js'
import { useMonthTexture } from './MonthCard.jsx'

const coral = '#ed4d50'
const cardDepth = 0.043
const illustrationBackdrops = ['#6d6e71', '#6d6e71', '#6d6e71', '#ffffff', '#58585a', '#818285', '#ffffff', '#6d6e71', '#58585a', '#58585a', '#58585a', '#58585a']
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Card({ index, month, phase, setPhase, setMonth }) {
  const group = useRef()
  const placement = useRef(null)
  const previousPhase = useRef(phase)
  const [hover, setHover] = useState(false)
  const texture = useMonthTexture(index)
  const tabOrder = (index - month + 12) % 12
  const tabTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128; canvas.height = 160
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff8ed'; ctx.font = '700 82px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(String(index + 1), 64, 82)
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace
    return map
  }, [index])
  const cardMaterials = useMemo(() => {
    const front = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false })
    const backdropKey = new THREE.Color(illustrationBackdrops[index])
    front.onBeforeCompile = shader => {
      shader.uniforms.illustrationBackdrop = { value: backdropKey }
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 illustrationBackdrop;')
        .replace('#include <map_fragment>', '#include <map_fragment>\nif (vMapUv.x < 0.607) { float backdropDistance = distance(diffuseColor.rgb, illustrationBackdrop); diffuseColor.a *= smoothstep(0.045, 0.12, backdropDistance); }')
    }
    front.customProgramCacheKey = () => 'calendar-transparent-art-v1'
    return [
      new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.76 }),
      new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.76 }),
      new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.76 }),
      new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.76 }),
      front,
      new THREE.MeshStandardMaterial({ color: '#fffdf9', roughness: 0.76 }),
    ]
  }, [index, texture])
  useEffect(() => () => { cardMaterials.forEach(material => material.dispose()); tabTexture.dispose() }, [cardMaterials, tabTexture])
  const active = month === index
  const stackOrder = (index - month + 12) % 12
  const pulled = active && phase === 'pulled'
  const placing = active && phase === 'placing'

  useEffect(() => {
    if (placing && previousPhase.current !== 'placing' && group.current) {
      placement.current = {
        elapsed: 0,
        from: group.current.position.clone(),
        fromRotation: group.current.rotation.clone(),
      }
    } else if (!placing) {
      placement.current = null
    }
    previousPhase.current = phase
  }, [phase, placing])

  useFrame((_, dt) => {
    if (!group.current) return
    if (placing && placement.current) {
      const move = placement.current
      move.elapsed += dt
      const progress = Math.min(move.elapsed / 1.22, 1)
      const smooth = value => value * value * (3 - 2 * value)
      const back = { x: -11 * 0.012, y: 11 * 0.013, z: 0.12 - 11 * cardDepth }
      const lift = { x: move.from.x * 0.65, y: move.from.y + 0.34, z: move.from.z - 0.22 }
      if (progress < 0.27) {
        const t = smooth(progress / 0.27)
        group.current.position.set(
          THREE.MathUtils.lerp(move.from.x, lift.x, t),
          THREE.MathUtils.lerp(move.from.y, lift.y, t),
          THREE.MathUtils.lerp(move.from.z, lift.z, t),
        )
        group.current.rotation.y = THREE.MathUtils.lerp(move.fromRotation.y, 0.34, t)
        group.current.rotation.x = THREE.MathUtils.lerp(move.fromRotation.x, -0.08, t)
      } else {
        const t = smooth((progress - 0.27) / 0.73)
        group.current.position.set(
          THREE.MathUtils.lerp(lift.x, back.x, t),
          THREE.MathUtils.lerp(lift.y, back.y, t),
          THREE.MathUtils.lerp(lift.z, back.z, t),
        )
        group.current.rotation.y = THREE.MathUtils.lerp(0.34, 0.24, t)
        group.current.rotation.x = THREE.MathUtils.lerp(-0.08, 0, t)
      }
      return
    }
    const targetZ = pulled ? 1.46 : placing ? 0.12 - 11 * cardDepth : active ? (hover ? 0.17 : 0.12) : 0.12 - stackOrder * cardDepth
    const blend = (value, target, speed) => reducedMotion ? target : THREE.MathUtils.damp(value, target, speed, dt)
    group.current.position.z = blend(group.current.position.z, targetZ, 7)
    group.current.position.x = blend(group.current.position.x, placing || !active ? -Math.min(stackOrder, 11) * 0.012 : 0, 7)
    group.current.position.y = blend(group.current.position.y, placing || !active ? Math.min(stackOrder, 11) * 0.013 : 0, 7)
    group.current.rotation.y = blend(group.current.rotation.y, pulled ? -0.1 : placing ? 0.24 : 0, 6)
    group.current.rotation.x = blend(group.current.rotation.x, pulled ? 0.045 : 0, 6)
  })

  return <group ref={group} position={[-Math.min(stackOrder, 11) * 0.012, Math.min(stackOrder, 11) * 0.013, 0.12 - stackOrder * cardDepth]}>
    <mesh material={cardMaterials} castShadow receiveShadow onPointerOver={event => { event.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }} onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }} onClick={event => { event.stopPropagation(); if (!active) { setMonth(index); setPhase('stack') } }}>
      <boxGeometry args={[3.62, 1.715, 0.018]} />
    </mesh>
    <mesh position={[1.57 - tabOrder * 0.13, 1.105, 0.145]} castShadow>
      <boxGeometry args={[0.16, 0.22, 0.022]} />
      <meshBasicMaterial color={coral} />
    </mesh>
    <mesh position={[1.57 - tabOrder * 0.13, 1.105, 0.158]}>
      <planeGeometry args={[0.14, 0.16]} />
      <meshBasicMaterial map={tabTexture} transparent toneMapped={false} />
    </mesh>
  </group>
}

function makeBackPrint() {
  const canvas = document.createElement('canvas')
  canvas.width = 1200; canvas.height = 760
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ed4d50'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  const white = '#fffaf2'
  ctx.strokeStyle = white; ctx.lineWidth = 4; ctx.strokeRect(68, 52, 260, 62)
  ctx.fillStyle = white; ctx.font = '700 29px Arial'; ctx.fillText('E V E R Y D A Y', 90, 93)
  ctx.font = '500 73px Georgia'; ctx.fillText('365 days of endless', 68, 220); ctx.fillText('possibilities.', 68, 300)
  ctx.globalAlpha = .82; ctx.fillRect(68, 340, 1064, 2); ctx.globalAlpha = 1
  ctx.font = '27px Georgia'; ctx.fillText('A thoughtfully designed desk calendar to help you', 68, 400); ctx.fillText('plan, pause and make the most of your days.', 68, 439)
  ctx.font = 'bold 21px Arial'; ctx.fillText('PRODUCT DETAILS', 68, 502)
  ctx.font = '20px Arial'
  const lines = ['Desk calendar     2027     Tabletop format     30cm x 20cm', 'English     Daily dates     Monthly planner     Note section', 'FSC certified paper (recyclable)     Designed in India     Made in India']
  lines.forEach((line, i) => ctx.fillText(line, 68, 546 + i * 35))
  ctx.font = 'italic 26px Georgia'; ctx.fillText('PLAN  ·  CREATE  ·  REMEMBER', 68, 695)
  ctx.font = '18px Arial'; ctx.textAlign = 'right'; ctx.fillText('KEEP IT SIMPLE. KEEP IT CLOSE.', 1125, 695)
  ctx.textAlign = 'left'; ctx.font = '15px Georgia'; ctx.fillText('Model No. DC-27  |  Edition 01', 805, 155)
  for (let i = 0; i < 42; i++) { const x = 805 + i * 7.2; ctx.fillRect(x, 177, i % 4 === 0 ? 4 : 2, 82 + (i % 3) * 9) }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4
  return texture
}

function makeRailPrint(label, vertical = false) {
  const canvas = document.createElement('canvas'); canvas.width = vertical ? 128 : 1000; canvas.height = vertical ? 1000 : 128
  const ctx = canvas.getContext('2d'); ctx.strokeStyle = '#fff8ed'; ctx.lineWidth = 5
  if (vertical) {
    ctx.save(); ctx.translate(64, 500); ctx.rotate(-Math.PI / 2); ctx.strokeRect(-260, -27, 520, 54)
    ctx.fillStyle = '#fff8ed'; ctx.font = 'bold 27px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 2); ctx.restore()
  } else {
    ctx.fillStyle = '#fff8ed'; ctx.font = 'italic 36px Georgia'; ctx.textBaseline = 'middle'; ctx.fillText(label, 22, 64)
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function PrintedRail({ position, size, label, vertical = false }) {
  const texture = useMemo(() => makeRailPrint(label, vertical), [label, vertical])
  return <mesh position={position}><planeGeometry args={size} /><meshBasicMaterial map={texture} transparent depthWrite={false} /></mesh>
}

function PrintedBack() {
  const texture = useMemo(makeBackPrint, [])
  return <mesh position={[0, 0, -0.39]} rotation={[0, Math.PI, 0]}>
    <planeGeometry args={[3.82, 1.96]} /><meshBasicMaterial map={texture} toneMapped={false} />
  </mesh>
}

function WeatherBacking({ image }) {
  const source = useLoader(THREE.TextureLoader, image)
  const texture = useMemo(() => {
    const map = source.clone()
    map.colorSpace = THREE.SRGBColorSpace
    // Keep the scenic focal points under the illustration cutout instead of the opaque date grid.
    map.repeat.set(0.7, 1)
    map.offset.set(0, 0)
    map.needsUpdate = true
    return map
  }, [source])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0, 0, -0.375]}>
    <planeGeometry args={[3.82, 1.96]} />
    <meshBasicMaterial map={texture} toneMapped={false} />
  </mesh>
}

function Product({ month, phase, setPhase, setMonth, spin, weatherImage }) {
  const root = useRef()
  const spinning = useRef(null)
  const priorSpin = useRef(spin)
  const { size } = useThree()
  const aspect = size.width / Math.max(size.height, 1)
  const compact = aspect < 1.18
  const productScale = compact ? 0.86 : aspect < 1.5 ? 0.84 : 0.9
  const productX = compact ? 0 : aspect < 1.5 ? 0.22 : 0.28
  useEffect(() => {
    if (spin !== priorSpin.current) {
      priorSpin.current = spin
      if (root.current) spinning.current = { from: root.current.rotation.y, elapsed: 0 }
    }
  }, [spin])
  useFrame((state, dt) => {
    if (!root.current) return
    if (spinning.current && !reducedMotion) {
      const turn = spinning.current
      turn.elapsed += dt
      const progress = Math.min(turn.elapsed / 6.2, 1)
      const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10)
      root.current.rotation.y = turn.from + Math.PI * 2 * eased
      if (progress === 1) { root.current.rotation.y = turn.from; spinning.current = null }
      return
    }
    if (phase !== 'stack' || reducedMotion) return
    const time = state.clock.elapsedTime
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, 0.025 + Math.sin(time * 0.62) * 0.075 + Math.sin(time * 0.29) * 0.012, 1.4, dt)
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, state.pointer.x * 0.045 + Math.sin(time * 0.3) * 0.012, 1.4, dt)
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -state.pointer.y * 0.016 + Math.sin(time * 0.4) * 0.008, 1.4, dt)
    root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, Math.sin(time * 0.35) * 0.008, 1.4, dt)
  })
  return <group ref={root} position={[productX, compact ? -0.14 : 0.02, 0]} scale={productScale}><ProductParts month={month} phase={phase} setPhase={setPhase} setMonth={setMonth} weatherImage={weatherImage} /></group>
}

function ProductParts({ month, phase, setPhase, setMonth, weatherImage }) {
  return <group position={[0, 0.04, 0]}>
    {/* Open-backed frame lets the selected weather scene show through the artwork cutouts. */}
    <mesh position={[-1.96, 0, -0.04]}><boxGeometry args={[0.16, 2.2, 0.58]} /><meshBasicMaterial color={coral} /></mesh>
    <mesh position={[1.96, 0, -0.04]}><boxGeometry args={[0.16, 2.2, 0.58]} /><meshBasicMaterial color={coral} /></mesh>
    <mesh position={[0, -1.03, -0.045]}><boxGeometry args={[4.08, 0.16, 0.56]} /><meshBasicMaterial color={coral} /></mesh>
    <mesh position={[0, 1.03, 0.12]}><boxGeometry args={[4.05, 0.13, 0.14]} /><meshBasicMaterial color={coral} /></mesh>
    <PrintedRail position={[-1.96, 0, 0.253]} size={[0.13, 1.72]} label="PLAN  ·  CREATE  ·  REMEMBER" vertical />
    <PrintedRail position={[1.96, 0, 0.253]} size={[0.13, 1.45]} label="EVERYDAY" vertical />
    <PrintedRail position={[0, 1.03, 0.188]} size={[2.75, 0.088]} label="12 MONTHS  ·  365 DAYS" />
    <PrintedRail position={[0, -1.03, 0.238]} size={[3.45, 0.105]} label="365 days of endless possibilities" />
    <PrintedBack />
    <Suspense fallback={null}><WeatherBacking image={weatherImage} /></Suspense>
    {months.map((_, index) => <Suspense key={index} fallback={null}><Card index={index} month={month} phase={phase} setPhase={setPhase} setMonth={setMonth} /></Suspense>)}
  </group>
}

function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1)
    const distance = Math.max(7.5, 4.25 / (2 * Math.tan(THREE.MathUtils.degToRad(33 / 2)) * Math.max(aspect, 0.01)))
    const elevation = THREE.MathUtils.degToRad(size.width / Math.max(size.height, 1) < 1.18 ? 39 : 34)
    camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

export default function CalendarScene({ month, phase, setPhase, setMonth, spin, weatherImage }) {
  return <div className="scene-canvas"><Canvas shadows dpr={[1, 1.5]} fallback={<div className="scene-fallback">Your calendar preview needs WebGL enabled.</div>} camera={{ position: [0, 0.12, 7.5], fov: 33 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}>
    <ResponsiveCamera />
    <ambientLight intensity={0.62} />
    <directionalLight position={[-3.5, 5, 6]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={14} />
    <directionalLight position={[4, 1, -3]} intensity={0.3} />
    <Product month={month} phase={phase} setPhase={setPhase} setMonth={setMonth} spin={spin} weatherImage={weatherImage} />
    <ContactShadows position={[0, -1.19, 0]} opacity={0.2} scale={6} blur={2.8} far={2.2} />
    <Environment preset="studio" />
    <OrbitControls enablePan={false} enableZoom={false} enableRotate enableDamping dampingFactor={0.045} rotateSpeed={0.72} minPolarAngle={0.001} maxPolarAngle={Math.PI - 0.001} minAzimuthAngle={-Infinity} maxAzimuthAngle={Infinity} />
  </Canvas></div>
}
