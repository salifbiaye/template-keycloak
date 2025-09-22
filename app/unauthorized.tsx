"use client"

import { RiShieldLine, RiHomeLine, RiArrowLeftLine, RiLockLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">401</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <RiLockLine className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Accès non autorisé
            </h1>
            <p className="text-muted-foreground text-sm">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>

          {/* Status */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
              <RiShieldLine className="w-4 h-4" />
              Permissions insuffisantes
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-500">
              Contactez votre administrateur pour obtenir l'accès
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                <RiHomeLine className="w-4 h-4 mr-2" />
                Retour au dashboard
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