import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Nouveau : Next.js 15 avec React 19</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Construisez l'avenir avec{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Next.js 15</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Découvrez la puissance de Next.js 15 avec Turbopack, React 19, et toutes les dernières fonctionnalités pour
            créer des applications web modernes et performantes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="group">
              Commencer maintenant
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Voir la documentation
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">⚡</div>
              <div className="text-sm text-muted-foreground mt-2">Turbopack intégré</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">🚀</div>
              <div className="text-sm text-muted-foreground mt-2">React 19 Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">🎯</div>
              <div className="text-sm text-muted-foreground mt-2">Performance optimisée</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
