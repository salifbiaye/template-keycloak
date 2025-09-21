"use client"

import { useState } from "react"
import { RiArrowRightLine, RiShieldCheckLine, RiUserSettingsLine, RiDashboardLine, RiStarLine, RiMenuLine, RiCloseLine, RiSendPlaneLine, RiMailLine, RiFlashlightFill, RiCpuLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ThemeToggle from "@/components/theme-toggle"
import { Logo } from '@/components/logo'
import Link from "next/link"
import Image from "next/image"

const menuItems = [
  { name: 'Features', href: '#features' },
  { name: 'Solutions', href: '#solutions' },
  { name: 'Contact', href: '#contact' },
]

// Données des témoignages
const testimonials = [
  {
    name: 'Sarah Dupont',
    role: 'Directrice IT - Banque Centrale',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    quote: 'ModuleHub a transformé notre gestion des permissions bancaires. L\'interface intuitive et la sécurité avancée nous permettent de gérer efficacement nos 15 000 utilisateurs.',
  },
  {
    name: 'Marc Dubois',
    role: 'CTO - Crédit Mutuel',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    quote: 'L\'intégration avec nos systèmes existants s\'est faite sans aucun problème. Les APIs sont parfaitement documentées et le support technique est exceptionnel.',
  },
  {
    name: 'Claire Martin',
    role: 'Chef de Projet - BNP Paribas',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    quote: 'Grâce à ModuleHub, nous avons réduit de 70% le temps nécessaire pour déployer de nouveaux modules bancaires. Un vrai game-changer pour notre équipe.',
  },
  {
    name: 'Ahmed Ben Ali',
    role: 'Responsable Sécurité - Société Générale',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    quote: 'Les fonctionnalités de sécurité et d\'audit sont impressionnantes. Nous avons une visibilité complète sur tous les accès et permissions de notre plateforme.',
  },
  {
    name: 'Sophie Leroy',
    role: 'Architecte Solutions - HSBC',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    quote: 'ModuleHub nous a permis de standardiser notre architecture modulaire. La gestion granulaire des droits est exactement ce dont nous avions besoin.',
  },
  {
    name: 'Jean-Pierre Moreau',
    role: 'DSI - Banque Populaire',
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    quote: 'L\'interface d\'administration est très bien conçue. Même nos équipes non-techniques peuvent maintenant gérer les permissions facilement.',
  },
]

// Données du footer
const footerLinks = [
  {
    group: 'Produit',
    items: [
      { title: 'Features', href: '#features' },
      { title: 'Sécurité', href: '#' },
      { title: 'Intégrations', href: '#' },
      { title: 'API', href: '#' },
      { title: 'Documentation', href: '#' },
    ],
  },
  {
    group: 'Solutions',
    items: [
      { title: 'Banques', href: '#' },
      { title: 'Fintech', href: '#' },
      { title: 'Assurances', href: '#' },
      { title: 'Entreprises', href: '#' },
    ],
  },
  {
    group: 'Entreprise',
    items: [
      { title: 'À propos', href: '#' },
      { title: 'Carrières', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'Presse', href: '#' },
      { title: 'Contact', href: '#contact' },
    ],
  },
  {
    group: 'Légal',
    items: [
      { title: 'Confidentialité', href: '#' },
      { title: 'Conditions', href: '#' },
      { title: 'Cookies', href: '#' },
      { title: 'Sécurité', href: '#' },
    ],
  },
]

// Helper function pour diviser les témoignages en colonnes
const chunkArray = (array: typeof testimonials, chunkSize: number) => {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3))

// Fonctions pour l'authentification Keycloak avec PKCE
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64String = btoa(String.fromCharCode(...hashArray));
  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default function LandingPage() {
  const [menuState, setMenuState] = useState(false)

  const handleLogin = async () => {
    // Nettoyer uniquement les données d'authentification spécifiques
    localStorage.removeItem('keycloak-token');
    sessionStorage.removeItem('pkce_code_verifier');

    // Supprimer uniquement le cookie keycloak-token s'il existe
    document.cookie = 'keycloak-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirection directe vers Keycloak avec PKCE
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sib-app';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'oauth2-pkce';

    // Générer des paramètres PKCE corrects
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await sha256(codeVerifier);

    // Stocker le code verifier pour plus tard
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&` +
      `response_type=code&` +
      `scope=openid&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256&` +
      `prompt=login`;

    try {
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Redirect failed:', error);
    }
  };

  const features = [
    {
      icon: RiUserSettingsLine,
      title: "Gestion des utilisateurs",
      description: "Interface complète pour gérer les utilisateurs, leurs rôles et permissions avec un contrôle granulaire"
    },
    {
      icon: RiShieldCheckLine,
      title: "Sécurité avancée",
      description: "Système de permissions multiniveaux et contrôle d'accès basé sur les rôles (RBAC)"
    },
    {
      icon: RiDashboardLine,
      title: "Analytics intégrées",
      description: "Tableau de bord avec métriques en temps réel et rapports détaillés"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header avec navigation */}
      <header>
        <nav
          data-state={menuState && 'active'}
          className="fixed z-20 w-full border-b border-dashed bg-background/80 backdrop-blur-md"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <RiStarLine className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">ModuleHub</span>
                </Link>

                <button
                  onClick={() => setMenuState(!menuState)}
                  className="relative z-20 block cursor-pointer p-2 lg:hidden"
                >
                  <RiMenuLine className={`size-6 transition-all duration-200 ${menuState ? 'rotate-180 scale-0 opacity-0' : ''}`} />
                  <RiCloseLine className={`absolute inset-0 m-auto size-6 transition-all duration-200 ${menuState ? 'rotate-0 scale-100 opacity-100' : '-rotate-180 scale-0 opacity-0'}`} />
                </button>
              </div>

              <div className={`${menuState ? 'block' : 'hidden'} lg:flex w-full lg:w-fit items-center justify-end gap-6 bg-background rounded-3xl border p-6 shadow-2xl lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none`}>
                <ul className="space-y-6 lg:flex lg:gap-8 lg:space-y-0">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 lg:border-l lg:pl-6">
                  <ThemeToggle />
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/register">S'inscrire</Link>
                  </Button>
                  <Button size="sm" onClick={handleLogin}>
                    Se connecter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Effets de fond */}
        <div className="absolute inset-0 isolate hidden opacity-50 lg:block">
          <div className="absolute left-0 top-0 w-[560px] h-[1280px] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(var(--primary)/0.08)_0,hsla(var(--primary)/0.02)_50%,hsla(var(--primary)/0)_80%)]" />
          <div className="absolute left-0 top-0 w-60 h-[1280px] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(var(--primary)/0.06)_0,hsla(var(--primary)/0.02)_80%,transparent_100%)] translate-x-[5%] -translate-y-[50%]" />
        </div>

        {/* Hero Section - Style moderne avec animation */}
        <section className="overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 lg:pt-48">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="text-balance text-5xl font-medium md:text-6xl">
                Gestion bancaire moderne
                <span className="text-primary"> réinventée</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
                Plateforme complète de gestion des modules bancaires avec interface intuitive,
                sécurité avancée et contrôle granulaire des permissions pour votre établissement financier.
              </p>

              <div className="mt-12">
                <form className="mx-auto max-w-sm">
                  <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.5rem)] border pr-2 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                    <RiMailLine className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

                    <input
                      placeholder="Votre adresse email"
                      className="h-12 w-full bg-transparent pl-12 focus:outline-none"
                      type="email"
                    />

                    <div className="md:pr-1.5 lg:pr-0">
                      <Button
                        aria-label="submit"
                        size="sm"
                        className="rounded-[calc(var(--radius))]"
                      >
                        <span className="hidden md:block">Commencer</span>
                        <RiArrowRightLine
                          className="relative mx-auto size-5 md:hidden"
                          strokeWidth={2}
                        />
                      </Button>
                    </div>
                  </div>
                </form>

                <div
                  aria-hidden
                  className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-32 max-w-2xl to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                  </div>

                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                    <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <ModuleDashboard />
                      <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section des partenaires */}
        <section className="bg-muted/30 relative z-10 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-lg font-medium mb-12">Trusted by modern teams</h2>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold">NextJS</div>
              <div className="text-2xl font-bold">TypeScript</div>
              <div className="text-2xl font-bold">Tailwind</div>
              <div className="text-2xl font-bold">Prisma</div>
              <div className="text-2xl font-bold">PostgreSQL</div>
            </div>
          </div>
        </section>

        {/* Section de contenu avancée avec features */}
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
            <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
              L'écosystème ModuleHub révolutionne la gestion bancaire.
            </h2>

            <div className="relative">
              <div className="relative z-10 space-y-4 md:w-1/2">
                <p>
                  ModuleHub évolue pour être plus qu'un simple système de gestion.
                  <span className="font-medium"> Il supporte un écosystème complet</span> —
                  des modules aux API et plateformes aidant les institutions bancaires à innover.
                </p>
                <p className="text-muted-foreground">
                  Notre plateforme offre une architecture modulaire flexible qui s'adapte parfaitement
                  aux besoins spécifiques du secteur financier et bancaire.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RiFlashlightFill className="size-4 text-primary" />
                      <h3 className="text-sm font-medium">Ultra-rapide</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Déploiement instantané des modules avec des performances optimisées pour le secteur bancaire.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RiCpuLine className="size-4 text-primary" />
                      <h3 className="text-sm font-medium">Puissant</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Architecture robuste capable de gérer des millions de transactions et d'utilisateurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:mask-l-from-35% md:mask-l-to-55% mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
                <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
                  <div className="rounded-2xl bg-card p-8 shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Analytics Bancaires</h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          En temps réel
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">2.8M</div>
                          <div className="text-sm text-muted-foreground">Transactions/jour</div>
                        </div>
                        <div className="bg-green-500/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-500">99.99%</div>
                          <div className="text-sm text-muted-foreground">Uptime bancaire</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Sécurité</span>
                          <span className="text-muted-foreground">98%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Performance</span>
                          <span className="text-muted-foreground">96%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12 lg:grid-cols-5 lg:gap-24">
              <div className="lg:col-span-2">
                <div className="md:pr-6 lg:pr-0">
                  <h2 className="text-4xl font-semibold lg:text-5xl">
                    Conçu pour les équipes modernes
                  </h2>
                  <p className="mt-6 text-muted-foreground">
                    Une plateforme complète qui s'adapte à vos besoins de gestion avec des outils puissants et une interface intuitive.
                  </p>
                </div>
                <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-4">
                  <li>
                    <RiUserSettingsLine className="size-5 text-primary" />
                    Gestion complète des utilisateurs
                  </li>
                  <li>
                    <RiShieldCheckLine className="size-5 text-primary" />
                    Sécurité et permissions avancées
                  </li>
                  <li>
                    <RiDashboardLine className="size-5 text-primary" />
                    Analytics et monitoring
                  </li>
                  <li>
                    <RiStarLine className="size-5 text-primary" />
                    Support technique dédié
                  </li>
                </ul>
              </div>
              <div className="border-border/50 relative rounded-3xl border p-3 lg:col-span-3">
                <div className="aspect-[4/3] relative rounded-2xl bg-gradient-to-b from-muted/50 to-transparent p-px">
                  <div className="rounded-2xl bg-card border p-8 h-full">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">Module Analytics</h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          En temps réel
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-primary">142</div>
                          <div className="text-sm text-muted-foreground">Modules actifs</div>
                        </div>
                        <div className="bg-green-500/5 rounded-lg p-4">
                          <div className="text-2xl font-bold text-green-500">99.8%</div>
                          <div className="text-sm text-muted-foreground">Disponibilité</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Gestion Utilisateurs</span>
                          <span className="text-muted-foreground">85%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Permissions</span>
                          <span className="text-muted-foreground">92%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span>Analytics</span>
                          <span className="text-muted-foreground">78%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer votre gestion des modules ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'équipes qui font confiance à notre plateforme pour gérer leurs modules efficacement.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="px-8 py-3" onClick={handleLogin}>
                Se connecter avec Keycloak
                <RiArrowRightLine className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3" asChild>
                <Link href="#features">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section Témoignages */}
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4">
                Adopté par les leaders du secteur bancaire
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment les plus grandes institutions financières utilisent ModuleHub
                pour transformer leur gestion des permissions et modules.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonialChunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className="space-y-6">
                  {chunk.map(({ name, role, quote, image }, index) => (
                    <Card key={index} className="h-fit">
                      <CardContent className="grid grid-cols-[auto_1fr] gap-4 pt-6">
                        <Avatar className="size-12">
                          <AvatarImage
                            alt={name}
                            src={image}
                            loading="lazy"
                            width="48"
                            height="48"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold">{name}</h3>
                            <span className="text-muted-foreground text-sm tracking-wide">{role}</span>
                          </div>

                          <blockquote>
                            <p className="text-sm leading-relaxed">{quote}</p>
                          </blockquote>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
                Questions Fréquentes
              </h2>
              <p className="text-muted-foreground mt-4 text-balance">
                Découvrez des réponses rapides et complètes aux questions courantes sur notre plateforme,
                services et fonctionnalités.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-xl">
              <Accordion
                type="single"
                collapsible
                className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
              >
                <AccordionItem value="item-1" className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    Comment fonctionne la gestion des modules ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">
                      Notre système permet de créer, organiser et gérer vos modules bancaires avec une interface intuitive.
                      Vous pouvez définir des permissions granulaires, assigner des rôles et suivre l'utilisation en temps réel.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    Quels types de permissions puis-je configurer ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">
                      Vous pouvez créer des rôles personnalisés avec des permissions spécifiques pour chaque module,
                      fonctionnalité et action. Le système supporte les permissions en lecture, écriture, modification et suppression.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    La plateforme est-elle sécurisée pour le secteur bancaire ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">
                      Oui, notre plateforme respecte les normes de sécurité bancaire les plus strictes avec un chiffrement de bout en bout,
                      une authentification multi-facteurs et une surveillance continue des accès.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    Puis-je intégrer la plateforme avec mes systèmes existants ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">
                      Absolument. Notre API REST complète permet une intégration facile avec vos systèmes bancaires existants.
                      Nous fournissons également une documentation détaillée et un support technique dédié.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-dashed">
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    Quel est le support technique disponible ?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">
                      Nous offrons un support 24/7 pour les clients entreprise, avec des temps de réponse garantis.
                      Cela inclut l'assistance technique, la formation des équipes et l'aide à l'intégration.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <p className="text-muted-foreground mt-6 px-8">
                Vous ne trouvez pas ce que vous cherchez ? Contactez notre{' '}
                <Link
                  href="#contact"
                  className="text-primary font-medium hover:underline"
                >
                  équipe de support client
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 lg:px-0">
            <h1 className="mb-12 text-center text-4xl font-semibold lg:text-5xl">
              Nous contacter
            </h1>

            <div className="grid divide-y border rounded-xl md:grid-cols-2 md:gap-4 md:divide-x md:divide-y-0 bg-card">
              <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                <div>
                  <h2 className="mb-3 text-lg font-semibold">Support Commercial</h2>
                  <Link
                    href="mailto:sales@modulehub.com"
                    className="text-lg text-primary hover:underline"
                  >
                    sales@modulehub.com
                  </Link>
                  <p className="mt-3 text-sm text-muted-foreground">+33 1 XX XX XX XX</p>
                </div>
              </div>
              <div className="flex flex-col justify-between space-y-8 p-6 sm:p-12">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Support Technique</h3>
                  <Link
                    href="mailto:support@modulehub.com"
                    className="text-lg text-primary hover:underline"
                  >
                    support@modulehub.com
                  </Link>
                  <p className="mt-3 text-sm text-muted-foreground">+33 1 XX XX XX XX</p>
                </div>
              </div>
            </div>

            <div className="h-3 border-x bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)]"></div>

            <form className="border border-t-0 px-4 py-12 lg:px-0 lg:py-24 bg-card rounded-b-xl">
              <Card className="mx-auto max-w-lg p-8 sm:p-16 border-0 shadow-none">
                <h3 className="text-xl font-semibold">Parlons de votre projet</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  Contactez notre équipe commerciale ! Nous souhaitons en savoir plus sur votre utilisation prévue de notre plateforme.
                </p>

                <div className="mt-12 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input type="text" id="name" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input type="email" id="email" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="company">Entreprise</Label>
                    <Input type="text" id="company" required />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="country">Pays/Région</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="be">Belgique</SelectItem>
                        <SelectItem value="ch">Suisse</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="ma">Maroc</SelectItem>
                        <SelectItem value="sn">Sénégal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="website">Site web de l'entreprise</Label>
                    <Input type="url" id="website" />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="job">Fonction</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner votre fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">Directeur IT</SelectItem>
                        <SelectItem value="cto">CTO</SelectItem>
                        <SelectItem value="dev">Développeur</SelectItem>
                        <SelectItem value="pm">Chef de projet</SelectItem>
                        <SelectItem value="ceo">CEO/Dirigeant</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="msg">Message</Label>
                    <Textarea
                      id="msg"
                      rows={4}
                      placeholder="Décrivez votre projet et vos besoins..."
                    />
                  </div>

                  <Button className="w-full">
                    Envoyer le message
                    <RiSendPlaneLine className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/20 pt-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-5">
              <div className="md:col-span-2">
                <Link href="/" aria-label="go home" className="block size-fit">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <RiStarLine className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl">ModuleHub</span>
                  </div>
                </Link>
                <p className="mt-4 text-muted-foreground max-w-md">
                  La plateforme de référence pour la gestion des modules bancaires.
                  Sécurité, performance et simplicité réunies en une solution complète.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
                {footerLinks.map((link, index) => (
                  <div key={index} className="space-y-4 text-sm">
                    <span className="block font-semibold">{link.group}</span>
                    {link.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.href}
                        className="text-muted-foreground hover:text-primary block transition-colors duration-150"
                      >
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
              <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
                © {new Date().getFullYear()} ModuleHub. Tous droits réservés.
              </span>

              <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"
                    />
                  </svg>
                </Link>

                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
                    />
                  </svg>
                </Link>

                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>

    </div>
  )
}

// Composant Dashboard pour la hero section
const ModuleDashboard = () => {
  return (
    <div className="relative space-y-3 rounded-[1rem] bg-white/5 p-4">
      <div className="flex items-center gap-1.5 text-primary">
        <RiDashboardLine className="size-5" />
        <div className="text-sm font-medium">Modules Bancaires</div>
      </div>
      <div className="space-y-3">
        <div className="text-foreground border-b border-white/10 pb-3 text-sm font-medium">
          Cette année, votre plateforme affiche +24% d'activité vs 2023
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">2,847</span>
              <span className="text-muted-foreground text-xs">Modules/jour</span>
            </div>
            <div className="flex h-5 items-center rounded bg-gradient-to-l from-primary to-primary/60 px-2 text-xs text-white">
              2024
            </div>
          </div>
          <div className="space-y-1">
            <div className="space-x-1">
              <span className="text-foreground align-baseline text-xl font-medium">1,842</span>
              <span className="text-muted-foreground text-xs">Modules/jour</span>
            </div>
            <div className="text-foreground bg-muted flex h-5 w-2/3 items-center rounded px-2 text-xs dark:bg-white/20">
              2023
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}