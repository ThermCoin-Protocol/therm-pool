"use client"

import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
 
export default function Background({children}) {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(NET({
        el: myRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1,
        scaleMobile: 1.00,
        color: 0x878787,
        backgroundColor: 0xf4eee0,
        points: 10.00,
        maxDistance: 27.00,
        spacing: 20.00,
        showDots: true
      }))
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])
 
  return (
    <div ref={myRef} className="min-h-screen">{children}</div>
  )
}
