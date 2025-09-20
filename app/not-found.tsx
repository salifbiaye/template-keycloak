"use client"

import { RiSearchLine, RiHomeLine, RiArrowLeftLine, RiErrorWarningLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-destructive">404</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                <RiErrorWarningLine className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Page introuvable
            </h1>
            <p className="text-muted-foreground text-sm">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          {/* Status */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RiSearchLine className="w-4 h-4" />
              Erreur 404
            </div>
            <div className="text-xs text-muted-foreground/70">
              Vérifiez l'URL ou retournez à l'accueil
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/" className="w-full">
              <Button className="w-full">
                <RiHomeLine className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>

            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <RiArrowLeftLine className="w-4 h-4 mr-2" />
              Page précédente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}