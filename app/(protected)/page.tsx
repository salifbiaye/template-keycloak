"use client"

import { RiDashboardLine, RiApps2Line, RiUserSettingsLine } from "@remixicon/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NAV_CONFIG } from "@/nav-config"

export default function HomePage() {
  const totalModules = NAV_CONFIG.navMain.reduce((acc, group) => acc + group.items.length, 0)
  const totalActions = NAV_CONFIG.navMain.reduce((acc, group) =>
    acc + group.items.reduce((itemAcc, item) => itemAcc + (item.actions?.length || 0), 0), 0
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue dans le système de gestion des modules
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="relative">
          {/* Puce ronde */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-background shadow-sm"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fonction</CardTitle>
            <RiUserSettingsLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{NAV_CONFIG.functionCode}</div>
            <p className="text-xs text-muted-foreground">
              {NAV_CONFIG.functionDescription}
            </p>
          </CardContent>
        </Card>

        <Card className="relative">
          {/* Puce ronde */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules</CardTitle>
            <RiApps2Line className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModules}</div>
            <p className="text-xs text-muted-foreground">
              Modules disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="relative">
          {/* Puce ronde */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-background shadow-sm"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
            <RiDashboardLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActions}</div>
            <p className="text-xs text-muted-foreground">
              Permissions autorisées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules Overview */}
      <Card className="relative">
        {/* Puce ronde */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-background shadow-sm"></div>
        <CardHeader>
          <CardTitle>Modules disponibles</CardTitle>
          <CardDescription>
            Liste des modules et fonctionnalités accessibles avec votre profil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {NAV_CONFIG.navMain.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="font-semibold text-lg capitalize">{group.title}</h3>
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {item.actions?.length || 0} actions
                      </Badge>
                      <Badge variant="secondary">
                        Module {item.moduleCode}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
