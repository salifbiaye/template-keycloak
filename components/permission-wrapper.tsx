'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUserInfo, getUserRoles } from '@/lib/jwt-utils'

interface PermissionWrapperProps {
  /**
   * Rôles requis pour afficher le composant
   */
  requiredRoles?: string[]

  /**
   * Rôle spécifique requis
   */
  requiredRole?: string

  /**
   * Contenu à afficher si autorisé
   */
  children: React.ReactNode

  /**
   * Contenu de fallback si pas autorisé (par défaut: rien)
   */
  fallback?: React.ReactNode

  /**
   * Rediriger vers une page si pas autorisé (optionnel)
   */
  redirectTo?: string

  /**
   * Afficher un message d'erreur
   */
  showError?: boolean
}

export function PermissionWrapper({
  requiredRoles = [],
  requiredRole,
  children,
  fallback = null,
  redirectTo,
  showError = false
}: PermissionWrapperProps) {
  const router = useRouter()

  // Récupérer les infos utilisateur
  const userInfo = getUserInfo()
  const userRoles = userInfo ? getUserRoles(userInfo) : []

  // Construire la liste des rôles requis
  const rolesToCheck = requiredRole ? [requiredRole] : requiredRoles

  // Vérifier si l'utilisateur a au moins un des rôles requis
  const hasRequiredRole = rolesToCheck.length === 0 ||
    userRoles.some(role => rolesToCheck.includes(role))

  // Redirection si demandée
  useEffect(() => {
    if (!hasRequiredRole && redirectTo) {
      router.push(redirectTo)
    }
  }, [hasRequiredRole, redirectTo, router])

  // Si pas autorisé
  if (!hasRequiredRole) {
    if (showError) {
      return (
        <div className="text-sm text-muted-foreground border border-dashed border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 rounded p-3">
          🔒 Accès restreint - Rôle requis: {rolesToCheck.join(' ou ')}
          <div className="text-xs mt-1">Vos rôles: {userRoles.join(', ')}</div>
        </div>
      )
    }
    return <>{fallback}</>
  }

  // Afficher le contenu si autorisé
  return <>{children}</>
}