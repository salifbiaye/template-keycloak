"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    name: "Marie Dubois",
    role: "Développeuse Frontend",
    company: "TechCorp",
    content:
      "Next.js 15 avec Turbopack a révolutionné notre workflow de développement. Les temps de build sont incroyablement rapides !",
    rating: 5,
    avatar: "/professional-woman-portrait.png",
  },
  {
    name: "Pierre Martin",
    role: "Lead Developer",
    company: "StartupXYZ",
    content:
      "Le support de React 19 et les nouvelles fonctionnalités de caching ont considérablement amélioré les performances de notre application.",
    rating: 5,
    avatar: "/homme-professionnel-portrait.png",
  },
  {
    name: "Sophie Laurent",
    role: "CTO",
    company: "InnovateLab",
    content:
      "Les améliorations de debugging et la fonction after() nous ont fait gagner énormément de temps en développement et maintenance.",
    rating: 5,
    avatar: "/placeholder-qyptt.png",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="temoignages" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Ce que disent les développeurs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Découvrez pourquoi les équipes de développement du monde entier choisissent Next.js 15 pour leurs projets.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-lg sm:text-xl text-foreground mb-6 text-pretty leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} chez {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full bg-transparent">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-accent" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full bg-transparent">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
