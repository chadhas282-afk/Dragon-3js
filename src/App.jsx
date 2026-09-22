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
    