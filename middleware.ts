import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuration simple : les rôles requis pour accéder aux routes protégées
const REQUIRED_ROLES = ['ADMIN', 'MANAGER','CUSTOMER']; // Ajoutez d'autres rôles selon vos besoins
const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
// Fonction pour extraire les rôles du client oauth2-pkce depuis le token
function extractClientRoles(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.resource_access?.[clientId || '']?.roles || [];
  } catch (error) {
    return [];
  }
}


// URLs toujours autorisées (système)
const SYSTEM_ALLOWED_URLS = [
  '/coming-soon',
  '/not-found',
  '/_next',
  '/api',
  '/favicon.ico',
  '/images',
  '/icons',
  '/auth',
  '/silent-check-sso.html'
]

// Routes publiques (pas besoin d'authentification)
const PUBLIC_ROUTES = ['/auth/callback', '/', '/landing', '/register', '/login', '/logout', '/debug'];

// Fonction pour détecter si une route est protégée
// Toute route qui n'est pas explicitement publique est considérée comme protégée
function isProtectedRoute(pathname: string): boolean {
  // Routes système toujours publiques
  if (SYSTEM_ALLOWED_URLS.some(url => pathname.startsWith(url))) {
    return false;
  }

  // Routes explicitement publiques
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return false;
  }

  // Fichiers statiques
  if (pathname.includes('.')) {
    return false;
  }

  // Tout le reste est protégé (correspond au dossier (protected))
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Toujours autoriser les routes d'authentification
  if (pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }

  // Vérifier si la route est protégée
  if (isProtectedRoute(pathname)) {
    const token = request.cookies.get('keycloak-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Vérifier si le token est encore valide
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp < now) {
        // Token expiré - essayer le refresh token avant de déconnecter
        const refreshToken = request.cookies.get('keycloak-refresh-token')?.value;

        if (refreshToken) {
          console.log('Token expired, attempting refresh...');
          // Laisser passer pour que le client-side puisse refresh
          // Le refresh automatique se chargera du renouvellement
          return NextResponse.next();
        } else {
          console.log('No refresh token, redirecting to login');
          const response = NextResponse.redirect(new URL('/?error=token_expired', request.url));
          response.cookies.delete('keycloak-token');
          response.cookies.delete('keycloak-refresh-token');
          return response;
        }
      }

      // Vérifier les rôles requis (l'utilisateur doit avoir au moins un des rôles requis)
      const userRoles = extractClientRoles(token);
      const hasRequiredRole = userRoles.some(role => REQUIRED_ROLES.includes(role));

      if (!hasRequiredRole) {
        console.log('Insufficient permissions, user roles:', userRoles, 'required:', REQUIRED_ROLES);
        return NextResponse.redirect(new URL('/?error=insufficient_permissions', request.url));
      }

    } catch (error) {
      console.error('Token validation error:', error);
      const response = NextResponse.redirect(new URL('/?error=invalid_token', request.url));
      response.cookies.delete('keycloak-token');
      return response;
    }
  }

  // Autoriser la route racine
  if (pathname === '/') {
    return NextResponse.next()
  }

  // Autoriser les URLs système
  if (SYSTEM_ALLOWED_URLS.some(url => pathname.startsWith(url))) {
    return NextResponse.next()
  }

  // Autoriser les fichiers statiques
  if (pathname.includes('.')) {
    return NextResponse.next()
  }

  // Laisser Next.js gérer les routes naturellement (404 automatique)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fichiers avec extension
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}