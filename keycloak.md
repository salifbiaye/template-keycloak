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

## 10. Débogage

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

---

## 11. Commandes utiles

```bash
# Démarrer le projet
npm run dev

# Vérifier les cookies (DevTools)
document.cookie

# Décoder un token JWT manuellement
atob('eyJ0eXAiOiJKV1QiLCJhbGc...'.split('.')[1])

# Nettoyer le stockage
localStorage.clear()
sessionStorage.clear()

# Vérifier les rôles utilisateur (DevTools)
import { getUserInfo, getUserRoles } from '@/lib/jwt-utils';
const user = getUserInfo();
console.log('Rôles:', getUserRoles(user));
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