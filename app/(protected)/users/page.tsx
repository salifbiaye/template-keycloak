import { RiUserSettingsLine, RiUserAddLine, RiUserLine } from "@remixicon/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  // Breadcrumbs personnalisés pour cette page
  const breadcrumbs = [
    { title: "Dashboard", href: "/" },
    { title: "Gestion", href: "/users" },
    { title: "Utilisateurs" }
  ]

  return (
    <>
      {/* Header avec breadcrumbs */}
      <PageHeader
        title="Utilisateurs"
        moduleCode="1"
        breadcrumbs={breadcrumbs}
      />

      <div className="p-6 space-y-6">
        {/* Actions rapides */}
        <div className="flex gap-3">
          <Button className="flex items-center gap-2">
            <RiUserAddLine className="w-4 h-4" />
            Nouvel utilisateur
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RiUserLine className="w-4 h-4" />
            Importer
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
              <RiUserLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +10% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actifs</CardTitle>
              <RiUserSettingsLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">
                69% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
              <RiUserAddLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Cette semaine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Card>
          <CardHeader>
            <CardTitle>Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Gérez les utilisateurs et leurs permissions dans le système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <RiUserSettingsLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Fonctionnalité de gestion des utilisateurs</p>
              <p className="text-sm">Cette page sera développée prochainement</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}