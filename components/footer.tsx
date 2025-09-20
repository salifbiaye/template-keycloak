import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Next.js 15 Demo</h3>
            <p className="text-primary-foreground/80 mb-6 max-w-md text-pretty leading-relaxed">
              Un projet de démonstration showcasant les dernières fonctionnalités de Next.js 15 avec un design moderne
              et des performances optimisées.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#accueil" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#temoignages" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Témoignages
                </a>
              </li>
              <li>
                <a
                  href="https://nextjs.org/docs"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-foreground/80 text-sm mb-4">Restez informé des dernières nouveautés Next.js</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="sm">
                S'abonner
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">© 2025 Next.js 15 Demo. Créé avec ❤️ et Next.js 15.</p>
        </div>
      </div>
    </footer>
  )
}
