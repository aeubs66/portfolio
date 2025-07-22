"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface CursorTrail {
  x: number
  y: number
  id: number
  opacity: number
}

interface ClickEffect {
  x: number
  y: number
  id: number
}

const sectionColors: Record<string, string> = {
  home: "#10b981",
  about: "#06b6d4",
  skills: "#8b5cf6",
  projects: "#f97316",
  contact: "#22c55e",
}

export default function CustomCursor() {
  // Remove mousePosition from state, use ref instead
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [_, forceRerender] = useState(0) // For visibility/variant updates

  const [cursorVariant, setCursorVariant] = useState("default")
  const [isVisible, setIsVisible] = useState(false)
  const [trails, setTrails] = useState<CursorTrail[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [currentSection, setCurrentSection] = useState("home")

  // Refs for ultra-smooth performance
  const rafRef = useRef<number>()
  const trailIdRef = useRef(0)
  const clickIdRef = useRef(0)
  const targetPosition = useRef({ x: 0, y: 0 })
  const currentPosition = useRef({ x: 0, y: 0 })
  const lastTrailTime = useRef(0)

  // Ultra-smooth cursor movement with perfect interpolation
  const updateCursorPosition = useCallback(() => {
    const target = targetPosition.current
    const current = currentPosition.current

    // Snappier but still smooth
    const smoothness = 0.18
    current.x += (target.x - current.x) * smoothness
    current.y += (target.y - current.y) * smoothness

    // Directly update the DOM for the main cursor and ring
    if (cursorRef.current) {
      const cursorSize = cursorVariant === "hover" ? 20 : 12
      cursorRef.current.style.left = `${current.x - cursorSize / 2}px`
      cursorRef.current.style.top = `${current.y - cursorSize / 2}px`
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${current.x - 16}px`
      ringRef.current.style.top = `${current.y - 16}px`
    }

    rafRef.current = requestAnimationFrame(updateCursorPosition)
  }, [cursorVariant])

  // Minimal trail creation (slower, more persistent)
  const createTrail = useCallback(() => {
    const now = performance.now()
    if (now - lastTrailTime.current < 60) return // More frequent trails

    lastTrailTime.current = now
    const current = currentPosition.current

    const newTrail: CursorTrail = {
      x: current.x,
      y: current.y,
      id: trailIdRef.current++,
      opacity: 1,
    }

    setTrails((prev) => [...prev.slice(-6), newTrail]) // More persistent trail
  }, [])

  // Simple click effect
  const createClickEffect = useCallback((x: number, y: number) => {
    const newEffect: ClickEffect = {
      x,
      y,
      id: clickIdRef.current++,
    }

    setClickEffects((prev) => [...prev.slice(-2), newEffect])

    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
    }, 500)
  }, [])

  // Mouse handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY }
      setIsVisible(true)
      createTrail()
    },
    [createTrail],
  )

  const handleClick = useCallback(
    (e: MouseEvent) => {
      createClickEffect(e.clientX, e.clientY)
    },
    [createClickEffect],
  )

  const handleMouseLeave = useCallback(() => setIsVisible(false), [])
  const handleMouseEnter = useCallback(() => setIsVisible(true), [])

  // Section detection
  useEffect(() => {
    const detectSection = () => {
      const sections = ["home", "about", "skills", "projects", "contact"]
      const scrollY = window.scrollY + window.innerHeight / 2

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { top, height } = element.getBoundingClientRect()
          const elementTop = window.scrollY + top

          if (scrollY >= elementTop && scrollY <= elementTop + height) {
            if (section !== currentSection) {
              setCurrentSection(section)
            }
            break
          }
        }
      }
    }

    window.addEventListener("scroll", detectSection, { passive: true })
    detectSection()

    return () => window.removeEventListener("scroll", detectSection)
  }, [currentSection])

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return

    // Setup hover listeners
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll("button, a, input, textarea, [data-cursor]")

      interactiveElements.forEach((el) => {
        const handleEnter = () => setCursorVariant("hover")
        const handleLeave = () => setCursorVariant("default")

        el.addEventListener("mouseenter", handleEnter, { passive: true })
        el.addEventListener("mouseleave", handleLeave, { passive: true })
      })
    }

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    window.addEventListener("mouseenter", handleMouseEnter, { passive: true })
    window.addEventListener("click", handleClick, { passive: true })

    // Start animation
    rafRef.current = requestAnimationFrame(updateCursorPosition)

    setTimeout(setupHoverListeners, 100)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("click", handleClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMouseMove, handleClick, handleMouseLeave, handleMouseEnter, updateCursorPosition])

  // Trail fade animation (slower fade)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) =>
        prev.map((trail) => ({ ...trail, opacity: trail.opacity - 0.08 })).filter((trail) => trail.opacity > 0),
      )
    }, 60)

    return () => clearInterval(interval)
  }, [])

  if (typeof window !== "undefined" && window.innerWidth < 768) return null

  const currentColor = sectionColors[currentSection] || sectionColors.home
  const cursorSize = cursorVariant === "hover" ? 20 : 12

  return (
    <>
      {/* Smooth Trails */}
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="fixed pointer-events-none z-[9996] rounded-full transition-colors duration-700"
          style={{
            left: trail.x - 2,
            top: trail.y - 2,
            width: 4,
            height: 4,
            backgroundColor: currentColor,
            opacity: trail.opacity * 0.4,
            transform: "translate3d(0,0,0)",
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* Click Effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="fixed pointer-events-none z-[9995]"
          style={{
            left: effect.x - 15,
            top: effect.y - 15,
            transform: "translate3d(0,0,0)",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="w-8 h-8 border-2 rounded-full animate-ping"
            style={{
              borderColor: currentColor,
              animationDuration: "0.5s",
            }}
          />
        </div>
      ))}

      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] rounded-full transition-all duration-350 ease-out"
        style={{
          width: cursorSize,
          height: cursorSize,
          backgroundColor: currentColor,
          opacity: isVisible ? 1 : 0,
          transform: `scale(${cursorVariant === "hover" ? 1.5 : 1})`,
          boxShadow: `0 0 20px ${currentColor}40`,
          willChange: "transform, opacity",
        }}
      />

      {/* Outer Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] rounded-full border transition-all duration-500"
        style={{
          width: 32,
          height: 32,
          borderColor: `${currentColor}60`,
          opacity: isVisible && cursorVariant === "hover" ? 1 : 0.3,
          willChange: "transform, opacity",
        }}
      />
    </>
  )
}
