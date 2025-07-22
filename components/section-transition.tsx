"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface SectionTransitionProps {
  children: React.ReactNode
  id: string
  className?: string
}

export default function SectionTransition({ children, id, className = "" }: SectionTransitionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section is entering viewport
            entry.target.classList.add("section-in-view", "section-enter")
            entry.target.classList.remove("section-out-of-view", "section-exit")

            // Add staggered animation to child elements
            const children = entry.target.querySelectorAll(".animate-on-scroll")
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("animate-fade-in-up")
              }, index * 100)
            })
          } else {
            // Section is leaving viewport
            entry.target.classList.add("section-out-of-view", "section-exit")
            entry.target.classList.remove("section-in-view", "section-enter")
          }
        })
      },
      {
        threshold: [0.1, 0.3, 0.7],
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} id={id} className={`section-transition ${className}`}>
      {children}
    </section>
  )
}
