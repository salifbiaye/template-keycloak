"use client"

import { RiRocketLine, RiTimeLine, RiArrowLeftLine, RiExternalLinkLine } from "@remixicon/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"

export default function ComingSoonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intendedUrl = searchParams.get('intended')

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <RiRocketLine className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <RiTimeLine className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">
              Bientôt disponible
            </h1>
            <p className="text-muted-foreground text-sm">
              Cette fonctionnalité est en cours de développement et sera bientôt accessible.
            </p>

            {/* Show intended URL if available */}
            {intendedUrl && (
              <div className="flex items-center justify-center gap-2">
                <RiExternalLinkLine className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs font-mono">
                  {intendedUrl}
                </Badge>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              En développement
            </div>
            <div className="text-xs text-muted-foreground/70">
              Nous travaillons dur pour vous apporter cette fonctionnalité
            </div>
          </div>

          {/* Action */}
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            <RiArrowLeftLine className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}