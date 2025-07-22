"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import CustomCursor from "@/components/custom-cursor"
import LoadingScreen from "@/components/loading-screen"
import ScrollProgress from "@/components/scroll-progress"
import {
  Github,
  Facebook,
  Mail,
  ExternalLink,
  Download,
  Menu,
  X,
  ArrowRight,
  Code,
  Palette,
  ChevronDown,
  Star,
  Zap,
  Globe,
  Award,
  Coffee,
  Heart,
  Eye,
  MousePointer,
  Sparkles,
  Server,
  Home,
  User,
  Layers,
  Folder,
} from "lucide-react"

// Optimized Particle component with better performance
const Particles = () => {
  const particlesRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const particleCount = useRef(0)
  const maxParticles = 15

  useEffect(() => {
    // Only run on desktop and if user prefers motion
    if (
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return
    }

    const createParticle = () => {
      if (!particlesRef.current || particleCount.current >= maxParticles) return

      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 20 + "s"
      particle.style.animationDuration = Math.random() * 15 + 15 + "s"

      particlesRef.current.appendChild(particle)
      particleCount.current++

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
          particleCount.current--
        }
      }, 20000)
    }

    intervalRef.current = setInterval(createParticle, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return <div ref={particlesRef} className="particles" />
}

// Optimized Typing animation with better performance
const TypingAnimation = ({ texts, className = "" }: { texts: string[]; className?: string }) => {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const animate = () => {
      const current = texts[currentIndex]

      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1))
      } else {
        setCurrentText(current.substring(0, currentText.length + 1))
      }

      let timeout = isDeleting ? 30 : 80

      if (!isDeleting && currentText === current) {
        timeout = 2000
        setTimeout(() => setIsDeleting(true), timeout)
        return
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setCurrentIndex((currentIndex + 1) % texts.length)
        timeout = 500
      }

      timeoutRef.current = setTimeout(animate, timeout)
    }

    timeoutRef.current = setTimeout(animate, 100)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentText, currentIndex, isDeleting, texts])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse text-emerald-400">|</span>
    </span>
  )
}

// Optimized Intersection Observer Hook
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})
  const observersRef = useRef<Map<string, IntersectionObserver>>(new Map())

  const observeElement = useCallback(
    (element: Element, id: string) => {
      if (observersRef.current.has(id)) {
        observersRef.current.get(id)?.disconnect()
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible((prev) => ({ ...prev, [id]: entry.isIntersecting }))
        },
        {
          threshold,
          rootMargin: "50px",
        },
      )

      observer.observe(element)
      observersRef.current.set(id, observer)

      return () => {
        observer.disconnect()
        observersRef.current.delete(id)
      }
    },
    [threshold],
  )

  useEffect(() => {
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect())
      observersRef.current.clear()
    }
  }, [])

  return { isVisible, observeElement }
}

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { isVisible, observeElement } = useIntersectionObserver()
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  // Auto-hide nav state
  const [navVisible, setNavVisible] = useState(true)
  const navTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const skills = useMemo(
    () => [
      { name: "React", level: 95, icon: "⚛️", color: "from-cyan-400 to-blue-500" },
      { name: "TypeScript", level: 92, icon: "📘", color: "from-blue-500 to-indigo-600" },
      { name: "Next.js", level: 90, icon: "▲", color: "from-gray-600 to-gray-800" },
      { name: "Node.js", level: 88, icon: "🟢", color: "from-green-400 to-emerald-600" },
      { name: "Python", level: 85, icon: "🐍", color: "from-yellow-400 to-orange-500" },
      { name: "UI/UX Design", level: 87, icon: "🎨", color: "from-pink-400 to-purple-600" },
    ],
    [],
  )

  const projects = useMemo(
    () => [
      {
        title: "TalkBloom App",
        description:
          "A modern communication platform built with TypeScript, featuring user authentication, and responsive design. Focused on creating seamless learning expereanc.",
        image: "/p1.PNG",
        technologies: ["TypeScript", "React", "Node.js", "Tailwind CSS", "neon", "Git"],
        github: "https://github.com/aeubs66/talkbloomApp",
        live: "https://talkbloom.vercel.app/",
        featured: true,
      },
      {
        title: "CodeCraft",
        description:
          "A comprehensive collection of coding projects and experiments showcasing various programming concepts, algorithms, and development practices. Built with modern TypeScript for type safety and maintainability.",
        image: "/p2.PNG",
        technologies: ["TypeScript", "Tailwind CSS", "React", "Next.js", "Git"],
        github: "https://github.com/aeubs66/code",
        live: "https://code-dusky-kappa.vercel.app/",
        featured: true,
      },
    ],
    [],
  )

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const sections = ["home", "about", "skills", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          const rect = element.getBoundingClientRect()

          // Add transition classes based on scroll position
          if (rect.top <= window.innerHeight * 0.8 && rect.bottom >= window.innerHeight * 0.2) {
            element.classList.add("section-in-view")
            element.classList.remove("section-out-of-view")
          } else {
            element.classList.add("section-out-of-view")
            element.classList.remove("section-in-view")
          }

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            // Add active section class for enhanced styling
            element.classList.add("section-active")
          } else {
            element.classList.remove("section-active")
          }
        }
      }
    }, 10)
  }, [])

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Add smooth transition class before scrolling
      document.body.classList.add("smooth-scrolling")

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })

      // Remove transition class after scroll completes
      setTimeout(() => {
        document.body.classList.remove("smooth-scrolling")
      }, 1000)
    }
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    // Don't set up scroll listeners until loading is complete
    if (isLoading) return

    // Observe sections for animations
    const sections = ["home", "about", "skills", "projects", "contact"]
    const cleanupFunctions: (() => void)[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section)
      if (element) {
        const cleanup = observeElement(element, section)
        cleanupFunctions.push(cleanup)
      }
    })

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cleanupFunctions.forEach((cleanup) => cleanup())
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [observeElement, handleScroll, isLoading])

  // Auto-hide nav on inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setNavVisible(true)
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
      navTimeoutRef.current = setTimeout(() => setNavVisible(false), 2000)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current)
    }
  }, [])

  // Section nav items for left nav
  const leftNavItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Layers },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "contact", label: "Contact", icon: Mail },
  ]

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-x-hidden">
      {/* Left-side nav and progress handled by ScrollProgress component, but top bar removed */}

      {/* Custom cursor */}
      <CustomCursor />

      {/* Particles */}
      <Particles />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full glass-effect z-40 border-b border-white/5 transition-opacity duration-500 ${navVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ml-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold gradient-text-primary font-mono" data-magnetic="true">
              Ayoub.dev
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {["home", "about", "skills", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  data-magnetic="true"
                  className={`capitalize transition-all duration-300 relative group font-medium ${
                    activeSection === section ? "text-emerald-400 text-glow" : "text-gray-300 hover:text-emerald-400"
                  }`}
                >
                  {section}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 transform origin-left transition-transform duration-300 ${
                      activeSection === section ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg glass-effect hover:neon-glow transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-magnetic="true"
            >
              {isMenuOpen ? <X className="animate-spin" /> : <Menu className="animate-pulse" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect border-t border-white/5 animate-fade-in-up">
            <div className="px-4 py-2 space-y-2 ml-8">
              {["home", "about", "skills", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left py-3 capitalize text-gray-300 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Container - Pushed to the right */}
      <div className="ml-4 md:ml-20 lg:ml-24 xl:ml-32">
        {/* Hero Section */}
        <section id="home" className="mt-10 min-h-screen flex items-center justify-center pt-16 py-24 relative section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className={`transition-all duration-1000 ${isVisible.home ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="mb-8 relative">
                <div className="w-40 h-40 mx-auto mb-8 relative gpu-accelerated" data-magnetic="true">
                  <img
                    src="/img1.jpg"
                    alt="Ayoub Salih Profile"
                    className="w-full h-full rounded-full border-4 border-emerald-400/20 shadow-2xl animate-float relative z-10 will-change-transform"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 animate-spin-slow opacity-20 blur-xl will-change-transform" />
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 animate-pulse-slow opacity-30 blur-2xl will-change-opacity" />
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text-primary will-change-transform tracking-tight">
                Ayoub Salih
              </h1>

              <div className="text-2xl md:text-4xl mb-8 h-16 font-semibold">
                <TypingAnimation
                  texts={["Full-Stack Developer", "UI/UX Designer", "Tech Innovator", "Problem Solver"]}
                  className="gradient-text-secondary"
                />
              </div>

              <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-shadow-glow">
                Crafting digital experiences that blend cutting-edge technology with intuitive design. Passionate about
                creating solutions that make a real impact in the digital world.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transform hover:scale-110 transition-all duration-300 neon-glow group px-8 py-4 text-lg font-semibold will-change-transform"
                  onClick={() => scrollToSection("projects")}
                  data-magnetic="true"
                >
                  <Sparkles className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="flex justify-center space-x-8 -mb-10">
                {[
                  {
                    icon: Github,
                    href: "https://github.com/aeubs66",
                    label: "GitHub",
                    color: "hover:text-emerald-400",
                  },
                  { icon: Facebook, href: "https://facebook.com/Ayoub.1337", label: "Facebook", color: "hover:text-blue-600" },
                  { icon: Mail, href: "mailto:aeubs66@gmail.com", label: "Email", color: "hover:text-purple-400" },
                ].map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 glass-effect rounded-full hover:neon-glow transform hover:scale-125 transition-all duration-300 group will-change-transform ${color}`}
                    aria-label={label}
                    data-magnetic="true"
                  >
                    <Icon className="h-6 w-6 text-gray-300 group-hover:text-current transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce mt-10">
              <ChevronDown className="h-8 w-8 text-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Enhanced background decorations */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse-slow will-change-opacity" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow will-change-opacity" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-float will-change-transform" />
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-gradient-to-b from-gray-900 to-black relative section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-primary tracking-tight">About Me</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium text-shadow-glow">
                Passionate developer with experience of creating digital solutions that matter
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
              <div
                className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible.about ? "animate-fade-in-left" : "opacity-0 -translate-x-10"}`}
              >
                <p className="text-lg text-gray-300 leading-relaxed font-medium">
                  I'm a passionate full-stack developer with a keen eye for design and a love for creating seamless user
                  experiences. With experience in web development, I specialize in React, Node.js, and
                  modern web technologies.
                </p>
              </div>

              <div
                className={`relative perspective-1000 transition-all duration-1000 delay-400 ${isVisible.about ? "animate-fade-in-right" : "opacity-0 translate-x-10"}`}
              >
                <div
                  className="transform-style-3d rotate-y-12 hover:rotate-y-0 transition-transform duration-500 will-change-transform"
                  data-magnetic="true"
                >
                  <img
                    src="/img3.HEIC"
                    alt="About Ayoub Salih"
                    className="rounded-2xl shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-2xl text-white neon-glow">
                    <Code className="h-10 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 bg-gradient-to-b from-black to-gray-900 relative section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${isVisible.skills ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-primary tracking-tight">
                Skills & Technologies
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium text-shadow-glow">
                Cutting-edge technologies and tools I use to bring ideas to life
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {skills.map((skill, index) => (
                <Card
                  key={skill.name}
                  data-cursor="card"
                  data-magnetic="true"
                  className={`group glass-effect hover:neon-glow transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 will-change-transform ${isVisible.skills ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <span className="text-3xl mr-4 animate-wiggle group-hover:animate-bounce">{skill.icon}</span>
                      <h3 className="text-xl font-semibold text-white font-mono">{skill.name}</h3>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 mb-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${skill.color} h-3 rounded-full transition-all duration-2000 ease-out transform origin-left will-change-transform`}
                        style={{
                          width: isVisible.skills ? `${skill.level}%` : "0%",
                          transitionDelay: `${index * 200}ms`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 font-mono font-semibold">{skill.level}%</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(skill.level / 20) ? "text-yellow-400 fill-current" : "text-gray-600"} transition-colors duration-300`}
                            style={{ transitionDelay: `${index * 200 + i * 100}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Code,
                  title: "Frontend Development",
                  desc: "React, Vue, Angular, TypeScript",
                  color: "from-cyan-400 to-blue-500",
                  iconColor: "text-cyan-400",
                },
                {
                  icon: Server,
                  title: "Backend Development",
                  desc: "Node.js, Python, PostgreSQL, MongoDB",
                  color: "from-emerald-400 to-green-600",
                  iconColor: "text-emerald-400",
                },
                {
                  icon: Palette,
                  title: "UI/UX Design",
                  desc: "Figma, Adobe XD, Sketch, Framer",
                  color: "from-pink-400 to-purple-600",
                  iconColor: "text-pink-400",
                },
              ].map(({ icon: Icon, title, desc, color, iconColor }, index) => (
                <Card
                  key={title}
                  data-cursor="card"
                  data-magnetic="true"
                  className={`text-center p-8 glass-effect hover:neon-glow transition-all duration-500 transform hover:-translate-y-4 group will-change-transform ${isVisible.skills ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
                  style={{ animationDelay: `${skills.length * 100 + index * 200}ms` }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${color} p-4 group-hover:animate-pulse`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white font-mono">{title}</h3>
                  <p className="text-gray-300 font-medium">{desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-gradient-to-b from-gray-900 to-black relative section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${isVisible.projects ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-primary tracking-tight">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium text-shadow-glow">
                Showcasing innovative solutions that push the boundaries of technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Card
                  key={project.title}
                  data-cursor="project"
                  data-magnetic="true"
                  className={`group overflow-hidden glass-effect hover:neon-glow transition-all duration-500 transform hover:-translate-y-4 will-change-transform ${project.featured ? "md:col-span-2 lg:col-span-1" : ""} ${isVisible.projects ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 will-change-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 will-change-opacity" />

                    {/* Action buttons */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 will-change-opacity">
                      <Button size="sm" className="glass-effect hover:neon-glow" asChild data-magnetic="true">
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" className="glass-effect hover:neon-glow" asChild data-magnetic="true">
                        <a href={project.live} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white animate-pulse font-semibold">
                          <Zap className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors font-semibold">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 font-medium">{project.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs glass-effect hover:neon-glow transition-all duration-300 hover:scale-110 will-change-transform font-mono"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div
              className={`text-center mt-16 transition-all duration-1000 delay-500 ${isVisible.projects ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
            >
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-gradient-to-b from-black to-gray-900 relative section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`text-center mb-16 transition-all duration-1000 ${isVisible.contact ? "animate-fade-in-up" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-primary tracking-tight">Get In Touch</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium text-shadow-glow">
                Ready to bring your ideas to life? Let's create something amazing together
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              <div
                className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible.contact ? "animate-fade-in-left" : "opacity-0 -translate-x-10"}`}
              >
                <div>
                  <h3 className="text-3xl font-semibold mb-6 text-white gradient-text-secondary">
                    Let's work together
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed font-medium">
                    I'm currently available for freelance work and full-time opportunities. If you have a project in
                    mind or just want to chat about technology, feel free to reach out!
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      label: "aeubs66@gmail.com",
                      href: "mailto:aeubs66@gmail.com",
                      color: "text-emerald-400",
                    },
                    {
                      icon: Github,
                      label: "github.com/aeubs66",
                      href: "https://github.com/aeubs66",
                      color: "text-blue-400",
                    },
                    {
                      icon: Facebook,
                      label: "facebook.com/Ayoub.1337",
                      href: "https://facebook.com/Ayoub.1337",
                      color: "text-blue-600",
                    },
                  ].map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="contact"
                      data-magnetic="true"
                      className="flex items-center space-x-4 p-4 glass-effect rounded-xl hover:neon-glow transition-all duration-300 transform hover:scale-105 group will-change-transform"
                    >
                      <Icon className={`h-6 w-6 ${color} group-hover:animate-bounce`} />
                      <span className="text-gray-300 group-hover:text-white transition-colors font-medium font-mono">
                        {label}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <Card
                className={`p-8 glass-effect hover:neon-glow transition-all duration-1000 delay-400 ${isVisible.contact ? "animate-fade-in-right" : "opacity-0 translate-x-10"}`}
                data-magnetic="true"
              >
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white font-mono">Name</label>
                      <Input
                        placeholder="Your name"
                        className="glass-effect border-white/20 focus:border-emerald-400 focus:neon-glow transition-all duration-300 font-medium"
                        data-magnetic="true"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white font-mono">Email</label>
                      <Input
                        type="email"
                        placeholder="aeubs66@gmail.com"
                        className="glass-effect border-white/20 focus:border-emerald-400 focus:neon-glow transition-all duration-300 font-medium"
                        data-magnetic="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white font-mono">Subject</label>
                    <Input
                      placeholder="Project inquiry"
                      className="glass-effect border-white/20 focus:border-emerald-400 focus:neon-glow transition-all duration-300 font-medium"
                      data-magnetic="true"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white font-mono">Message</label>
                    <Textarea
                      placeholder="Tell me about your project..."
                      className="min-h-[120px] glass-effect border-white/20 focus:border-emerald-400 focus:neon-glow transition-all duration-300 font-medium"
                      data-magnetic="true"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 neon-glow group py-4 text-lg font-semibold will-change-transform"
                    data-magnetic="true"
                  >
                    <MousePointer className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Send Message
                    <Sparkles className="ml-2 h-5 w-5 group-hover:animate-wiggle" />
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/5 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-2xl font-bold gradient-text-primary font-mono" data-magnetic="true">
                  Ayoub Salih
                </div>
              </div>
              <p className="text-gray-400 mb-6 font-medium">
                © 2025 Ayoub Salih. Crafted with ❤️ using Next.js and Tailwind CSS.
              </p>
              <div className="flex justify-center space-x-6">
                {[
                  { icon: Github, color: "hover:text-emerald-400" },
                  { icon: Facebook, color: "hover:text-blue-600" },
                  { icon: Mail, color: "hover:text-purple-400" },
                ].map(({ icon: Icon, color }, index) => (
                  <a
                    key={index}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="true"
                    className={`p-3 glass-effect rounded-full hover:neon-glow transform hover:scale-125 transition-all duration-300 group will-change-transform ${color}`}
                  >
                    <Icon className="h-5 w-5 text-gray-400 group-hover:text-current transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
