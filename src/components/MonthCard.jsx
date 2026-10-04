import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

// Native-resolution crops preserve the fine print and typography of the source cards.
export function useMonthTexture(index) {
  const path = `/months/month-${String(index + 1).padStart(2, '0')}-bold-v3.png`
  const texture = useLoader(THREE.TextureLoader, path)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}
