import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Rocket, Shield, Code, Palette, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Turbopack Stable",
    description:
      "Bundler JavaScript de nouvelle génération, maintenant stable pour le développement avec des gains de vitesse significatifs.",
  },
  {
    icon: Rocket,
    title: "React 19 Support",
    description:
      "Support complet de React 19 avec App Router utilisant React Canary pour les dernières fonctionnalités.",
  },
  {
    icon: Shield,
    title: "Caching Amélioré",
    description:
      "Système de cache amélioré avec stale-while-revalidate (SWR) et staleTime: 0 par défaut pour des données fraîches.",
  },
  {
    icon: Code,
    title: "Nouveaux Hooks API",
    description: "useActionState (remplace useFormState) pour la gestion des formulaires et useFormStatus amélioré.",
  },
  {
    icon: Palette,
    title: "Debugging Amélioré",
    description:
      "Formatage orienté développeur, traces de pile focalisées et interfaces d'erreur interactives dans le navigateur.",
  },
  {
    icon: Globe,
    title: "Fonction after()",
    description:
      "Planifiez des tâches après qu'une réponse soit terminée, utile pour la journalisation et l'analytique.",
  },
]

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Fonctionnalités de Next.js 15
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Découvrez toutes les nouvelles fonctionnalités qui rendent Next.js 15 plus puissant et plus facile à
            utiliser que jamais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-accent/50"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
