'use client'

import React from 'react'
import { useNavigation } from '@/lib/navigation-service'

interface PermissionGuardProps {
  /**
   * Code de l'action requise pour afficher le contenu
   */
  requiredAction?: string

  /**
   * Liste d'actions, au moins une doit être présente
   */
  anyOfActions?: string[]

  /**
   * Liste d'actions, toutes doivent être présentes
   */
  allOfActions?: string[]

  /**
   * Code du module requis
   */
  requiredModule?: string

  /**
   * Code de la fonctionnalité requise
   */
  requiredFonctionnalite?: string

  /**
   * Contenu à afficher si l'utilisateur a les permissions
   */
  children: React.ReactNode

  /**
   * Contenu de fallback si pas de permissions
   */
  fallback?: React.ReactNode

  /**
   * Afficher un message d'erreur en cas de permissions insuffisantes
   */
  showError?: boolean
}

export function PermissionGuard({
  requiredAction,
  anyOfActions,
  allOfActions,
  requiredModule,
  requiredFonctionnalite,
  children,
  fallback = null,
  showError = false
}: PermissionGuardProps) {
  const { navigation, loading, hasActionAccess, getAllActions } = useNavigation()

  // Pendant le chargement, ne rien afficher ou afficher un loader
  if (loading) {
    return <div className="animate-pulse h-4 bg-muted rounded"></div>
  }

  // Si pas de navigation, pas d'accès
  if (!navigation) {
    return showError ? (
      <div className="text-sm text-muted-foreground">
        ❌ Navigation non disponible
      </div>
    ) : <>{fallback}</>
  }

  const allUserActions = getAllActions()

  // Vérifier les permissions
  let hasPermission = true

  // Vérification d'une action spécifique
  if (requiredAction) {
    hasPermission = hasPermission && hasActionAccess(requiredAction)
  }

  // Vérification d'au moins une des actions
  if (anyOfActions && anyOfActions.length > 0) {
    const hasAnyAction = anyOfActions.some(action => hasActionAccess(action))
    hasPermission = hasPermission && hasAnyAction
  }

  // Vérification de toutes les actions
  if (allOfActions && allOfActions.length > 0) {
    const hasAllActions = allOfActions.every(action => hasActionAccess(action))
    hasPermission = hasPermission && hasAllActions
  }

  // Vérification du module
  if (requiredModule) {
    const hasModuleAccess = navigation.navMain.some(group =>
      group.items.some(item => item.moduleCode === requiredModule)
    )
    hasPermission = hasPermission && hasModuleAccess
  }

  // Vérification de la fonctionnalité
  if (requiredFonctionnalite) {
    const hasFonctionnaliteAccess = navigation.navMain.some(group =>
      group.items.some(item => item.fonctionnaliteCode === requiredFonctionnalite)
    )
    hasPermission = hasPermission && hasFonctionnaliteAccess
  }

  // Si pas de permission, retourner le fallback
  if (!hasPermission) {
    if (showError) {
      return (
        <div className="text-sm text-muted-foreground border border-dashed border-muted-foreground/30 rounded p-2">
          🔒 Permissions insuffisantes
          {requiredAction && <div className="text-xs">Action requise: {requiredAction}</div>}
          {anyOfActions && <div className="text-xs">Actions possibles: {anyOfActions.join(', ')}</div>}
        </div>
      )
    }
    return <>{fallback}</>
  }

  // Afficher le contenu si permissions OK
  return <>{children}</>
}

// Fonctions utilitaires simples pour les permissions (pas de hook)
export function hasUserAction(actionCode: string): boolean {
  const cachedNav = NavigationService.getCachedNavigation()
  return cachedNav ? NavigationService.hasActionAccess(cachedNav, actionCode) : false
}

export function hasUserModule(moduleCode: string): boolean {
  const cachedNav = NavigationService.getCachedNavigation()
  return cachedNav?.navMain.some(group =>
    group.items.some(item => item.moduleCode === moduleCode)
  ) || false
}

export function getUserActions(): NavigationAction[] {
  const cachedNav = NavigationService.getCachedNavigation()
  return cachedNav ? NavigationService.getAllUserActions(cachedNav) : []
}

// Composant pour afficher debug des permissions
export function PermissionDebug() {
  const navigation = NavigationService.getCachedNavigation()

  if (!navigation) return null

  const allActions = getUserActions()

  return (
    <div className="border rounded p-4 bg-muted/50">
      <h3 className="font-semibold mb-2">🔍 Debug Permissions</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Fonction:</strong> {navigation.functionCode}
        </div>
        <div>
          <strong>Description:</strong> {navigation.functionDescription}
        </div>
        <div>
          <strong>Actions disponibles ({allActions.length}):</strong>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {allActions.map(action => (
              <div key={action.code} className="text-xs bg-primary/10 rounded px-2 py-1">
                {action.code}
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong>Modules:</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {navigation.navMain.map(group =>
              group.items.map(item => (
                <span key={item.moduleCode} className="text-xs bg-secondary rounded px-2 py-1">
                  {item.moduleCode}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}