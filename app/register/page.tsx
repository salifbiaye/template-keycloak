"use client"

import { useState } from "react"
import { RiUserAddLine, RiEyeLine, RiEyeOffLine, RiShieldCheckLine, RiArrowLeftLine, RiMailLine, RiLockLine, RiUserLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique d'inscription ici
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Theme Toggle - Position absolue */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/10">
        <Card className="w-full max-w-lg shadow-2xl border-border/60 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-6">
            {/* Logo/Icon avec gradient - Plus compact */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <RiUserAddLine className="w-8 h-8 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <RiShieldCheckLine className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>

            {/* Title et Badge sur la même ligne */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Créer un compte
                </CardTitle>
                <Badge variant="outline" className="px-2 py-1 text-xs bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30">
                  <RiShieldCheckLine className="w-3 h-3 mr-1" />
                  Sécurisé
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Rejoignez notre plateforme et gérez vos modules efficacement
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-foreground/80">
                    Prénom *
                  </Label>
                  <div className="relative group">
                    <RiUserLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Jean"
                      className="pl-12 h-12 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-foreground/80">
                    Nom *
                  </Label>
                  <div className="relative group">
                    <RiUserLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Dupont"
                      className="pl-12 h-12 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground/80">
                  Adresse email *
                </Label>
                <div className="relative group">
                  <RiMailLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean.dupont@example.com"
                    className="pl-12 h-12 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground/80">
                  Mot de passe *
                </Label>
                <div className="relative group">
                  <RiLockLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Créez un mot de passe sécurisé"
                    className="pl-12 pr-12 h-12 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <RiEyeOffLine className="w-4 h-4" />
                    ) : (
                      <RiEyeLine className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères avec lettres et chiffres
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">
                  Confirmer le mot de passe *
                </Label>
                <div className="relative group">
                  <RiLockLine className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Répétez votre mot de passe"
                    className="pl-12 pr-12 h-12 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-background/50"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine className="w-4 h-4" />
                    ) : (
                      <RiEyeLine className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <RiUserAddLine className="w-5 h-5 mr-2" />
                  Créer mon compte
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">Ou</span>
              </div>
            </div>

            {/* Links */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Se connecter →
                </Link>
              </p>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RiArrowLeftLine className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Background/Decoration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-primary/8 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/3 rounded-full blur-md"></div>
        </div>

        <div className="text-center space-y-6 max-w-md relative z-10">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <RiShieldCheckLine className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Bienvenue dans notre écosystème
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gérez vos modules, fonctionnalités et permissions avec une interface moderne et intuitive.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs bg-background/50 border-border/50">Sécurisé</Badge>
            <Badge variant="outline" className="text-xs bg-background/50 border-border/50">Moderne</Badge>
            <Badge variant="outline" className="text-xs bg-background/50 border-border/50">Intuitif</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}