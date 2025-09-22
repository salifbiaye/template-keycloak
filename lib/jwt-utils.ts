// Utility functions pour extraire et décoder les informations JWT

export interface UserInfo {
  name?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  roles?: string[]; // Rôles simplifiés extraits
}

export function decodeJWT(token: string): UserInfo | null {
  try {
    // Séparer le token en header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Décoder le payload (partie 2)
    const payload = parts[1];

    // Ajouter du padding si nécessaire pour base64
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);

    // Décoder en base64
    const decodedPayload = atob(paddedPayload);

    // Parser en JSON
    const userInfo: UserInfo = JSON.parse(decodedPayload);

    // Extraire uniquement les rôles du client oauth2-pkce
    const clientId = 'oauth2-pkce';
    const clientRoles: string[] = [];

    // Récupérer seulement les rôles du client oauth2-pkce
    if (userInfo.resource_access?.[clientId]?.roles) {
      clientRoles.push(...userInfo.resource_access[clientId].roles);
    }

    // Ajouter les rôles du client à l'objet userInfo
    userInfo.roles = [...new Set(clientRoles)]; // Supprimer les doublons

    return userInfo;
  } catch (error) {
    console.error('Erreur lors du décodage JWT:', error);
    return null;
  }
}

export function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'keycloak-token') {
      return value;
    }
  }
  return null;
}

export function getUserInfo(): UserInfo | null {
  const token = getTokenFromCookie();
  if (!token) return null;

  return decodeJWT(token);
}

export function isTokenExpired(userInfo: UserInfo): boolean {
  if (!userInfo.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= userInfo.exp;
}

export function getDisplayName(userInfo: UserInfo): string {
  if (userInfo.name) return userInfo.name;
  if (userInfo.given_name && userInfo.family_name) {
    return `${userInfo.given_name} ${userInfo.family_name}`;
  }
  if (userInfo.preferred_username) return userInfo.preferred_username;
  if (userInfo.email) return userInfo.email.split('@')[0];
  return 'Utilisateur';
}

export function getInitials(userInfo: UserInfo): string {
  const displayName = getDisplayName(userInfo);
  const words = displayName.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
}

// Fonctions utilitaires pour les rôles

// Vérifier si l'utilisateur a un rôle spécifique
export function hasRole(userInfo: UserInfo, role: string): boolean {
  return userInfo.roles?.includes(role) || false;
}

// Vérifier si l'utilisateur a au moins un des rôles spécifiés
export function hasAnyRole(userInfo: UserInfo, roles: string[]): boolean {
  return roles.some(role => hasRole(userInfo, role));
}

// Vérifier si l'utilisateur a tous les rôles spécifiés
export function hasAllRoles(userInfo: UserInfo, roles: string[]): boolean {
  return roles.every(role => hasRole(userInfo, role));
}

// Obtenir tous les rôles de l'utilisateur
export function getUserRoles(userInfo: UserInfo): string[] {
  return userInfo.roles || [];
}

// Obtenir les rôles du realm uniquement
export function getRealmRoles(userInfo: UserInfo): string[] {
  return userInfo.realm_access?.roles || [];
}

// Obtenir les rôles d'un client spécifique
export function getClientRoles(userInfo: UserInfo, clientId: string): string[] {
  return userInfo.resource_access?.[clientId]?.roles || [];
}

// Fonctions pour le refresh token
export function getRefreshTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'keycloak-refresh-token') {
      return value;
    }
  }
  return null;
}

// Vérifier si le token expire bientôt (dans les 5 prochaines minutes)
export function isTokenExpiringSoon(userInfo: UserInfo): boolean {
  if (!userInfo.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes en secondes

  return userInfo.exp <= fiveMinutesFromNow;
}

// Renouveler le token avec le refresh token
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshTokenFromCookie();
  if (!refreshToken) {
    console.log('No refresh token found');
    return false;
  }

  try {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sib-app';
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'oauth2-pkce';

    console.log('🔄 Attempting token refresh with:', { keycloakUrl, realm, clientId });

    const response = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Parser la réponse d'erreur pour plus d'info
      let errorDetails = '';
      try {
        const errorObj = JSON.parse(errorText);
        errorDetails = errorObj.error_description || errorObj.error || '';
      } catch {
        errorDetails = errorText;
      }

      console.log('🚫 Token refresh failed:', response.status, errorDetails);

      // Si le refresh token est invalide/expiré, nettoyer et rediriger
      if (response.status === 400) {
        console.log('🧹 Refresh token expired/invalid, clearing session...');
        document.cookie = 'keycloak-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'keycloak-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Redirection vers la page de login après un délai
        setTimeout(() => {
          console.log('🔄 Redirecting to login...');
          window.location.href = '/landing';
        }, 1000);
      }

      return false;
    }

    const tokenData = await response.json();

    // Mettre à jour les cookies avec les nouveaux tokens
    document.cookie = `keycloak-token=${tokenData.access_token}; path=/; samesite=lax; max-age=28800`;
    if (tokenData.refresh_token) {
      document.cookie = `keycloak-refresh-token=${tokenData.refresh_token}; path=/; samesite=lax; max-age=28800`;
    }

    console.log('✅ Token refreshed successfully');
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

// Fonction utilitaire pour maintenir la session active
export function startTokenRefreshTimer(): void {
  if (typeof window === 'undefined') return;

  // Éviter de démarrer plusieurs timers
  if ((window as any).__tokenRefreshTimer) {
    clearInterval((window as any).__tokenRefreshTimer);
  }

  // Vérifier toutes les 2 minutes si le token a besoin d'être renouvelé
  const interval = setInterval(async () => {
    const token = getTokenFromCookie();
    if (!token) {
      console.log('🛑 No token found, stopping refresh timer');
      clearInterval(interval);
      (window as any).__tokenRefreshTimer = null;
      return;
    }

    const userInfo = decodeJWT(token);
    if (!userInfo) {
      console.log('🛑 Invalid token, stopping refresh timer');
      clearInterval(interval);
      (window as any).__tokenRefreshTimer = null;
      return;
    }

    // Si le token expire bientôt, le renouveler
    if (isTokenExpiringSoon(userInfo)) {
      console.log('🔄 Token expiring soon, refreshing...');
      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        console.log('❌ Failed to refresh token, stopping timer');
        clearInterval(interval);
        (window as any).__tokenRefreshTimer = null;
        // La fonction refreshAccessToken() gère déjà la redirection
      }
    }
  }, 2 * 60 * 1000); // Vérifier toutes les 2 minutes

  // Stocker la référence du timer
  (window as any).__tokenRefreshTimer = interval;

  // Nettoyer l'interval quand l'utilisateur quitte la page
  window.addEventListener('beforeunload', () => {
    if ((window as any).__tokenRefreshTimer) {
      clearInterval((window as any).__tokenRefreshTimer);
      (window as any).__tokenRefreshTimer = null;
    }
  });
}