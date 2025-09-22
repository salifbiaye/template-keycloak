'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/page-header';
import {
  RiUserLine,
  RiFolderLine,
  RiTeamLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiEyeLine,
  RiMore2Line,
  RiSearchLine,
  RiFilterLine,
  RiBankCardLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiDashboardLine
} from '@remixicon/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useNavigation, FALLBACK_NAVIGATION } from '@/lib/navigation-service';

const transactionData = [
  { month: 'Jan', clients: 1200, comptes: 850, utilisateurs: 45 },
  { month: 'Fév', clients: 1350, comptes: 920, utilisateurs: 52 },
  { month: 'Mar', clients: 1500, comptes: 1100, utilisateurs: 48 },
  { month: 'Avr', clients: 1680, comptes: 1250, utilisateurs: 56 },
  { month: 'Mai', clients: 1850, comptes: 1400, utilisateurs: 61 },
  { month: 'Jun', clients: 2000, comptes: 1580, utilisateurs: 67 }
];

const recentActivities = [
  {
    id: 1,
    type: 'client',
    title: 'Nouveau client enregistré',
    user: 'Marie Dubois',
    time: 'Il y a 5 min',
    status: 'success'
  },
  {
    id: 2,
    type: 'compte',
    title: 'Compte créé',
    user: 'Jean Martin',
    time: 'Il y a 12 min',
    status: 'info'
  },
  {
    id: 3,
    type: 'user',
    title: 'Utilisateur modifié',
    user: 'Sophie Laurent',
    time: 'Il y a 25 min',
    status: 'warning'
  }
];

export default function DashboardPage() {
  // Utiliser la navigation dynamique
  const { navigation, loading } = useNavigation();
  const navConfig = navigation || FALLBACK_NAVIGATION;

  // Générer les stats basées sur la navigation dynamique
  const moduleStats = navConfig.navMain.map((module, index) => ({
    name: module.title.replace('Gestion des ', '').replace('Gestion ', ''),
    value: [2847, 1284, 567][index] || 100,
    growth: [12.5, 8.2, -2.1][index] || 0,
    icon: module.items[0]?.icon || 'RiUserLine',
    color: ['#3b82f6', '#10b981', '#f59e0b'][index] || '#6b7280'
  }));

  // Breadcrumbs pour le dashboard
  const breadcrumbs = [
    { title: "Accueil", href: "/" },
    { title: "Dashboard" }
  ];

  if (loading) {
    return (
      <>
        {/* Header skeleton */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero section skeleton */}
          <div className="rounded-2xl bg-muted p-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="h-4 w-48 bg-muted-foreground/20 rounded"></div>
                <div className="h-8 w-64 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 w-96 bg-muted-foreground/20 rounded"></div>
                <div className="flex gap-3">
                  <div className="h-10 w-32 bg-muted-foreground/20 rounded"></div>
                  <div className="h-10 w-24 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
              <div className="hidden lg:block h-32 w-32 bg-muted-foreground/20 rounded-2xl"></div>
            </div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-16 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                <div className="h-6 w-32 bg-muted rounded mb-4"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header avec breadcrumbs */}
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de votre système bancaire"
        icon="RiDashboardLine"
        breadcrumbs={breadcrumbs}
      />

      <div className="p-6 space-y-6">
      {/* Hero Section - Style sombre professionnel comme landing page */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 text-sm font-medium text-slate-300">
              TABLEAU DE BORD ADMINISTRATEUR
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight">
              Vue d'ensemble de votre
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Système Bancaire
              </span>
            </h1>
            <p className="mb-6 text-slate-300 opacity-90">
              Gérez efficacement vos clients, comptes et utilisateurs depuis cette interface centralisée
            </p>
            <div className="flex items-center space-x-4">
              <Button className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                <RiEyeLine className="mr-2 h-4 w-4" />
                Voir rapport détaillé
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                <RiShieldCheckLine className="mr-2 h-4 w-4" />
                Sécurité
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="h-32 w-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <RiBankCardLine className="h-16 w-16 text-white/80" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-900">
                  {moduleStats.reduce((acc, stat) => acc + stat.value, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales basées sur nav-config */}
      <div className="grid gap-4 md:grid-cols-3">
        {moduleStats.map((stat, index) => {
          const IconComponent = require('@remixicon/react')[stat.icon] || RiUserLine;
          return (
            <Card key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500/15 to-purple-500/15 dark:from-blue-600/10 dark:to-purple-600/10">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  {stat.name}
                </CardTitle>
                <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-blue-200 dark:border-blue-700/50">
                  <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                {/* Effet holographique */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-400/20 to-transparent rounded-bl-3xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-2xl" />
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                  {stat.value.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.growth >= 0 ? (
                    <RiArrowUpLine className="mr-1 h-3 w-3 text-emerald-500" />
                  ) : (
                    <RiArrowDownLine className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  {Math.abs(stat.growth)}% ce mois
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Graphique d'évolution */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Évolution des Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Clients"
                />
                <Line
                  type="monotone"
                  dataKey="comptes"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Comptes"
                />
                <Line
                  type="monotone"
                  dataKey="utilisateurs"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Utilisateurs"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par module */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Répartition par Module</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleStats}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Activités Récentes</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-border/50">
                <RiSearchLine className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
              <Button variant="outline" size="sm" className="border-border/50">
                <RiFilterLine className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-border/50 p-4 bg-background/50"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-card-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      par {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      activity.status === 'success'
                        ? 'default'
                        : activity.status === 'warning'
                        ? 'secondary'
                        : 'outline'
                    }
                    className="capitalize"
                  >
                    {activity.type}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <RiMore2Line className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        {navConfig.navMain.map((module, index) => {
          const IconComponent = require('@remixicon/react')[module.items[0]?.icon] || RiUserLine;
          return (
            <Card key={index} className="bg-card hover:bg-card/80 transition-colors border">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base text-card-foreground">
                    {module.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {module.items[0]?.description}
                </p>
                <Button className="w-full" variant="outline">
                  Gérer {module.items[0]?.title?.toLowerCase()}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </div>
    </>
  );
}