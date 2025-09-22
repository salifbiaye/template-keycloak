'use client'

import React from 'react'
import { getTokenFromCookie, getUserInfo, getUserRoles } from '@/lib/jwt-utils'

// Types pour la navigation dynamique
export interface NavigationAction {
  code: string
  title: string
  description: string
}

export interface NavigationItem {
  title: string
  url: string
  icon: string
  description: string
  actions: NavigationAction[]
  fonctionnaliteCode: string
  moduleCode: string
}

export interface NavigationGroup {
  title: string
  url: string
  items: NavigationItem[]
}

export interface NavigationResponse {
  functionCode: string
  functionDescription: string
  navMain: NavigationGroup[]
}

// Configuration de l'API - utilise les API routes Next.js
const API_BASE_URL = '/api'

// Service pour récupérer la navigation dynamique
export class NavigationService {
  private static cache: Map<string, { data: NavigationResponse; timestamp: number }> = new Map()
  private static readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes - ajustable ici

  /**
   * Récupère la navigation pour un code fonction spécifique
   */
  static async getNavigationForFunction(codefonction: string): Promise<NavigationResponse | null> {
    try {
      // Vérifier le cache mémoire
      const cached = this.cache.get(codefonction)
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        console.log('📦 Navigation loaded from cache for:', codefonction, '(expires in', Math.round((this.CACHE_DURATION - (Date.now() - cached.timestamp)) / 1000), 'seconds)')
        return cached.data
      }

  

      console.log('🔄 Fetching navigation for function:', codefonction)
      console.log('📍 Full URL:', `${API_BASE_URL}/navigation/${codefonction}`)

      const response = await fetch(`${API_BASE_URL}/navigation/${codefonction}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (!response.ok) {
        console.error('Navigation fetch failed:', response.status, response.statusText)
        const errorText = await response.text().catch(() => 'Unable to read error')
        console.error('Error details:', errorText)
        return null
      }

      const navigationData: NavigationResponse = await response.json()

      // Mettre en cache mémoire
      this.cache.set(codefonction, {
        data: navigationData,
        timestamp: Date.now()
      })

      console.log('✅ Navigation loaded successfully for:', codefonction)
      return navigationData

    } catch (error) {
      console.error('Error fetching navigation:', error)

      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        console.error('🚫 Network Error: API server is not reachable at:', API_BASE_URL)
        console.error('💡 Check if your backend is running on:', API_BASE_URL)
        console.error('💡 Or update NEXT_PUBLIC_API_URL in .env.local')
      }

      return null
    }
  }

  /**
   * Récupère la navigation basée sur les rôles de l'utilisateur actuel
   */
  static async getNavigationForCurrentUser(): Promise<NavigationResponse | null> {
    const userInfo = getUserInfo()
    if (!userInfo) {
      console.error('No user info available')
      return null
    }

    const roles = getUserRoles(userInfo)
    if (!roles || roles.length === 0) {
      console.error('No roles found for user')
      return null
    }

    const primaryRole = roles[0]
    console.log('🎯 Getting navigation for primary role:', primaryRole)

    return this.getNavigationForFunction(primaryRole)
  }

  /**
   * Récupère la navigation en cache pour l'utilisateur actuel
   */
  static getCachedNavigation(): NavigationResponse | null {
    const userInfo = getUserInfo()
    if (!userInfo) return null

    const roles = getUserRoles(userInfo)
    if (!roles || roles.length === 0) return null

    const primaryRole = roles[0]
    const cached = this.cache.get(primaryRole)

    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data
    }

    return null
  }

  /**
   * Efface le cache de navigation
   */
  static clearCache(): void {
    this.cache.clear()
    console.log('🧹 Navigation cache cleared')
  }

  /**
   * Vérifie si l'utilisateur a accès à une action spécifique
   */
  static hasActionAccess(navigation: NavigationResponse, actionCode: string): boolean {
    for (const group of navigation.navMain) {
      for (const item of group.items) {
        if (item.actions.some(action => action.code === actionCode)) {
          return true
        }
      }
    }
    return false
  }

  /**
   * Récupère toutes les actions disponibles pour l'utilisateur
   */
  static getAllUserActions(navigation: NavigationResponse): NavigationAction[] {
    const actions: NavigationAction[] = []

    for (const group of navigation.navMain) {
      for (const item of group.items) {
        actions.push(...item.actions)
      }
    }

    return actions
  }
}

// Hook simple pour la navigation avec cache
export function useNavigation() {
  const [navigation, setNavigation] = React.useState<NavigationResponse | null>(
    NavigationService.getCachedNavigation() || null
  )
  const [loading, setLoading] = React.useState(!NavigationService.getCachedNavigation())

  React.useEffect(() => {
    if (!navigation) {
      NavigationService.getNavigationForCurrentUser().then(nav => {
        if (nav) {
          setNavigation(nav)
        }
        setLoading(false)
      })
    }
  }, [navigation])

  return {
    navigation,
    loading,
    hasActionAccess: (actionCode: string) =>
      navigation ? NavigationService.hasActionAccess(navigation, actionCode) : false,
    getAllActions: () =>
      navigation ? NavigationService.getAllUserActions(navigation) : []
  }
}

// Navigation de fallback - affichage immédiat
export const FALLBACK_NAVIGATION: NavigationResponse = {
  functionCode: 'ADMIN',
  functionDescription: 'Administrateur',
  navMain: [
    {
      title: 'Tableau de bord',
      url: '/dashboard',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'RiDashboardLine',
          description: 'Vue d\'ensemble du système',
          actions: [
            {
              code: 'dashboard.view',
              title: 'Voir le dashboard',
              description: 'Accès en lecture au tableau de bord'
            }
          ],
          fonctionnaliteCode: 'dashboard',
          moduleCode: 'core'
        }
      ]
    },
    {
      title: 'Gestion des utilisateurs',
      url: '/users',
      items: [
        {
          title: 'Utilisateurs',
          url: '/users',
          icon: 'RiUserLine',
          description: 'Gestion des utilisateurs',
          actions: [
            {
              code: 'user.view',
              title: 'Voir les utilisateurs',
              description: 'Accès en lecture aux utilisateurs'
            },
            {
              code: 'user.create',
              title: 'Créer utilisateur',
              description: 'Créer de nouveaux utilisateurs'
            }
          ],
          fonctionnaliteCode: 'user-management',
          moduleCode: 'users'
        }
      ]
    }
  ]
}