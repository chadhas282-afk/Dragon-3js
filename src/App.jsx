import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Lenis from 'lenis'
import Dragon from './components/dragon'
import "./App.css"

export default function App() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        }
    }
    window.addEventListener('mousemove', moveCursor)

    return () => {
      lenis.destroy()
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
    <main>
      <div className="custom-cursor" ref={cursorRef}></div>
      <Canvas id="canvas-elem" style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
         }}>
        <Dragon />
      </Canvas>
      <section id="section-1">
        <nav>