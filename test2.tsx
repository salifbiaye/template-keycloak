"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Settings,
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"

const transactionData = [
  { month: "Jan", amount: 4000 },
  { month: "Fév", amount: 3000 },
  { month: "Mar", amount: 5000 },
  { month: "Avr", amount: 4500 },
  { month: "Mai", amount: 6000 },
  { month: "Jun", amount: 5500 },
]

const clientGrowthData = [
  { month: "Jan", clients: 1200 },
  { month: "Fév", clients: 1350 },
  { month: "Mar", clients: 1500 },
  { month: "Avr", clients: 1680 },
  { month: "Mai", clients: 1850 },
  { month: "Jun", clients: 2000 },
]

const recentClients = [
  {
    id: 1,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    balance: "€45,230",
    status: "active",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 2,
    name: "Jean Martin",
    email: "jean.martin@email.com",
    balance: "€12,450",
    status: "pending",
    avatar: "/thoughtful-man.png",
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "sophie.laurent@email.com",
    balance: "€78,900",
    status: "active",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 4,
    name: "Pierre Moreau",
    email: "pierre.moreau@email.com",
    balance: "€23,100",
    status: "suspended",
    avatar: "/thoughtful-man.png",
  },
  {
    id: 5,
    name: "Claire Rousseau",
    email: "claire.rousseau@email.com",
    balance: "€56,780",
    status: "active",
    avatar: "/diverse-woman-portrait.png",
  },
]

export function BankDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">BankAdmin Pro</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" className="text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Clients
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Comptes
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Transactions
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Rapports
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/admin-interface.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-sidebar-border bg-sidebar p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-medium text-sidebar-foreground">Vue d'ensemble</h3>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  Clients
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Comptes
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-sidebar-foreground">Gestion</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
                  <Building2 className="mr-2 h-4 w-4" />
                  Agences
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Hero Banner */}
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="mb-2 text-sm font-medium opacity-90">GESTION BANCAIRE</div>
                <h2 className="mb-4 text-3xl font-bold leading-tight">
                  Gérez vos Clients et Comptes
                  <br />
                  avec Excellence Bancaire
                </h2>
                <p className="mb-6 text-blue-100 opacity-90">
                  Accédez à tous les outils de gestion administrative pour optimiser vos opérations bancaires
                </p>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                  <Users className="mr-2 h-4 w-4" />
                  Voir tous les clients
                </Button>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-white/80" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-900">2K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground">Tableau de Bord</h3>
            <p className="text-muted-foreground">Vue d'ensemble des métriques clés</p>
          </div>

          {/* Metrics Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total des Dépôts</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">€2,847,392</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  +12.5% par rapport au mois dernier
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Nouveaux Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">+127</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  +8.2% par rapport au mois dernier
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Comptes Actifs</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">2,847</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  +4.1% par rapport au mois dernier
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Transactions Mensuelles</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">18,492</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  -2.1% par rapport au mois dernier
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Volume des Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="amount" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Croissance des Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line type="monotone" dataKey="clients" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Clients Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground">Clients Récents</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    Rechercher
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={client.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-card-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-card-foreground">{client.balance}</p>
                        <Badge
                          variant={
                            client.status === "active"
                              ? "default"
                              : client.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {client.status === "active"
                            ? "Actif"
                            : client.status === "pending"
                              ? "En attente"
                              : "Suspendu"}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
