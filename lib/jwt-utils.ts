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