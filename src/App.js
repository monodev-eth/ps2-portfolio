import { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Billboard } from '@react-three/drei'
import { TextureLoader } from 'three'

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Sphere = ({ color, a, b, c, phase }) => {
  const [t, setT] = useState(0)
  useFrame(() => {
    setT(t + 0.01)
  })

  const r = 1.3 * (Math.sin(t * t * c + phase) + 2) * 1.5
  const pos = [r * Math.cos(t * a + phase), r * Math.sin(t * b + phase), -1 * Math.sin(t / 1000.0 + phase) - 2]

  return (
    <>
      <mesh position={pos}>
        <sphereGeometry args={[0.05, 64, 64]} />
        <meshBasicMaterial attach="material" color={color} />
      </mesh>
      <pointLight position={pos} color={color} />
    </>
  )
}

const Clouds = () => {
  const [billboardTexture, alpha] = useLoader(TextureLoader, ['clouds.png'])

  return (
    <Billboard position={[0, 0, -10]} args={[100, 30]}>
      <meshBasicMaterial attach="material" map={billboardTexture} />
    </Billboard>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <Sphere color="#00ff00" phase={Math.PI / 3} a={0.04} b={0.09} c={0.0008} />
      <Clouds />
      <OrbitControls />
    </Canvas>
  )
}
