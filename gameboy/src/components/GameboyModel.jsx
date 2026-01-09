import { useEffect, useRef } from "react"
import { useGLTF, Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

import Footer from "./screens/Footer.jsx"
import SmallScreen from "./screens/SmallScreen.jsx"

const FOOTER_TEXTS = [
  "A bit farther, reach out a bit farther.>",
  "Visions and emotions fly like birds.>",
  "Difficult to capture > precious in the moment > on endless journeys.>",
  "Imagination is only beautiful when realized.>",
  "<.Curiosity is",
  "All we have.>",
]

function GameboyModel({ onLoaded }) {
  const base = import.meta.env.BASE_URL
  const url = base.endsWith("/")
    ? `${base}gameboy_2.gltf`
    : `${base}/gameboy_2.gltf`

  const { scene } = useGLTF(url)
  const groupRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })
  const frameAccumulator = useRef(0)

  // Mouse movement (desktop only)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.x = x
      mouseRef.current.y = y
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Fix materials + notify App
  useEffect(() => {
    scene.traverse((obj) => {
      if (!obj.isMesh) return
  
      const name = obj.name.toLowerCase()
      const mat = obj.material
  
      if (!mat) return
  
      // Existing fix for circuit boards
      if (
        name.includes("circuitboard") ||
        name.includes("mini_circuit")
      ) {
        mat.transparent = false
        mat.opacity = 1
      }
  
      // Physical glass/plastic fix for the CASE
      if (name === "case" && mat.isMeshPhysicalMaterial) {
        mat.transparent = true
        mat.opacity = 1
  
        mat.transmission = 1
        mat.thickness = 0.5
        mat.ior = 1.5
        
        mat.color.set("#f8f8f8")
        mat.roughness = 1
        mat.metalness = 0
  
        mat.envMapIntensity = 1.2
        mat.needsUpdate = true
      }
    })
  
    onLoaded?.()
  }, [scene, onLoaded])

  // Subtle tilt animation
  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Cap at ~60fps to reduce allocation/GC pressure
    frameAccumulator.current += delta
    if (frameAccumulator.current < 1 / 60) return
    frameAccumulator.current = 0

    const maxRotation = 0.12
    const { x, y } = mouseRef.current
    groupRef.current.rotation.x = y * maxRotation
    groupRef.current.rotation.y = x * maxRotation
  })

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />

        {/* MAIN GAMEBOY SCREEN */}
        <Html
          position={[0, 0, -0.76]}
          rotation={[-Math.PI / 2, 0, 0]}
          transform
          occlude={false}
          zIndexRange={[10, 0]}
          distanceFactor={1}
        >
          <div className="w-160 h-212">
            <Footer
              texts={FOOTER_TEXTS}
            />
          </div>
        </Html>

        {/* SMALL SECONDARY SCREEN */}
        <Html
          position={[0, 0.4, 0.61]}
          rotation={[-Math.PI / 2, 0, 0]}
          transform
          distanceFactor={1}
        >
          <SmallScreen />
        </Html>
      </group>
    </>
  )
}

export default GameboyModel
