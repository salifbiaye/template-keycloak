# 🔐 Documentation Keycloak - Configuration complète

Cette documentation détaille la configuration complète de l'authentification Keycloak avec PKCE dans une application Next.js.

## 📋 Table des matières

1. [Configuration Keycloak](#1-configuration-keycloak)
2. [Structure des fichiers](#2-structure-des-fichiers)
3. [Configuration environnement](#3-configuration-environnement)
4. [Composants d'authentification](#4-composants-dauthentification)
5. [Middleware de protection](#5-middleware-de-protection)
6. [Utilities JWT](#6-utilities-jwt)
7. [Flux d'authentification](#7-flux-dauthentification)
8. [Accès aux données utilisateur](#8-accès-aux-données-utilisateur)
9. [Gestion des rôles](#9-gestion-des-rôles)
10. [Débogage](#10-débogage)

---

## 1. Configuration Keycloak

### 1.1 Prérequis

- Keycloak en cours d'exécution sur `http://keycloak:8080`
- Mapping DNS : `127.0.0.1 keycloak` dans `/etc/hosts` (Linux/Mac) ou `C:\Windows\System32\drivers\etc\hosts` (Windows)

### 1.2 Configuration du Realm

1. **Créer un realm** : `sib-app`
2. **Créer un client** avec les paramètres suivants :

```
Client ID: oauth2-pkce
Client Type: Public
Standard Flow Enabled: ON
Direct Access Grants Enabled: OFF
Implicit Flow Enabled: OFF
Service Accounts Enabled: OFF

Valid Redirect URIs:
- http://localhost:3000/auth/callback
- http://localhost:3000/*

Web Origins:
- http://localhost:3000
- +

PKCE Code Challenge Method: S256
```

### 1.3 Utilisateurs

Créer des utilisateurs de test avec :
- Email vérifié
- Nom et prénom
- Mot de passe défini

---

## 2. Structure des fichiers

```
template/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx          # Gestion du callback OAuth
│   ├── landing/
│   │   └── page.tsx              # Page d'accueil avec login
│   ├── logout/
│   │   └── page.tsx              # Page de déconnexion
│   ├── debug/
│   │   └── page.tsx              # Page de debug Keycloak
│   └── (protected)/
│       └── layout.tsx            # Layout pour routes protégées
├── components/
│   ├── page-header.tsx           # Header avec user dropdown
│   ├── pro-sidebar.tsx           # Sidebar avec navigation
│   ├── simple-logout-button.tsx  # Bouton de déconnexion
│   ├── user-dropdown.tsx         # Dropdown utilisateur
│   └── role-guard.tsx            # Protection par rôles
├── lib/
│   ├── auth-simple.ts            # Fonctions d'authentification
│   ├── jwt-utils.ts              # Utilities pour JWT
│   └── use-auth.ts               # Hook React pour authentification
├── middleware.ts                 # Protection des routes
└── .env.local                    # Variables d'environnement
```

---

## 3. Configuration environnement

### `.env.local`

```env
# Configuration Keycloak
NEXT_PUBLIC_KEYCLOAK_URL=http://keycloak:8080
NEXT_PUBLIC_KEYCLOAK_REALM=sib-app
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=oauth2-pkce
```

---

## 4. Composants d'authentification

### 4.1 Bouton de connexion (Landing Page)

**Fichier** : `app/landing/page.tsx`

```typescript
// Fonctions PKCE
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64String = btoa(String.fromCharCode(...hashArray));
  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Fonction de connexion
const handleLogin = async () => {
  // Nettoyer le stockage
  localStorage.clear();
  sessionStorage.clear();

  // Paramètres Keycloak
  const keycloakUrl = 'http://keycloak:8080';
  const realm = 'sib-app';
  const clientId = 'oauth2-pkce';

  // Générer PKCE
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await sha256(codeVerifier);

  // Stocker le verifier
  sessionStorage.setItem('pkce_code_verifier', codeVerifier);

  // URL de connexion
  const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&` +
    `response_type=code&` +
    `scope=openid&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256&` +
    `prompt=login`;

  window.location.href = loginUrl;
};
```

### 4.2 Gestion du callback

**Fichier** : `app/auth/callback/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      // Gestion des erreurs
      if (error) {
        console.error('Authentication error:', error);
        router.push('/?error=' + error);
        return;
      }

      if (!code) {
        console.error('No authorization code found');
        router.push('/?error=no_code');
        return;
      }

      try {
        // Récupérer le code verifier
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
        if (!codeVerifier) {
          router.push('/?error=no_verifier');
          return;
        }

        // Paramètres pour l'échange de token
        const tokenParams = {
          grant_type: 'authorization_code',
          client_id: 'oauth2-pkce',
          code: code,
          redirect_uri: window.location.origin + '/auth/callback',
          code_verifier: codeVerifier,
        };

        // Échanger le code contre un token
        const tokenResponse = await fetch('http://keycloak:8080/realms/sib-app/protocol/openid-connect/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(tokenParams),
        });

        if (!tokenResponse.ok) {
          throw new Error(`Token exchange failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();

        // Stocker le token dans un cookie
        document.cookie = `keycloak-token=${tokenData.access_token}; path=/; secure; samesite=lax`;

        // Nettoyer et rediriger
        sessionStorage.removeItem('pkce_code_verifier');
        router.push('/dashboard');

      } catch (error) {
        console.error('Token exchange error:', error);
        router.push('/?error=token_exchange');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Finalisation de la connexion...</p>
      </div>
    </div>
  );
}
```

### 4.3 Fonction de déconnexion

**Fichier** : `lib/auth-simple.ts`

```typescript
// Fonctions côté CLIENT uniquement
export function logout() {
  const keycloakUrl = 'http://keycloak:8080';
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sib-app';

  // Nettoyer les cookies et storage
  if (typeof window !== 'undefined') {
    document.cookie = 'keycloak-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.clear();
    sessionStorage.clear();

    // Redirection directe vers landing page
    window.location.href = window.location.origin + '/landing';
  }
}
```

### 4.4 Bouton de déconnexion

**Fichier** : `components/simple-logout-button.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { RiLogoutBoxLine } from '@remixicon/react';
import { logout } from '@/lib/auth-simple';

export default function SimpleLogoutButton() {
  return (
    <Button
      onClick={logout}
      variant="outline"
      size="sm"
      className="w-full justify-start"
    >
      <RiLogoutBoxLine className="w-4 h-4 mr-2" />
      Se déconnecter
    </Button>
  );
}
```

---

## 5. Middleware de protection

**Fichier** : `middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques (pas besoin d'authentification)
const PUBLIC_ROUTES = ['/auth/callback', '/', '/landing', '/register', '/login', '/logout', '/debug'];

// URLs système toujours autorisées
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
];

// Fonction pour détecter si une route est protégée
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

  // Tout le reste est protégé
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
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('keycloak-token');
        return response;
      }

    } catch (error) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('keycloak-token');
      return response;
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
```

---

## 6. Utilities JWT

**Fichier** : `lib/jwt-utils.ts`

```typescript
// Interface pour les informations utilisateur
export interface UserInfo {
  name?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  sub?: string;
  exp?: number;
  iat?: number;
}

// Décoder le token JWT
export function decodeJWT(token: string): UserInfo | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload);
    const userInfo: UserInfo = JSON.parse(decodedPayload);

    return userInfo;
  } catch (error) {
    console.error('Erreur lors du décodage JWT:', error);
    return null;
  }
}

// Récupérer le token depuis les cookies
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

// Récupérer les informations utilisateur
export function getUserInfo(): UserInfo | null {
  const token = getTokenFromCookie();
  if (!token) return null;

  return decodeJWT(token);
}

// Vérifier si le token est expiré
export function isTokenExpired(userInfo: UserInfo): boolean {
  if (!userInfo.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= userInfo.exp;
}

// Obtenir le nom d'affichage
export function getDisplayName(userInfo: UserInfo): string {
  if (userInfo.name) return userInfo.name;
  if (userInfo.given_name && userInfo.family_name) {
    return `${userInfo.given_name} ${userInfo.family_name}`;
  }
  if (userInfo.preferred_username) return userInfo.preferred_username;
  if (userInfo.email) return userInfo.email.split('@')[0];
  return 'Utilisateur';
}

// Obtenir les initiales
export function getInitials(userInfo: UserInfo): string {
  const displayName = getDisplayName(userInfo);
  const words = displayName.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return displayName.substring(0, 2).toUpperCase();
}
```

---

## 7. Flux d'authentification

### 7.1 Processus de connexion

1. **Utilisateur clique sur "Se connecter"** dans la landing page
2. **Génération PKCE** :
   - Code verifier aléatoire
   - Code challenge (SHA256 du verifier)
3. **Redirection vers Keycloak** avec paramètres OAuth + PKCE
4. **Authentification utilisateur** sur Keycloak
5. **Callback vers `/auth/callback`** avec code d'autorisation
6. **Échange code → token** avec le code verifier
7. **Stockage du token** dans un cookie
8. **Redirection vers `/dashboard`**

### 7.2 Processus de déconnexion

1. **Utilisateur clique sur "Se déconnecter"**
2. **Nettoyage local** : cookies, localStorage, sessionStorage
3. **Redirection vers `/landing`**

### 7.3 Protection des routes

1. **Middleware intercepte** toutes les requêtes
2. **Vérification route publique** : autoriser si publique
3. **Vérification token** :
   - Présence du cookie `keycloak-token`
   - Validité du JWT (expiration)
4. **Redirection si nécessaire** vers landing page

---

## 8. Accès aux données utilisateur

### 8.1 Dans un composant React

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getUserInfo, UserInfo } from '@/lib/jwt-utils';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  if (!userInfo) {
    return <div>Non connecté</div>;
  }

  return (
    <div>
      <h2>Profil utilisateur</h2>
      <p>Nom : {userInfo.name}</p>
      <p>Email : {userInfo.email}</p>
      <p>Username : {userInfo.preferred_username}</p>
    </div>
  );
}
```

### 8.2 Vérification d'authentification

```typescript
import { getUserInfo, isTokenExpired } from '@/lib/jwt-utils';

export function useAuth() {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return { isAuthenticated: false, user: null };
  }

  if (isTokenExpired(userInfo)) {
    return { isAuthenticated: false, user: null };
  }

  return { isAuthenticated: true, user: userInfo };
}
```

### 8.3 Données disponibles dans le token

Le token JWT Keycloak contient typiquement :

```json
{
  "exp": 1703123456,           // Expiration timestamp
  "iat": 1703120456,           // Émission timestamp
  "jti": "uuid-token-id",      // ID unique du token
  "iss": "http://keycloak:8080/realms/sib-app",  // Émetteur
  "aud": "oauth2-pkce",        // Audience
  "sub": "user-uuid",          // Subject (ID utilisateur)
  "typ": "Bearer",             // Type de token
  "azp": "oauth2-pkce",        // Authorized party
  "session_state": "uuid",     // État de session
  "scope": "openid",           // Scopes accordés
  "email_verified": true,      // Email vérifié
  "name": "John Doe",          // Nom complet
  "preferred_username": "john.doe",  // Username
  "given_name": "John",        // Prénom
  "family_name": "Doe",        // Nom de famille
  "email": "john.doe@example.com",    // Email
  "realm_access": {            // Rôles du realm
    "roles": ["admin", "user"]
  },
  "resource_access": {         // Rôles des clients
    "oauth2-pkce": {
      "roles": ["manager"]
    }
  }
}
```

---

## 9. Gestion des rôles

### 9.1 Configuration des rôles dans Keycloak

#### Rôles du Realm
1. Dans Keycloak Admin → Realm Settings → Roles
2. Créer des rôles : `admin`, `user`, `manager`, etc.
3. Assigner les rôles aux utilisateurs

#### Rôles des Clients
1. Dans Keycloak Admin → Clients → oauth2-pkce → Roles
2. Créer des rôles spécifiques au client
3. Assigner via User Role Mappings

### 9.2 Accès aux rôles dans le code

#### Hook useAuth avec support des rôles

**Fichier** : `lib/use-auth.ts`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getUserInfo, isTokenExpired, UserInfo, hasRole, hasAnyRole, isAdmin } from '@/lib/jwt-utils';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  roles: string[];
}

export function useAuth(): UseAuthReturn {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const info = getUserInfo();

        if (!info || isTokenExpired(info)) {
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        setUserInfo(info);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000); // Vérification toutes les minutes

    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = userInfo !== null && !isTokenExpired(userInfo);

  return {
    isAuthenticated,
    isLoading,
    user: userInfo,
    hasRole: (role: string) => userInfo ? hasRole(userInfo, role) : false,
    hasAnyRole: (roles: string[]) => userInfo ? hasAnyRole(userInfo, roles) : false,
    isAdmin: () => userInfo ? isAdmin(userInfo) : false,
    roles: userInfo?.roles || [],
  };
}
```

#### Composant de protection par rôles

**Fichier** : `components/role-guard.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/use-auth';

interface RoleGuardProps {
  role?: string;           // Rôle requis
  anyRole?: string[];      // Au moins un de ces rôles
  allRoles?: string[];     // Tous ces rôles requis
  adminOnly?: boolean;     // Admins uniquement
  children: ReactNode;     // Contenu à protéger
  fallback?: ReactNode;    // Contenu si pas autorisé
}

export default function RoleGuard({
  role,
  anyRole,
  allRoles,
  adminOnly,
  children,
  fallback = null
}: RoleGuardProps) {
  const { isAuthenticated, hasRole, hasAnyRole, isAdmin, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  if (adminOnly && !isAdmin()) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  if (anyRole && !hasAnyRole(anyRole)) {
    return <>{fallback}</>;
  }

  if (allRoles && !allRoles.every(r => hasRole(r))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### 9.3 Exemples d'utilisation

#### Vérifier les rôles dans un composant

```typescript
'use client';

import { useAuth } from '@/lib/use-auth';
import RoleGuard from '@/components/role-guard';

export default function AdminPanel() {
  const { user, isAdmin, hasRole, roles } = useAuth();

  return (
    <div>
      <h1>Tableau de bord</h1>

      {/* Afficher les rôles de l'utilisateur */}
      <div>
        <h2>Vos rôles : {roles.join(', ')}</h2>
      </div>

      {/* Section admin uniquement */}
      <RoleGuard adminOnly>
        <div className="bg-red-100 p-4 rounded">
          <h2>🔴 Section Administrateur</h2>
          <p>Seuls les admins peuvent voir ceci.</p>
        </div>
      </RoleGuard>

      {/* Section pour managers */}
      <RoleGuard role="manager" fallback={<p>Accès refusé : rôle manager requis</p>}>
        <div className="bg-blue-100 p-4 rounded">
          <h2>🔵 Section Manager</h2>
          <p>Contenu pour les managers.</p>
        </div>
      </RoleGuard>

      {/* Section pour plusieurs rôles possibles */}
      <RoleGuard anyRole={['admin', 'moderator', 'manager']}>
        <div className="bg-green-100 p-4 rounded">
          <h2>🟢 Section Équipe</h2>
          <p>Pour admins, modérateurs ou managers.</p>
        </div>
      </RoleGuard>

      {/* Vérification conditionnelle */}
      {isAdmin() && (
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Bouton Admin
        </button>
      )}

      {hasRole('manager') && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Bouton Manager
        </button>
      )}
    </div>
  );
}
```

#### Fonctions utilitaires disponibles

```typescript
import { getUserInfo, hasRole, hasAnyRole, isAdmin, getUserRoles } from '@/lib/jwt-utils';

// Dans un composant ou une fonction
const userInfo = getUserInfo();

if (userInfo) {
  // Vérifier un rôle spécifique
  const canManage = hasRole(userInfo, 'manager');

  // Vérifier plusieurs rôles (au moins un)
  const canModerate = hasAnyRole(userInfo, ['admin', 'moderator']);

  // Vérifier si admin
  const isUserAdmin = isAdmin(userInfo);

  // Obtenir tous les rôles
  const allRoles = getUserRoles(userInfo);

  console.log('Rôles utilisateur :', allRoles);
}
```

### 9.4 Affichage des rôles dans l'interface

Le composant `UserDropdown` affiche automatiquement les rôles de l'utilisateur avec :
- **Badges colorés** pour chaque rôle
- **Couleur spéciale** pour les rôles admin (rouge)
- **Limite d'affichage** : 3 rôles maximum + compteur
- **Icône couronne** pour identifier la section rôles

### 9.5 Types de rôles Keycloak

#### Realm Roles
- Rôles globaux au niveau du realm
- Exemples : `admin`, `user`, `manager`
- Stockés dans `realm_access.roles`

#### Client Roles
- Rôles spécifiques à un client
- Exemples : `oauth2-pkce` → `['viewer', 'editor']`
- Stockés dans `resource_access.{clientId}.roles`

#### Rôles Composites
- Rôles qui incluent d'autres rôles
- Configurés dans Keycloak Admin

---

## 10. Gestion avancée des tokens JWT

### 10.1 Structure du token JWT

Le token d'accès Keycloak est un JWT (JSON Web Token) qui contient :

```json
{
  "exp": 1703123456,           // Expiration timestamp
  "iat": 1703120456,           // Émission timestamp
  "jti": "uuid-token-id",      // ID unique du token
  "iss": "http://keycloak:8080/realms/sib-app",  // Émetteur
  "aud": "oauth2-pkce",        // Audience
  "sub": "user-uuid",          // Subject (ID utilisateur)
  "typ": "Bearer",             // Type de token
  "azp": "oauth2-pkce",        // Authorized party
  "session_state": "uuid",     // État de session
  "scope": "openid offline_access", // Scopes accordés
  "email_verified": true,      // Email vérifié
  "name": "John Doe",          // Nom complet
  "preferred_username": "john.doe",  // Username
  "given_name": "John",        // Prénom
  "family_name": "Doe",        // Nom de famille
  "email": "john.doe@example.com",    // Email
  "realm_access": {            // Rôles du realm
    "roles": ["admin", "user"]
  },
  "resource_access": {         // Rôles des clients
    "oauth2-pkce": {
      "roles": ["ADMIN", "USER"]
    }
  }
}
```

### 10.2 Accès aux tokens dans le code

#### Dans un Client Component

```typescript
'use client'
import { getTokenFromCookie, getUserInfo } from '@/lib/jwt-utils'

export default function MyComponent() {
  const fetchData = async () => {
    const token = getTokenFromCookie()
    const userInfo = getUserInfo()

    const response = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    return response.json()
  }
}
```

#### Dans un Server Component

```typescript
import { cookies } from 'next/headers'

export default async function ServerPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('keycloak-token')?.value

  const response = await fetch('http://localhost:3001/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  return <div>{data}</div>
}
```

#### Dans une API Route

```typescript
// app/api/users/route.ts
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('keycloak-token')?.value

  const response = await fetch('http://backend:8080/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  return Response.json(await response.json())
}
```

### 10.3 Hook personnalisé pour les requêtes authentifiées

**Fichier** : `lib/use-api.ts`

```typescript
'use client'
import { getTokenFromCookie, isTokenExpired, refreshAccessToken, getUserInfo } from '@/lib/jwt-utils'

export function useApi() {
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = getTokenFromCookie()
    const userInfo = getUserInfo()

    // Vérifier si refresh nécessaire
    if (userInfo && isTokenExpired(userInfo)) {
      console.log('Token expired, refreshing...')
      const refreshed = await refreshAccessToken()

      if (!refreshed) {
        // Rediriger vers login si refresh impossible
        window.location.href = '/'
        return
      }

      token = getTokenFromCookie() // Nouveau token
    }

    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }

  return { fetchWithAuth }
}

// Utilisation
export default function MyComponent() {
  const { fetchWithAuth } = useApi()

  const getData = () => fetchWithAuth('/api/data')
}
```

### 10.4 Système de refresh automatique

Le système maintient automatiquement la session active sans déconnexions.

#### Architecture du refresh automatique

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Connexion     │───▶│  Timer démarre   │───▶│ Vérification toutes │
│                 │    │  après login     │    │    les 2 minutes    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Logique de vérification                         │
│                                                                     │
│  Token expire dans 5 min ? ─────▶ OUI ─────▶ Refresh automatique   │
│            │                                        │               │
│            ▼                                        ▼               │
│           NON ─────▶ Continuer                 Token renouvelé      │
│                                                Session maintenue    │
└─────────────────────────────────────────────────────────────────────┘
```

#### Fichiers concernés par le refresh automatique

| Fichier | Description | Rôle |
|---------|-------------|------|
| `app/auth/callback/page.tsx` | Callback OAuth | Stocke access_token + refresh_token, démarre le timer |
| `lib/jwt-utils.ts` | Utilitaires JWT | Contient toutes les fonctions de refresh et gestion tokens |
| `app/(protected)/layout.tsx` | Layout protégé | Démarre le timer et vérifie immédiatement les tokens |
| `middleware.ts` | Middleware Next.js | Gestion intelligente des tokens expirés |
| `lib/auth-simple.ts` | Fonctions auth | Nettoyage des tokens lors du logout |

#### Configuration du refresh automatique

**Variables importantes** :

```typescript
// Délai de vérification du timer
const TIMER_INTERVAL = 2 * 60 * 1000; // 2 minutes

// Délai avant expiration pour déclencher le refresh
const REFRESH_THRESHOLD = 5 * 60; // 5 minutes en secondes

// Durée de vie des cookies
const COOKIE_MAX_AGE = 28800; // 8 heures
```

#### Fonctions principales dans `lib/jwt-utils.ts`

```typescript
// Fonctions de base
getTokenFromCookie()              // Récupère le token d'accès
getRefreshTokenFromCookie()       // Récupère le refresh token
getUserInfo()                     // Décode et retourne les infos utilisateur
isTokenExpired(userInfo)          // Vérifie si le token a expiré
isTokenExpiringSoon(userInfo)     // Vérifie si expiration dans 5 min

// Fonctions de refresh
refreshAccessToken()              // Renouvelle le token avec le refresh token
startTokenRefreshTimer()          // Démarre le timer de vérification automatique

// Fonctions de rôles
hasRole(userInfo, role)           // Vérifie un rôle spécifique
hasAnyRole(userInfo, roles)       // Vérifie au moins un des rôles
getUserRoles(userInfo)            // Retourne tous les rôles utilisateur
```

#### Configuration Keycloak requise

Pour le refresh automatique, assurez-vous que dans Keycloak Admin :

**Client `oauth2-pkce` → Settings** :
- ✅ `Offline Access` : ON
- ✅ `Direct Access Grants` : ON

**Realm Settings → Tokens** :
- `Access Token Lifespan` : 5 minutes (ou plus)
- `Refresh Token Lifespan` : 30 minutes (ou plus)
- `SSO Session Idle` : 30 minutes
- `SSO Session Max` : 10 heures

#### Gestion des erreurs de refresh

Le système gère automatiquement les erreurs :

```typescript
// Si le refresh token est invalide (400)
if (response.status === 400) {
  console.log('Invalid refresh token, clearing cookies');
  // Nettoyage automatique des cookies
  // L'utilisateur sera redirigé vers la page de login
}
```

### 10.5 Surveillance et logs

Le système inclut des logs détaillés pour le monitoring :

```javascript
// Logs du refresh automatique
'🔄 Token expiring soon, refreshing...'
'✅ Token refreshed successfully'
'❌ Failed to refresh token, user will be logged out'

// Logs de vérification
'🔄 Attempting token refresh with: { keycloakUrl, realm, clientId }'
'Token expired, attempting refresh...'
'Invalid refresh token, clearing cookies'
```

### 10.6 Bonnes pratiques

#### Sécurité des tokens

1. **Cookies sécurisés** : `samesite=lax` pour CSRF protection
2. **Durée limitée** : Access tokens courts (5-15 min), refresh tokens plus longs
3. **Nettoyage automatique** : Suppression des tokens invalides

#### Performance

1. **Timer optimisé** : Vérification toutes les 2 minutes (pas trop fréquent)
2. **Refresh anticipé** : 5 minutes avant expiration (évite les coupures)
3. **Server Components** : Utilisation côté serveur quand possible

#### Debugging

1. **Logs détaillés** : Chaque étape du refresh est loggée
2. **Gestion d'erreurs** : Codes d'erreur spécifiques (400, 401, etc.)
3. **State management** : Timer nettoyé automatiquement

---

## 11. Débogage

### 10.1 Page de debug

**URL** : `http://localhost:3000/debug`

Cette page permet de tester :
1. **Realm Keycloak** : `http://keycloak:8080/realms/sib-app`
2. **Login direct** : Test sans PKCE
3. **Landing page** : Test du bouton de connexion

### 10.2 Logs de débogage

Le middleware et les composants incluent des logs console :

```typescript
console.log('🔥 Middleware executing for:', pathname)
console.log('🔒 Protected route detected:', pathname)
console.log('✅ Valid token, allowing access')
console.log('❌ No token found, redirecting')
```

### 10.3 Problèmes courants

#### Token non présent
- **Symptôme** : Redirection constante vers landing
- **Solution** : Vérifier la création du cookie dans callback

#### PKCE verification failed
- **Symptôme** : Erreur lors de l'échange token
- **Solution** : Vérifier la génération SHA256 et le stockage du verifier

#### Boucle de redirection
- **Symptôme** : Redirection infinie
- **Solution** : Vérifier les routes publiques dans middleware

#### Interface Keycloak après logout
- **Symptôme** : Reste sur Keycloak après déconnexion
- **Solution** : Utiliser redirection directe (déjà implémenté)

#### Rôles non visibles
- **Symptôme** : Les rôles n'apparaissent pas dans le token
- **Solution** : Vérifier les Client Scopes et Role Mappings dans Keycloak

#### Vérification des rôles ne fonctionne pas
- **Symptôme** : `hasRole()` retourne toujours false
- **Solution** : Vérifier que les rôles sont bien extraits avec `getUserRoles()`

#### Refresh token erreur 400
- **Symptôme** : `Token refresh failed: 400`
- **Causes** : Refresh token expiré, scope `offline_access` manquant, configuration Keycloak
- **Solutions** :
  1. Vérifier que `offline_access` est dans le scope de connexion
  2. Activer `Offline Access` dans les settings du client Keycloak
  3. Augmenter `Refresh Token Lifespan` dans Realm Settings → Tokens

#### Déconnexion lors de la navigation
- **Symptôme** : Déconnexion automatique en cliquant sur des liens
- **Cause** : Token expiré intercepté par le middleware avant refresh
- **Solution** : Le middleware laisse maintenant passer si refresh token présent

#### Session ne se maintient pas
- **Symptôme** : Déconnexion après quelques minutes d'inactivité
- **Solutions** :
  1. Vérifier que le timer de refresh est bien démarré
  2. Contrôler les logs console pour voir les tentatives de refresh
  3. Augmenter les timeouts dans Keycloak Admin

---

## 12. FAQ - Questions fréquentes

### Q: Comment changer la durée de vie des tokens ?

**A:** Dans Keycloak Admin → Realm Settings → Tokens :
- `Access Token Lifespan` : Durée du token d'accès (recommandé: 5-15 min)
- `Refresh Token Lifespan` : Durée du refresh token (recommandé: 30 min - 2h)
- `SSO Session Idle` : Inactivité max avant déconnexion (recommandé: 30 min - 2h)
- `SSO Session Max` : Durée totale max de session (recommandé: 8-24h)

### Q: Comment ajouter de nouveaux rôles ?

**A:**
1. **Créer le rôle** : Keycloak Admin → Clients → oauth2-pkce → Roles → Create role
2. **Assigner aux utilisateurs** : Users → [User] → Role mappings → Client roles
3. **Utiliser dans le code** : `hasRole(userInfo, 'NOUVEAU_ROLE')`

### Q: Comment accéder aux données utilisateur partout ?

**A:** Utilisez les fonctions utilitaires :
```typescript
import { getUserInfo, getDisplayName, getUserRoles } from '@/lib/jwt-utils'

const userInfo = getUserInfo()
const displayName = getDisplayName(userInfo)
const roles = getUserRoles(userInfo)
```

### Q: Comment désactiver le refresh automatique ?

**A:** Commentez l'appel dans `app/(protected)/layout.tsx` :
```typescript
// useEffect(() => {
//   startTokenRefreshTimer();
// }, []);
```

### Q: Comment changer les URLs de redirection ?

**A:**
1. **Keycloak Admin** : Clients → oauth2-pkce → Valid Redirect URIs
2. **Code** : Modifier `window.location.origin + '/auth/callback'` dans les fichiers

### Q: Comment ajouter des scopes personnalisés ?

**A:** Modifier le scope dans `app/landing/page.tsx` :
```typescript
`scope=openid offline_access profile email custom_scope&`
```

### Q: Le refresh automatique consomme-t-il beaucoup de ressources ?

**A:** Non, le timer vérifie seulement toutes les 2 minutes et ne fait de requête que si nécessaire (5 min avant expiration).

### Q: Comment tester le refresh automatique ?

**A:**
1. Réduire `Access Token Lifespan` à 1 minute dans Keycloak
2. Se connecter et observer les logs console
3. Le refresh doit se déclencher automatiquement

### Q: Puis-je utiliser ce système avec d'autres providers OAuth ?

**A:** Le principe est similaire, mais vous devrez adapter :
- Les URLs d'endpoints
- Le format des tokens
- Les scopes spécifiques

---

## 13. Navigation dynamique basée sur l'API

### 13.1 Vue d'ensemble

Le système utilise maintenant une API pour récupérer la navigation et les permissions en fonction du rôle utilisateur, remplaçant la configuration statique.

#### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Utilisateur   │───▶│ Rôle/Fonction    │───▶│   API Navigation    │
│   connecté      │    │ dans le JWT      │    │ /servicemodules/v1/ │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                           │
                                                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Réponse API Navigation                         │
│                                                                     │
│  {                                                                  │
│    "functionCode": "ADMIN",                                         │
│    "functionDescription": "Administrateur système",                 │
│    "navMain": [                                                     │
│      {                                                              │
│        "title": "Gestion Utilisateurs",                            │
│        "url": "/users",                                             │
│        "items": [                                                   │
│          {                                                          │
│            "title": "Liste",                                        │
│            "url": "/users",                                         │
│            "icon": "RiUserLine",                                    │
│            "actions": [                                             │
│              { "code": "user.view", "title": "Voir" },              │
│              { "code": "user.create", "title": "Créer" }            │
│            ]                                                        │
│          }                                                          │
│        ]                                                            │
│      }                                                              │
│    ]                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 Configuration de l'API

#### Variables d'environnement

Ajoutez dans `.env.local` :

```bash
# Configuration API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Endpoint API

```
GET /servicemodules/v1/fonctions/navigation/{codefonction}
```

**Headers requis :**
```
Authorization: Bearer {keycloak-jwt-token}
Content-Type: application/json
```

**Réponse attendue :**

```json
{
  "functionCode": "string",
  "functionDescription": "string",
  "navMain": [
    {
      "title": "string",
      "url": "string",
      "items": [
        {
          "title": "string",
          "url": "string",
          "icon": "string",
          "description": "string",
          "actions": [
            {
              "code": "string",
              "title": "string",
              "description": "string"
            }
          ],
          "fonctionnaliteCode": "string",
          "moduleCode": "string"
        }
      ]
    }
  ]
}
```

### 13.3 Service de Navigation

#### Fichier principal : `lib/navigation-service.ts`

**Fonctionnalités principales :**

```typescript
// Récupérer navigation pour un rôle spécifique
NavigationService.getNavigationForFunction('ADMIN')

// Récupérer navigation pour l'utilisateur actuel
NavigationService.getNavigationForCurrentUser()

// Vérifier accès à une action
NavigationService.hasActionAccess(navigation, 'user.create')

// Obtenir toutes les actions utilisateur
NavigationService.getAllUserActions(navigation)

// Nettoyer le cache
NavigationService.clearCache()
```

**Cache automatique :** 5 minutes pour optimiser les performances.

#### Hook React : `useNavigation()`

```typescript
const {
  navigation,        // Données de navigation
  loading,          // État de chargement
  error,            // Erreur éventuelle
  refreshNavigation, // Fonction pour rafraîchir
  hasActionAccess,  // Vérifier une action
  getAllActions     // Toutes les actions
} = useNavigation()
```

### 13.4 Système de Permissions

#### Composant PermissionGuard

**Utilisation de base :**

```typescript
<PermissionGuard
  requiredAction="user.create"
  fallback={<p>Pas d'accès</p>}
>
  <Button>Créer utilisateur</Button>
</PermissionGuard>
```

**Options avancées :**

```typescript
<PermissionGuard
  // Une action spécifique
  requiredAction="user.delete"

  // Au moins une de ces actions
  anyOfActions={["user.edit", "user.view", "admin.all"]}

  // Toutes ces actions requises
  allOfActions={["user.create", "user.edit"]}

  // Module spécifique
  requiredModule="user-management"

  // Fonctionnalité spécifique
  requiredFonctionnalite="user-crud"

  // Contenu si pas de permission
  fallback={<div>Accès refusé</div>}

  // Afficher erreur détaillée
  showError={true}
>
  <Button>Action protégée</Button>
</PermissionGuard>
```

#### Hook usePermissions

```typescript
const {
  hasAction,           // (actionCode: string) => boolean
  hasAnyAction,        // (actions: string[]) => boolean
  hasAllActions,       // (actions: string[]) => boolean
  hasModule,           // (moduleCode: string) => boolean
  hasFonctionnalite,   // (fonctionnaliteCode: string) => boolean
  getAllUserActions,   // () => NavigationAction[]
  userNavigation       // NavigationResponse | null
} = usePermissions()

// Exemples d'utilisation
if (hasAction('user.create')) {
  // Afficher bouton créer
}

if (hasAnyAction(['admin.all', 'super.admin'])) {
  // Afficher panneau admin
}

if (hasModule('reports')) {
  // Afficher section rapports
}
```

### 13.5 Intégration dans les composants

#### Mise à jour automatique

Les composants suivants utilisent automatiquement la navigation dynamique :

| Composant | Fichier | Description |
|-----------|---------|-------------|
| `ProSidebar` | `components/pro-sidebar.tsx` | Menu latéral dynamique |
| `DashboardPage` | `app/(protected)/dashboard/page.tsx` | Statistiques basées sur modules |

#### Fallback en cas d'erreur

Un système de fallback assure la continuité :

```typescript
// Navigation par défaut si API inaccessible
export const FALLBACK_NAVIGATION: NavigationResponse = {
  functionCode: 'fallback',
  functionDescription: 'Navigation par défaut',
  navMain: [
    {
      title: 'Tableau de bord',
      url: '/dashboard',
      items: [...]
    }
  ]
}
```

### 13.6 Gestion des erreurs

#### États possibles

1. **Chargement** : Skeleton/loading states
2. **Succès** : Navigation normale
3. **Erreur API** : Fallback + bouton retry
4. **Pas de token** : Redirection login

#### Debug et monitoring

**Page de démo :** `/permissions-demo`

Affiche :
- Toutes les permissions utilisateur
- Exemples d'utilisation
- Tests en temps réel
- Guide d'intégration

### 13.7 Performance et cache

#### Optimisations

- **Cache intelligent** : 5 minutes par rôle
- **Évitement doublons** : Un seul appel API par session
- **Lazy loading** : Navigation chargée à la demande
- **Fallback rapide** : Navigation statique en cas d'échec

#### Monitoring

```javascript
// Logs automatiques
'📦 Navigation loaded from cache for: ADMIN'
'🔄 Fetching navigation for function: USER'
'✅ Navigation loaded successfully for: MANAGER'
'❌ Navigation fetch failed: 401 Unauthorized'
```

### 13.8 Migration depuis nav-config statique

#### Ancienne méthode (dépréciée)

```typescript
import { NAV_CONFIG } from '@/nav-config'
// Navigation statique en dur
```

#### Nouvelle méthode

```typescript
import { useNavigation } from '@/lib/navigation-service'

const { navigation } = useNavigation()
// Navigation dynamique depuis l'API
```

#### Checklist de migration

- [ ] Remplacer `NAV_CONFIG` par `useNavigation()`
- [ ] Ajouter `NEXT_PUBLIC_API_URL` dans `.env.local`
- [ ] Configurer l'endpoint API côté backend
- [ ] Tester avec différents rôles utilisateur
- [ ] Vérifier les permissions dans l'interface

---

## 14. Commandes utiles

```bash
# Démarrer le projet
npm run dev

# Démarrer Keycloak (si Docker)
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev

# Vérifier les cookies (DevTools Console)
document.cookie

# Vérifier les tokens stockés (DevTools Console)
document.cookie.split(';').find(c => c.includes('keycloak-token'))
document.cookie.split(';').find(c => c.includes('keycloak-refresh-token'))

# Décoder un token JWT manuellement (DevTools Console)
const token = document.cookie.split(';').find(c => c.includes('keycloak-token')).split('=')[1]
JSON.parse(atob(token.split('.')[1]))

# Nettoyer le stockage (DevTools Console)
localStorage.clear()
sessionStorage.clear()
document.cookie = 'keycloak-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
document.cookie = 'keycloak-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT'

# Vérifier les informations utilisateur (DevTools Console)
import { getUserInfo, getUserRoles, getDisplayName } from '@/lib/jwt-utils';
const user = getUserInfo();
console.log('User:', user);
console.log('Rôles:', getUserRoles(user));
console.log('Nom:', getDisplayName(user));

# Tester le refresh token manuellement (DevTools Console)
import { refreshAccessToken, isTokenExpired } from '@/lib/jwt-utils';
const user = getUserInfo();
console.log('Token expiré?', isTokenExpired(user));
await refreshAccessToken();

# Démarrer le timer de refresh manuellement (DevTools Console)
import { startTokenRefreshTimer } from '@/lib/jwt-utils';
startTokenRefreshTimer();

# Vérifier l'état du middleware (Logs serveur)
# Les logs apparaissent dans la console Next.js

# Restart Next.js dev server
# Ctrl+C puis npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

## 14. Checklist de vérification rapide

### ✅ Installation et configuration

- [ ] Keycloak démarré sur http://localhost:8080
- [ ] Realm `sib-app` créé
- [ ] Client `oauth2-pkce` configuré avec PKCE S256
- [ ] `Offline Access` activé dans le client
- [ ] Variables d'environnement dans `.env.local`
- [ ] Utilisateurs de test créés avec rôles

### ✅ Fonctionnalités de base

- [ ] Connexion PKCE fonctionne
- [ ] Redirection après login vers dashboard
- [ ] Affichage des informations utilisateur
- [ ] Déconnexion nettoie les cookies
- [ ] Middleware protège les routes

### ✅ Refresh automatique

- [ ] Scope `offline_access` dans la demande de connexion
- [ ] Refresh token stocké dans les cookies
- [ ] Timer de refresh démarre après connexion
- [ ] Logs de refresh visibles dans la console
- [ ] Pas de déconnexions intempestives

### ✅ Gestion des rôles

- [ ] Rôles visibles dans le token JWT
- [ ] Middleware vérifie le rôle requis
- [ ] Fonctions `hasRole()` fonctionnent
- [ ] Interface utilisateur s'adapte aux rôles

### ✅ Performance et sécurité

- [ ] Server Components utilisés quand possible
- [ ] Cookies sécurisés (`samesite=lax`)
- [ ] Tokens avec durée de vie appropriée
- [ ] Nettoyage automatique des tokens invalides
```

---

## 🔧 Configuration avancée

### Variables d'environnement supplémentaires

```env
# Optionnel : Configuration avancée
NEXT_PUBLIC_KEYCLOAK_POST_LOGOUT_REDIRECT_URI=/landing
NEXT_PUBLIC_KEYCLOAK_CHECK_LOGIN_IFRAME=false
```

### Headers de sécurité

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}
```

---

Cette documentation couvre tous les aspects de l'implémentation Keycloak dans votre application Next.js. Gardez ce fichier à jour lors des modifications futures.