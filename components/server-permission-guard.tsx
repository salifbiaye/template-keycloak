import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUserInfo, getUserRoles } from '@/lib/jwt-utils'

interface ServerPermissionGuardProps {
  /**
   * Rôles requis pour accéder au contenu
   */
  requiredRoles?: string[]

  /**
   * Rôle spécifique requis
   */
  requiredRole?: string

  /**
   * Page de redirection si pas autorisé (défaut: /unauthorized)
   */
  redirectTo?: string

  /**
   * Contenu à afficher si autorisé
   */
  children: React.ReactNode
}

export async function ServerPermissionGuard({
  requiredRoles = [],
  requiredRole,
  redirectTo = '/unauthorized',
  children
}: ServerPermissionGuardProps) {
  // Récupérer le token depuis les cookies
  const cookieStore = await cookies()
  const token = cookieStore.get('keycloak-token')?.value

  if (!token) {
    redirect('/?error=no_token')
  }

  // Extraire les infos utilisateur du token
  let userInfo
  let userRoles: string[] = []

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    userInfo = payload

    // Extraire les rôles du client
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
    userRoles = payload.resource_access?.[clientId || '']?.roles || []
  } catch (error) {
    redirect('/?error=invalid_token')
  }

  // Construire la liste des rôles requis
  const rolesToCheck = requiredRole ? [requiredRole] : requiredRoles

  // Vérifier si l'utilisateur a au moins un des rôles requis
  const hasRequiredRole = rolesToCheck.length === 0 ||
    userRoles.some(role => rolesToCheck.includes(role))

  if (!hasRequiredRole) {
    redirect(redirectTo)
  }

  // Si autorisé, afficher le contenu
  return <>{children}</>
}

// Fonction utilitaire pour vérifier les permissions côté serveur
export function checkServerPermissions(
  token: string | undefined,
  requiredRoles: string[] = []
): { authorized: boolean; userRoles: string[] } {
  if (!token) {
    return { authorized: false, userRoles: [] }
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
    const userRoles = payload.resource_access?.[clientId || '']?.roles || []

    const authorized = requiredRoles.length === 0 ||
      userRoles.some(role => requiredRoles.includes(role))

    return { authorized, userRoles }
  } catch (error) {
    return { authorized: false, userRoles: [] }
  }
}