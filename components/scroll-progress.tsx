"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const rafRef = useRef<number>()
  const sections = ["home", "about", "skills", "projects", "contact"]

  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100

    setScrollProgress(Math.min(Math.max(scrollPercent, 0), 100))
    setIsVisible(scrollTop > 100)

    // Update active section
    const currentSection = sections.find((section) => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      }
      return false
    })

    if (currentSection) {
      setActiveSection(currentSection)
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(updateScrollProgress)
  }, [updateScrollProgress])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const sectionColors = {
    home: "#10b981",
    about: "#06b6d4",
    skills: "#8b5cf6",
    projects: "#f97316",
    contact: "#22c55e",
  }

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;

  return (
    <>
      {/* Simple Left Navigation - Column Layout */}
      <div
        className={`hidden md:block fixed left-6 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Navigation Title */}
          <div className="text-white/60 text-xs font-mono rotate-90 mb-4 tracking-widest">NAVIGATE</div>

          {/* Navigation Dots Column */}
          <div className="flex flex-col items-center space-y-4">
            {sections.map((section, index) => {
              const isActive = activeSection === section
              const color = sectionColors[section as keyof typeof sectionColors]

              return (
                <div key={section} className="relative group">
                  {/* Section Number */}
                  <div
                    className={`absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs font-mono transition-all duration-300 ${
                      isActive ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    0{index + 1}
                  </div>

                  {/* Main Navigation Dot */}
                  <button
                    onClick={() => scrollToSection(section)}
                    className="relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 group overflow-visible"
                    style={{
                      backgroundColor: isActive ? color : "rgba(255, 255, 255, 0.2)",
                      boxShadow: isActive ? `0 0 15px ${color}` : "none",
                    }}
                    data-magnetic="true"
                  >
                    {/* Water-like animated inner for active section */}
                    {isActive && (
                      <span
                        className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full overflow-hidden"
                        style={{
                          transform: "translate(-50%, -50%)",
                          background: `linear-gradient(135deg, ${color} 60%, #fff 100%)`,
                          boxShadow: `0 0 8px ${color}80`,
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="w-full h-full" style={{ display: 'block' }}>
                          <defs>
                            <linearGradient id={`water-gradient-${section}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={color} />
                              <stop offset="100%" stopColor="#fff" />
                            </linearGradient>
                          </defs>
                          <path>
                            <animate
                              attributeName="d"
                              dur="2s"
                              repeatCount="indefinite"
                              values="M0,12 Q6,10 12,12 T24,12 V24 H0Z;M0,12 Q6,14 12,12 T24,12 V24 H0Z;M0,12 Q6,10 12,12 T24,12 V24 H0Z"
                            />
                          </path>
                          <circle cx="12" cy="12" r="10" fill={`url(#water-gradient-${section})`} />
                        </svg>
                      </span>
                    )}
                    {/* Active indicator ring */}
                    {isActive && (
                      <div
                        className="absolute -inset-2 rounded-full border animate-pulse"
                        style={{ borderColor: `${color}40` }}
                      />
                    )}
                  </button>

                  {/* Section Label */}
                  <div
                    className={`absolute left-8 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg text-sm font-mono whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                    }`}
                    style={{
                      backgroundColor: isActive ? `${color}20` : "rgba(0, 0, 0, 0.8)",
                      color: isActive ? color : "white",
                      border: `1px solid ${isActive ? color + "40" : "rgba(255, 255, 255, 0.2)"}`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">
                        {section === "home" && "🏠"}
                        {section === "about" && "👨‍💻"}
                        {section === "skills" && "⚡"}
                        {section === "projects" && "🚀"}
                        {section === "contact" && "📧"}
                      </span>
                      <span className="capitalize">{section}</span>
                    </div>
                  </div>

                  {/* Connection Line to Next Section */}
                  {index < sections.length - 1 && (
                    <div
                      className="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-4 transition-all duration-300"
                      style={{
                        background: `linear-gradient(to bottom, ${color}60, rgba(255, 255, 255, 0.1))`,
                        opacity: isActive ? 1 : 0.3,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 flex flex-col items-center space-y-2">
            <div className="w-px h-16 bg-white/10 rounded-full overflow-hidden">
              <div
                className="w-full bg-gradient-to-b from-emerald-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ height: `${scrollProgress}%` }}
              />
            </div>
            <div className="text-white/60 text-xs font-mono">{Math.round(scrollProgress)}%</div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-24 right-8 z-40 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 ${
          scrollProgress > 20 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        data-magnetic="true"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  )
}
