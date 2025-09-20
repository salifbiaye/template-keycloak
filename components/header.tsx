"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">Next.js 15 Demo</h1>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#accueil" className="text-foreground hover:text-accent transition-colors">
              Accueil
            </a>
            <a href="#fonctionnalites" className="text-foreground hover:text-accent transition-colors">
              Fonctionnalités
            </a>
            <a href="#temoignages" className="text-foreground hover:text-accent transition-colors">
              Témoignages
            </a>
            <a href="#contact" className="text-foreground hover:text-accent transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />
            <Button variant="outline">Se connecter</Button>
            <Button>Commencer</Button>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Menu mobile ouvert */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="px-4 py-4 space-y-4">
              <a
                href="#accueil"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </a>
              <a
                href="#fonctionnalites"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#temoignages"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Témoignages
              </a>
              <a
                href="#contact"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Se connecter
                </Button>
                <Button className="flex-1">Commencer</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
