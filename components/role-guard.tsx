'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/use-auth';

interface RoleGuardProps {
  /** Rôle requis pour afficher le contenu */
  role?: string;
  /** Liste de rôles, l'utilisateur doit avoir au moins un de ces rôles */
  anyRole?: string[];
  /** Liste de rôles, l'utilisateur doit avoir tous ces rôles */
  allRoles?: string[];
  /** Contenu à afficher si l'utilisateur a les permissions */
  children: ReactNode;
  /** Contenu à afficher si l'utilisateur n'a pas les permissions */
  fallback?: ReactNode;
}

export default function RoleGuard({
  role,
  anyRole,
  allRoles,
  children,
  fallback = null
}: RoleGuardProps) {
  const { isAuthenticated, hasRole, hasAnyRole, user } = useAuth();

  // Si pas authentifié, ne rien afficher
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Vérification rôle spécifique
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Vérification au moins un rôle
  if (anyRole && !hasAnyRole(anyRole)) {
    return <>{fallback}</>;
  }

  // Vérification tous les rôles
  if (allRoles && !allRoles.every(r => hasRole(r))) {
    return <>{fallback}</>;
  }

  // L'utilisateur a les permissions requises
  return <>{children}</>;
}