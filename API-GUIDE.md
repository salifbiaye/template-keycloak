# Guide d'utilisation de l'API Proxy avec Keycloak

Ce guide présente les deux façons d'utiliser l'API proxy pour communiquer avec vos microservices via le gateway, avec gestion automatique du token Keycloak.

## 📋 Table des matières

- [Configuration](#configuration)
- [Style 1: API Client (useEffect/Client Components)](#style-1-api-client)
- [Style 2: Server Actions (Server Components)](#style-2-server-actions)
- [Comparaison et recommandations](#comparaison-et-recommandations)
- [Exemples pratiques](#exemples-pratiques)

## ⚙️ Configuration

### Variables d'environnement

```bash
# .env.local
BACKEND_URL=http://localhost:8080
GATEWAY_URL=http://localhost:8080
```

### Architecture

```
Frontend (Next.js) → API Routes (/api/[...path]) → Gateway (localhost:8080) → Microservices
```

## 🎯 Style 1: API Client

**Utilisation**: Client Components, interactions utilisateur, état réactif

### Fichiers concernés
- `lib/api-proxy.ts` - Proxy principal
- `hooks/use-api.ts` - Hooks React
- `app/api/[...path]/route.ts` - Routes API Next.js

### Fonctions disponibles

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-proxy';

// GET
const users = await apiGet<User[]>('/users');
const user = await apiGet<User>('/users/123');

// POST
const newUser = await apiPost<User>('/users', userData);

// PUT
const updatedUser = await apiPut<User>('/users/123', userData);

// DELETE
await apiDelete('/users/123');
```

### Avec hooks React

```typescript
import { useApiGet, useApiPost } from '@/hooks/use-api';
import defaultApiProxy from '@/lib/api-proxy';

function UsersComponent() {
  // Hook GET avec chargement automatique
  const { data: users, loading, error, execute } = useApiGet<User[]>(
    '/users',
    defaultApiProxy,
    { immediate: true }
  );

  // Hook POST pour créer
  const { mutate: createUser, loading: creating } = useApiPost<User>(
    '/users',
    defaultApiProxy,
    {
      onSuccess: () => execute() // Recharger la liste
    }
  );

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <button onClick={() => createUser({ name: 'John', email: 'john@test.com' })}>
        {creating ? 'Création...' : 'Créer utilisateur'}
      </button>

      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Avantages
- ✅ État réactif automatique
- ✅ Gestion loading/error intégrée
- ✅ Retry automatique sur erreur token
- ✅ Parfait pour les interactions utilisateur

### Inconvénients
- ❌ Nécessite `'use client'`
- ❌ Données chargées côté client
- ❌ SEO moins optimal

## 🚀 Style 2: Server Actions

**Utilisation**: Server Components, données initiales, actions formulaires

### Fichiers concernés
- `lib/server-api.ts` - API serveur
- `actions/user-actions.ts` - Actions spécifiques

### Fonctions disponibles

```typescript
import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/server-api';

// GET
const users = await serverGet<User[]>('/users');
const user = await serverGet<User>('/users/123');

// POST
const newUser = await serverPost<User>('/users', userData);

// PUT
const updatedUser = await serverPut<User>('/users/123', userData);

// DELETE
await serverDelete('/users/123');
```

### Dans un Server Component

```typescript
// app/users/page.tsx
import { serverGet } from '@/lib/server-api';

export default async function UsersPage() {
  // Données chargées côté serveur (SEO optimal)
  const users = await serverGet<User[]>('/users');
  const stats = await serverGet('/users/stats');

  return (
    <div>
      <h1>{users.length} utilisateurs ({stats.active} actifs)</h1>

      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
          <DeleteUserForm userId={user.id} />
        </div>
      ))}

      <CreateUserForm />
    </div>
  );
}
```

### Avec Server Actions

```typescript
// actions/user-actions.ts
'use server';

import { serverPost, serverDelete } from '@/lib/server-api';
import { revalidatePath } from 'next/cache';

export async function createUser(formData: FormData) {
  const userData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
  };

  await serverPost('/users', userData);
  revalidatePath('/users'); // Actualiser la page
}

export async function deleteUser(userId: string) {
  await serverDelete(`/users/${userId}`);
  revalidatePath('/users');
}

// Utilisation dans le composant
function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Nom" required />
      <input name="email" placeholder="Email" required />
      <button type="submit">Créer</button>
    </form>
  );
}

function DeleteUserForm({ userId }: { userId: string }) {
  return (
    <form action={deleteUser.bind(null, userId)}>
      <button type="submit">Supprimer</button>
    </form>
  );
}
```

### Avantages
- ✅ SEO optimal (rendu serveur)
- ✅ Pas de `useEffect`
- ✅ Données disponibles au premier rendu
- ✅ Cache Next.js automatique

### Inconvénients
- ❌ Moins d'interactivité
- ❌ Rechargement de page nécessaire
- ❌ Pas d'état loading/error automatique

## 🤔 Comparaison et recommandations

| Aspect | API Client | Server Actions |
|--------|------------|----------------|
| **Rendu** | Client | Serveur |
| **SEO** | ❌ Limité | ✅ Optimal |
| **Performance initiale** | ❌ Plus lent | ✅ Plus rapide |
| **Interactivité** | ✅ Excellente | ❌ Limitée |
| **Gestion d'état** | ✅ Automatique | ❌ Manuelle |
| **Simplicité** | ⚖️ Moyenne | ✅ Simple |

### 📋 Recommandations d'usage

#### ✅ Utilisez **API Client** pour :
- **Interactions utilisateur fréquentes** (recherche, filtres, pagination)
- **Tableaux avec actions** (tri, modification inline)
- **Formulaires complexes** avec validation temps réel
- **Dashboards temps réel** avec actualisation automatique
- **États loading/error importants** pour l'UX

```typescript
// Exemple : Recherche en temps réel
'use client';

function UserSearch() {
  const [query, setQuery] = useState('');
  const { data: users, loading } = useApiGet(`/users?search=${query}`, defaultApiProxy);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher..."
      />
      {loading ? <div>Recherche...</div> : users?.map(user => ...)}
    </div>
  );
}
```

#### ✅ Utilisez **Server Actions** pour :
- **Pages de contenu** (listes, détails)
- **Formulaires simples** (création, modification)
- **Actions CRUD basiques**
- **Données initiales** importantes pour le SEO
- **Applications avec peu d'interactivité**

```typescript
// Exemple : Page produits
export default async function ProductsPage() {
  const products = await serverGet('/products');
  const categories = await serverGet('/categories');

  return (
    <div>
      <h1>Nos {products.length} produits</h1>
      {/* Rendu serveur = SEO optimal */}
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🔧 Exemples pratiques

### Exemple 1: Page utilisateurs (hybride)

```typescript
// app/users/page.tsx - Server Component pour les données initiales
import { serverGet } from '@/lib/server-api';
import { UsersList } from './users-list';

export default async function UsersPage() {
  const initialUsers = await serverGet<User[]>('/users');

  return (
    <div>
      <h1>Gestion des utilisateurs</h1>
      <UsersList initialUsers={initialUsers} />
    </div>
  );
}

// users-list.tsx - Client Component pour l'interactivité
'use client';

import { useState } from 'react';
import { useApiGet, useApiPost } from '@/hooks/use-api';

export function UsersList({ initialUsers }: { initialUsers: User[] }) {
  const [search, setSearch] = useState('');

  // Utilise les données initiales, puis API client pour la recherche
  const { data: users = initialUsers } = useApiGet(
    search ? `/users?search=${search}` : '',
    defaultApiProxy,
    { immediate: !!search }
  );

  return (
    <div>
      <input
        placeholder="Rechercher..."
        onChange={(e) => setSearch(e.target.value)}
      />
      {(search ? users : initialUsers).map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Exemple 2: Formulaire de création

```typescript
// actions/user-actions.ts
'use server';

export async function createUser(formData: FormData) {
  const result = await serverPost('/users', {
    name: formData.get('name'),
    email: formData.get('email')
  });

  revalidatePath('/users');
  return result;
}

// create-user-form.tsx
import { createUser } from '@/actions/user-actions';

export default function CreateUserForm() {
  return (
    <form action={createUser} className="space-y-4">
      <input name="name" placeholder="Nom" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Créer utilisateur</button>
    </form>
  );
}
```

## 🔒 Sécurité

Les deux approches gèrent automatiquement :
- ✅ **Token Keycloak** dans l'header `Authorization: Bearer`
- ✅ **Refresh automatique** des tokens expirés
- ✅ **Gestion des erreurs** 401/403
- ✅ **Validation côté serveur** (Server Actions)

## 🎯 Conclusion

**Recommandation générale** : Commencez par **Server Actions** pour la simplicité et le SEO, puis ajoutez du **API Client** là où vous avez besoin d'interactivité avancée.

Cette approche hybride vous donne le meilleur des deux mondes ! 🚀