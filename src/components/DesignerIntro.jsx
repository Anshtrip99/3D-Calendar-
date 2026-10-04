import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function BuildingScene() {
  const facade = '#ddd8ce'
  const windowGlass = '#84949a'
  return <group>
    <mesh position={[0, -0.08, -1.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#c9c3b8" /></mesh>
    <mesh position={[0, 1.15, -2.2]}><boxGeometry args={[3.4, 2.4, 0.22]} /><meshStandardMaterial color={facade} /></mesh>
    {[-1.05, -0.35, 0.35, 1.05].map(x => [-0.1, 0.65, 1.4].map(y => <mesh key={`${x}-${y}`} position={[x, y, -2.075]}><boxGeometry args={[0.42, 0.48, 0.025]} /><meshStandardMaterial color={windowGlass} roughness={0.36} /></mesh>))}
    <mesh position={[-2.1, 0.86, -1.65]}><boxGeometry args={[0.24, 1.95, 0.34]} /><meshStandardMaterial color="#b9b2a7" /></mesh>
    <mesh position={[2.05, 0.65, -2.35]}><boxGeometry args={[1.25, 1.45, 0.2]} /><meshStandardMaterial color="#c8c1b5" /></mesh>
    {[-0.1, 0.4, 0.9, 1.4].map(y => <mesh key={y} position={[0, y, -2.06]}><boxGeometry args={[3.45, 0.025, 0.025]} /><meshStandardMaterial color="#a59c8f" /></mesh>)}
    <mesh position={[0, 0.02, -0.26]}><boxGeometry args={[2.7, 0.07, 0.48]} /><meshStandardMaterial color="#d9d3c8" /></mesh>
    <mesh position={[-2.45, 0.55, -0.75]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#aa9f91" /></mesh>
    <mesh position={[2.45, 0.55, -0.75]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#aa9f91" /></mesh>
  </group>
}

function FootballScene() {
  const stripeColors = ['#397749', '#438453']
  return <group>
    <mesh position={[0, -0.09, -1.8]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 100]} /><meshStandardMaterial color="#377847" /></mesh>
    {[-4.5, -2.7, -0.9, 0.9, 2.7, 4.5].map((z, i) => <mesh key={z} position={[0, -0.025, z - 1]}><boxGeometry args={[12, 0.012, 1.8]} /><meshStandardMaterial color={stripeColors[i % 2]} /></mesh>)}
    <mesh position={[0, -0.012, -1.9]}><boxGeometry args={[7.7, 0.012, 0.018]} /><meshBasicMaterial color="#f3f0dc" /></mesh>
    <mesh position={[0, -0.012, -3.2]}><boxGeometry args={[0.018, 0.012, 2.65]} /><meshBasicMaterial color="#f3f0dc" /></mesh>
    <mesh position={[0, 0.003, -1.9]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.64, 0.012, 8, 48]} /><meshBasicMaterial color="#f3f0dc" /></mesh>
    <mesh position={[0, 0.53, -4.6]}><boxGeometry args={[1.45, 1.05, 0.06]} /><meshBasicMaterial color="#f3f0dc" wireframe /></mesh>
    {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-2.8 + i * 0.62, 0.5 + (i % 3) * 0.11, -4.2]}><boxGeometry args={[0.42, 0.5, 0.33]} /><meshStandardMaterial color={i % 2 ? '#e5e1d7' : '#9f493d'} /></mesh>)}
    {[-3.2, 3.2].map(x => <mesh key={x} position={[x, 0.28, -3.9]}><boxGeometry args={[0.12, 0.56, 0.12]} /><meshStandardMaterial color="#f3f0dc" /></mesh>)}
  </group>
}

function Head({ glasses = false, hair = '#211b19', hairStyle = 'side-part', skin = '#a96f4e' }) {
  return <group>
    <mesh position={[0, 1.13, 0.005]} scale={[1.01, 0.99, 0.99]}><sphereGeometry args={[0.175, 32, 24]} /><meshStandardMaterial color={skin} roughness={0.82} /></mesh>
    <mesh position={[-0.174, 1.115, -0.005]}><sphereGeometry args={[0.041, 18, 14]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[0.174, 1.115, -0.005]}><sphereGeometry args={[0.041, 18, 14]} /><meshStandardMaterial color={skin} /></mesh>
    <mesh position={[-0.176, 1.115, 0.027]}><sphereGeometry args={[0.018, 12, 10]} /><meshStandardMaterial color="#875238" roughness={0.9} /></mesh>
    <mesh position={[0.176, 1.115, 0.027]}><sphereGeometry args={[0.018, 12, 10]} /><meshStandardMaterial color="#875238" roughness={0.9} /></mesh>
    <mesh position={[0, 1.25, -0.015]} scale={[1.06, 0.56, 0.97]}><sphereGeometry args={[0.177, 28, 20]} /><meshStandardMaterial color={hair} roughness={0.88} /></mesh>
    {hairStyle === 'side-part' ? <group>
      <mesh position={[-0.052, 1.315, 0.065]} rotation={[0.15, 0, -0.25]} scale={[0.68, 0.31, 0.57]}><sphereGeometry args={[0.09, 18, 14]} /><meshStandardMaterial color={hair} roughness={0.88} /></mesh>
      <mesh position={[0.105, 1.245, 0.055]} rotation={[0, 0, 0.12]} scale={[0.28, 0.53, 0.43]}><sphereGeometry args={[0.075, 16, 12]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
      <mesh position={[-0.135, 1.22, 0.045]} scale={[0.25, 0.44, 0.42]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
    </group> : <group>
      {[-0.07, 0, 0.07].map((x, i) => <mesh key={x} position={[x, 1.29 + (i === 1 ? 0.006 : 0), 0.105]} rotation={[0, 0, (i - 1) * -0.08]} scale={[0.85, 0.45, 0.52]}><sphereGeometry args={[0.042, 16, 12]} /><meshStandardMaterial color={hair} roughness={0.92} /></mesh>)}
      <mesh position={[-0.14, 1.22, 0.045]} scale={[0.22, 0.38, 0.4]}><sphereGeometry args={[0.06, 14, 12]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
      <mesh position={[0.14, 1.22, 0.045]} scale={[0.22, 0.38, 0.4]}><sphereGeometry args={[0.06, 14, 12]} /><meshStandardMaterial color={hair} roughness={0.9} /></mesh>
    </group>}
    {[-0.061, 0.061].map(x => <group key={x}>
      <mesh position={[x, 1.135, 0.148]}><sphereGeometry args={[0.034, 18, 14]} /><meshStandardMaterial color="#fff5e9" roughness={0.35} /></mesh>
      <mesh position={[x + (x < 0 ? 0.004 : -0.004), 1.134, 0.177]}><sphereGeometry args={[0.016, 16, 12]} /><meshStandardMaterial color="#392a24" roughness={0.32} /></mesh>
      <mesh position={[x + (x < 0 ? 0.001 : -0.007), 1.14, 0.19]}><sphereGeometry args={[0.005, 10, 8]} /><meshBasicMaterial color="#fffdf8" /></mesh>
      <mesh position={[x, 1.181, 0.15]} rotation={[0, 0, x < 0 ? 0.09 : -0.09]}><capsuleGeometry args={[0.009, 0.043, 3, 8]} /><meshStandardMaterial color={hair} /></mesh>
    </group>)}
    <mesh position={[0, 1.078, 0.166]} scale={[0.72, 0.82, 0.62]}><sphereGeometry args={[0.027, 14, 12]} /><meshStandardMaterial color="#996044" roughness={0.8} /></mesh>
    <mesh position={[0, 1.045, 0.165]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.027, 0.0045, 6, 20, Math.PI]} /><meshBasicMaterial color="#633f36" /></mesh>
    {glasses && <group>
      <mesh position={[-0.061, 1.135, 0.199]}><torusGeometry args={[0.044, 0.0055, 8, 28]} /><meshStandardMaterial color="#302722" metalness={0.22} roughness={0.32} /></mesh>
      <mesh position={[0.061, 1.135, 0.199]}><torusGeometry args={[0.044, 0.0055, 8, 28]} /><meshStandardMaterial color="#302722" metalness={0.22} roughness={0.32} /></mesh>
      <mesh position={[0, 1.14, 0.2]}><boxGeometry args={[0.026, 0.009, 0.009]} /><meshStandardMaterial color="#302722" metalness={0.22} roughness={0.32} /></mesh>
      <mesh position={[-0.119, 1.151, 0.174]} rotation={[0, 0, -0.13]}><boxGeometry args={[0.038, 0.008, 0.008]} /><meshStandardMaterial color="#302722" /></mesh>
      <mesh position={[0.119, 1.151, 0.174]} rotation={[0, 0, 0.13]}><boxGeometry args={[0.038, 0.008, 0.008]} /><meshStandardMaterial color="#302722" /></mesh>
    </group>}
  </group>
}

function Raaghav() {
  const jacket = '#344c50'
  return <group>
    <mesh position={[0, 0.77, -0.1]}><boxGeometry args={[0.3, 0.42, 0.18]} /><meshStandardMaterial color="#554238" roughness={0.9} /></mesh>
    <mesh position={[0, 0.69, 0]}><capsuleGeometry args={[0.15, 0.3, 8, 20]} /><meshStandardMaterial color={jacket} roughness={0.78} /></mesh>
    <mesh position={[0, 0.72, 0.155]}><boxGeometry args={[0.1, 0.37, 0.018]} /><meshStandardMaterial color="#f0e9dc" /></mesh>
    <mesh position={[-0.071, 0.785, 0.172]} rotation={[0, 0, -0.16]}><coneGeometry args={[0.076, 0.19, 3]} /><meshStandardMaterial color="#e4ddd0" roughness={0.8} /></mesh>
    <mesh position={[0.071, 0.785, 0.172]} rotation={[0, 0, 0.16]}><coneGeometry args={[0.076, 0.19, 3]} /><meshStandardMaterial color="#e4ddd0" roughness={0.8} /></mesh>
    <mesh position={[0, 0.92, 0.16]} rotation={[0, 0, Math.PI]}><coneGeometry args={[0.045, 0.085, 4]} /><meshStandardMaterial color="#bf7861" /></mesh>
    {[0.66, 0.76].map(y => <mesh key={y} position={[0.015, y, 0.171]}><sphereGeometry args={[0.012, 10, 8]} /><meshStandardMaterial color="#c4a36c" metalness={0.35} /></mesh>)}
    <mesh position={[-0.107, 0.64, 0.136]}><boxGeometry args={[0.07, 0.055, 0.012]} /><meshStandardMaterial color="#405e5c" /></mesh>
    <mesh position={[-0.107, 0.64, 0.145]}><boxGeometry args={[0.035, 0.012, 0.006]} /><meshStandardMaterial color="#d1b27d" /></mesh>
    <mesh position={[0.082, 0.61, 0.159]}><boxGeometry args={[0.09, 0.13, 0.018]} /><meshStandardMaterial color="#294149" roughness={0.8} /></mesh>
    <mesh position={[0.082, 0.65, 0.171]}><boxGeometry args={[0.008, 0.055, 0.008]} /><meshStandardMaterial color="#d1b27d" metalness={0.3} /></mesh>
    <mesh position={[-0.22, 0.67, 0]} rotation={[0, 0, -0.16]}><capsuleGeometry args={[0.06, 0.34, 8, 16]} /><meshStandardMaterial color={jacket} /></mesh>
    <mesh position={[0.22, 0.67, 0]} rotation={[0, 0, 0.2]}><capsuleGeometry args={[0.06, 0.34, 8, 16]} /><meshStandardMaterial color={jacket} /></mesh>
    <mesh position={[-0.09, 0.25, 0]}><capsuleGeometry args={[0.065, 0.34, 4, 10]} /><meshStandardMaterial color="#303c48" /></mesh>
    <mesh position={[0.09, 0.25, 0]}><capsuleGeometry args={[0.065, 0.34, 4, 10]} /><meshStandardMaterial color="#303c48" /></mesh>
    <mesh position={[-0.09, 0.07, 0.035]}><boxGeometry args={[0.14, 0.075, 0.24]} /><meshStandardMaterial color="#302b29" /></mesh>
    <mesh position={[0.09, 0.07, 0.035]}><boxGeometry args={[0.14, 0.075, 0.24]} /><meshStandardMaterial color="#302b29" /></mesh>
    <Head glasses />
    <mesh position={[0.24, 0.68, 0]} rotation={[0, 0, -0.62]}><capsuleGeometry args={[0.055, 0.24, 6, 12]} /><meshStandardMaterial color="#a96f4e" /></mesh>
    <mesh position={[0.38, 0.83, 0.02]} rotation={[0, 0, -0.15]}><capsuleGeometry args={[0.045, 0.2, 6, 12]} /><meshStandardMaterial color="#a96f4e" /></mesh>
    <mesh position={[0.4, 0.97, 0.035]}><sphereGeometry args={[0.065, 16, 12]} /><meshStandardMaterial color="#a96f4e" /></mesh>
    {[0, 1, 2, 3].map(i => <mesh key={i} position={[0.38 + i * 0.012, 1.015, 0.038]} rotation={[0, 0, -0.1]}><capsuleGeometry args={[0.009, 0.032, 4, 8]} /><meshStandardMaterial color="#a96f4e" /></mesh>)}
    <mesh position={[0.34, 0.76, 0.05]} rotation={[0, 0, -0.12]}><boxGeometry args={[0.24, 0.34, 0.055]} /><meshStandardMaterial color="#344d50" roughness={0.72} /></mesh>
    <mesh position={[0.34, 0.76, 0.082]}><boxGeometry args={[0.195, 0.28, 0.008]} /><meshStandardMaterial color="#f0e9dc" /></mesh>
    <mesh position={[0.34, 0.76, 0.088]}><boxGeometry args={[0.012, 0.28, 0.006]} /><meshStandardMaterial color="#db5a4f" /></mesh>
    <mesh position={[0.38, 0.92, 0.08]} rotation={[0, 0, -0.22]}><cylinderGeometry args={[0.009, 0.009, 0.16, 8]} /><meshStandardMaterial color="#d1b27d" metalness={0.3} /></mesh>
  </group>
}

function JerseyNumber() {
  const materialMap = useState(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128; canvas.height = 128
    const context = canvas.getContext('2d')
    context.fillStyle = '#1d2c3a'; context.font = '700 76px Arial'; context.textAlign = 'center'; context.textBaseline = 'middle'
    context.fillText('10', 64, 66)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })[0]
  useEffect(() => () => materialMap.dispose(), [materialMap])
  return <mesh position={[0, 0.55, 0.205]}><planeGeometry args={[0.17, 0.17]} /><meshBasicMaterial map={materialMap} transparent toneMapped={false} depthWrite={false} /></mesh>
}

function Ansh() {
  const ball = useRef()
  const born = useRef(null)
  const ballTexture = useState(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 256
    const context = canvas.getContext('2d')
    context.fillStyle = '#f7f4ed'; context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#20252a'
    const pentagon = (x, y, radius) => {
      context.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + i * Math.PI * 2 / 5
        const px = x + Math.cos(angle) * radius, py = y + Math.sin(angle) * radius
        if (!i) context.moveTo(px, py); else context.lineTo(px, py)
      }
      context.closePath(); context.fill()
    }
    pentagon(64, 66, 26); pentagon(192, 24, 26); pentagon(320, 66, 26); pentagon(448, 24, 26)
    pentagon(128, 194, 26); pentagon(256, 150, 26); pentagon(384, 194, 26)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    return texture
  })[0]
  useEffect(() => () => ballTexture.dispose(), [ballTexture])
  useFrame((state) => {
    if (!ball.current) return
    if (born.current === null) born.current = state.clock.elapsedTime
    const elapsed = state.clock.elapsedTime - born.current
    const cycle = elapsed % 5.2
    const flight = cycle > 1.05 && cycle < 2.2
    ball.current.position.x = flight ? 0.36 + (cycle - 1.05) * 2.5 : 0.37
    ball.current.position.y = flight ? 0.12 + Math.sin((cycle - 1.05) / 1.15 * Math.PI) * 1.05 : 0.12
    ball.current.rotation.z += flight ? 0.22 : 0.025
  })
  return <group>
    <mesh position={[0, 0.7, 0]}><capsuleGeometry args={[0.17, 0.35, 8, 20]} /><meshStandardMaterial color="#f7f5ee" roughness={0.68} /></mesh>
    {[-0.105, 0, 0.105].map((x, i) => <mesh key={x} position={[x, 0.72, 0.15]}><boxGeometry args={[0.052, 0.36, 0.012]} /><meshStandardMaterial color={i === 1 ? '#5da8d2' : '#7bbde0'} /></mesh>)}
    <mesh position={[-0.085, 0.81, 0.174]}><torusGeometry args={[0.031, 0.006, 8, 24]} /><meshStandardMaterial color="#c9a85f" metalness={0.25} /></mesh>
    <mesh position={[-0.085, 0.81, 0.178]}><circleGeometry args={[0.023, 20]} /><meshBasicMaterial color="#4e8e66" /></mesh>
    <mesh position={[0, 0.905, 0.15]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.065, 0.018, 8, 20, Math.PI]} /><meshStandardMaterial color="#f7f5ee" roughness={0.6} /></mesh>
    <mesh position={[0, 0.87, 0.171]}><boxGeometry args={[0.13, 0.025, 0.012]} /><meshStandardMaterial color="#5da8d2" roughness={0.7} /></mesh>
    <mesh position={[-0.16, 0.72, 0.13]} rotation={[0, 0, -0.2]}><boxGeometry args={[0.028, 0.32, 0.012]} /><meshStandardMaterial color="#ece7d6" /></mesh>
    <mesh position={[0.16, 0.72, 0.13]} rotation={[0, 0, 0.2]}><boxGeometry args={[0.028, 0.32, 0.012]} /><meshStandardMaterial color="#ece7d6" /></mesh>
    <JerseyNumber />
    <mesh position={[0, 0.36, 0]}><capsuleGeometry args={[0.14, 0.11, 6, 12]} /><meshStandardMaterial color="#17395e" roughness={0.75} /></mesh>
    <mesh position={[0, 0.475, 0.124]}><boxGeometry args={[0.12, 0.018, 0.01]} /><meshStandardMaterial color="#dceaf0" /></mesh>
    <mesh position={[-0.105, 0.34, 0.106]}><boxGeometry args={[0.018, 0.18, 0.008]} /><meshStandardMaterial color="#f7f5ee" /></mesh>
    <mesh position={[0.105, 0.34, 0.106]}><boxGeometry args={[0.018, 0.18, 0.008]} /><meshStandardMaterial color="#f7f5ee" /></mesh>
    <mesh position={[-0.22, 0.72, 0]} rotation={[0, 0, -0.22]}><capsuleGeometry args={[0.064, 0.19, 6, 12]} /><meshStandardMaterial color="#f7f5ee" roughness={0.72} /></mesh>
    <mesh position={[0.22, 0.72, 0]} rotation={[0, 0, 0.18]}><capsuleGeometry args={[0.064, 0.19, 6, 12]} /><meshStandardMaterial color="#f7f5ee" roughness={0.72} /></mesh>
    <mesh position={[-0.255, 0.51, 0.012]} rotation={[0, 0, -0.12]}><capsuleGeometry args={[0.045, 0.22, 6, 12]} /><meshStandardMaterial color="#a96f4e" roughness={0.8} /></mesh>
    <mesh position={[0.255, 0.51, 0.012]} rotation={[0, 0, 0.08]}><capsuleGeometry args={[0.045, 0.22, 6, 12]} /><meshStandardMaterial color="#a96f4e" roughness={0.8} /></mesh>
    <mesh position={[-0.09, 0.18, 0]} rotation={[0, 0, 0.08]}><capsuleGeometry args={[0.057, 0.23, 6, 12]} /><meshStandardMaterial color="#a96f4e" roughness={0.8} /></mesh>
    <mesh position={[0.13, 0.21, 0]} rotation={[0, 0, -0.28]}><capsuleGeometry args={[0.057, 0.23, 6, 12]} /><meshStandardMaterial color="#a96f4e" roughness={0.8} /></mesh>
    <mesh position={[-0.09, 0.155, 0.008]}><capsuleGeometry args={[0.056, 0.2, 6, 12]} /><meshStandardMaterial color="#f7f5ee" roughness={0.7} /></mesh>
    <mesh position={[0.13, 0.185, 0.008]} rotation={[0, 0, -0.28]}><capsuleGeometry args={[0.056, 0.2, 6, 12]} /><meshStandardMaterial color="#f7f5ee" roughness={0.7} /></mesh>
    <mesh position={[-0.09, 0.045, 0.075]}><boxGeometry args={[0.14, 0.085, 0.23]} /><meshStandardMaterial color="#25374b" roughness={0.52} /></mesh>
    <mesh position={[0.20, 0.105, 0.085]} rotation={[0, 0, -0.23]}><boxGeometry args={[0.15, 0.085, 0.23]} /><meshStandardMaterial color="#25374b" roughness={0.52} /></mesh>
    <mesh position={[-0.09, 0.087, 0.194]}><boxGeometry args={[0.092, 0.009, 0.008]} /><meshStandardMaterial color="#e5e3db" metalness={0.16} /></mesh>
    <mesh position={[0.20, 0.147, 0.204]} rotation={[0, 0, -0.23]}><boxGeometry args={[0.092, 0.009, 0.008]} /><meshStandardMaterial color="#e5e3db" metalness={0.16} /></mesh>
    <mesh position={[-0.09, 0.13, 0.065]}><boxGeometry args={[0.11, 0.016, 0.008]} /><meshStandardMaterial color="#5da8d2" /></mesh>
    <mesh position={[0.20, 0.19, 0.075]} rotation={[0, 0, -0.23]}><boxGeometry args={[0.11, 0.016, 0.008]} /><meshStandardMaterial color="#5da8d2" /></mesh>
    <Head hair="#30241d" hairStyle="crop" skin="#9d6046" />
    <mesh ref={ball} position={[0.37, 0.12, 0.05]} rotation={[Math.PI / 2, 0, 0]}><sphereGeometry args={[0.14, 32, 24]} /><meshStandardMaterial map={ballTexture} roughness={0.5} /></mesh>
  </group>
}

function ProfileFigure({ role, active }) {
  const figure = useRef()
  const previousRole = useRef(role)
  useEffect(() => {
    if (figure.current && previousRole.current !== role) figure.current.position.x = role === 'designer' ? -1.1 : 1.1
    previousRole.current = role
  }, [role])
  useFrame((state, dt) => {
    if (!figure.current) return
    const destination = active ? 0.15 : role === 'designer' ? -1.1 : 1.1
    figure.current.position.x = THREE.MathUtils.damp(figure.current.position.x, destination, 2.8, dt)
    figure.current.position.y = THREE.MathUtils.damp(figure.current.position.y, active ? 0 : -0.12, 2.2, dt) + (active ? Math.sin(state.clock.elapsedTime * 1.25) * 0.018 : 0)
    figure.current.rotation.y = THREE.MathUtils.damp(figure.current.rotation.y, active ? Math.sin(state.clock.elapsedTime * 0.55) * 0.08 : role === 'designer' ? 0.35 : -0.35, 2, dt)
  })
  return <group ref={figure} position={[role === 'designer' ? -1.1 : 1.1, -0.03, 0]} scale={1.52}>
    {role === 'designer' ? <Raaghav /> : <Ansh />}
  </group>
}

function Scene({ role, active }) {
  return <group position={[0, -0.42, 0]}>
    <ambientLight intensity={1.05} />
    <directionalLight position={[-3, 5, 5]} intensity={2} castShadow />
    <directionalLight position={[3, 3, -2]} intensity={0.7} />
    {role === 'designer' ? <BuildingScene /> : <FootballScene />}
    <ProfileFigure role={role} active={active} />
    <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.42, 32]} /><meshBasicMaterial color={role === 'designer' ? '#847768' : '#245a37'} transparent opacity={0.4} /></mesh>
  </group>
}

export default function DesignerIntro() {
  const section = useRef(null)
  const [role, setRole] = useState('designer')
  const [entered, setEntered] = useState(false)
  const [speechVisible, setSpeechVisible] = useState(false)
  useEffect(() => {
    if (!section.current || !('IntersectionObserver' in window)) { setEntered(true); return undefined }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect() }
    }, { threshold: 0.14 })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    setSpeechVisible(false)
    const timer = window.setTimeout(() => setSpeechVisible(true), role === 'designer' ? 450 : 2350)
    return () => window.clearTimeout(timer)
  }, [role])
  const isDesigner = role === 'designer'
  return <div ref={section} className={`designer-intro ${isDesigner ? 'role-designer' : 'role-creator'} ${entered ? 'is-entered' : ''}`}>
    <div className="designer-copy" key={role}>
      <span className="designer-eyebrow">{isDesigner ? 'CALENDAR DESIGNER · ARCHITECTURE STUDENT' : 'WEBSITE CREATOR · FOOTBALL FAN'}</span>
      <h2>{isDesigner ? 'Raaghav' : 'Ansh'}</h2>
      <p>{isDesigner ? 'The mind behind the calendar: a college student who turns everyday plans into little moments of design.' : 'The creator behind this experience, bringing the calendar to life with a little football spirit.'}</p>
      <div className="creator-switch" role="group" aria-label="Meet the team">
        <button className={isDesigner ? 'active' : ''} aria-pressed={isDesigner} onClick={() => setRole('designer')}>01 <span>Raaghav</span></button>
        <button className={!isDesigner ? 'active' : ''} aria-pressed={!isDesigner} onClick={() => setRole('creator')}>02 <span>Ansh</span></button>
      </div>
      <span className="designer-caption">{isDesigner ? 'DESIGN · FORM · EVERYDAY RITUALS' : 'CODE · MOTION · THE BEAUTIFUL GAME'}</span>
    </div>
    <div className="designer-visual" aria-label={isDesigner ? '3D student figure in an architectural scene' : '3D number 10 Argentina football figure on a pitch'}>
      <div className="visual-label"><span>FIG. 0{isDesigner ? '1' : '2'}</span><span>{isDesigner ? 'STUDIO / CAMPUS' : 'PITCH / NO. 10'}</span></div>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.35, 6], fov: 32 }}>
        <Scene role={role} active={entered} />
      </Canvas>
      <div className="visual-floor-label">{isDesigner ? 'DESIGNING THE EVERYDAY' : 'ALWAYS PLAYING FORWARD'}</div>
      <div className={`maker-speech ${speechVisible ? 'is-speaking' : ''} ${isDesigner ? 'speech-designer' : 'speech-creator'}`} aria-live="polite">
        <span>{isDesigner ? 'A NOTE FROM THE DESIGNER' : 'AFTER THE GOAL'}</span>
        <p>{isDesigner ? "Hi guys, I'm the designer of this calendar." : 'Hi Guys! Hope U Like the website.'}</p>
      </div>
    </div>
  </div>
}
