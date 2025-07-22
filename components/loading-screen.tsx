"use client"

import { useState, useEffect } from "react"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Simple progress animation
    const duration = 2000 // 2 seconds
    const interval = 50
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(timer)
          setIsComplete(true)

          // Complete loading after animation
          setTimeout(() => {
            onLoadingComplete()
          }, 500)

          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onLoadingComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-all duration-500 ${
        isComplete ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center">
        {/* Simple Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-spin-slow opacity-20" />
            <div className="relative w-full h-full bg-black rounded-full border-2 border-emerald-400/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-400 font-mono">A</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono">Ayoub.dev</h1>
        </div>

        {/* Simple Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 text-emerald-400 font-mono text-sm">{Math.round(progress)}%</div>
        </div>

        {/* Simple Loading Text */}
        <div className="mt-6 text-gray-400 text-sm">
          {progress < 30 && "Loading..."}
          {progress >= 30 && progress < 70 && "Preparing..."}
          {progress >= 70 && progress < 100 && "Almost ready..."}
          {progress >= 100 && "Welcome!"}
        </div>
      </div>
    </div>
  )
}
