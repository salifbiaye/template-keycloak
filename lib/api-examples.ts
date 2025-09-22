// Exemples d'utilisation du proxy API avec Keycloak

import { ApiProxy, apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-proxy';

// === Configuration personnalisée ===

// Créer une instance proxy pour votre API backend
const backendApi = new ApiProxy({
  baseUrl: 'https://votre-backend.com/api',
  defaultHeaders: {
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0'
  },
  timeout: 10000 // 10 secondes
});

// === Utilisation directe des méthodes globales ===

export async function exempleUtilisationDirecte() {
  try {
    // GET - récupérer des données
    const users = await apiGet('/users');
    console.log('Users:', users);

    // POST - créer des données
    const newUser = await apiPost('/users', {
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('Created user:', newUser);

    // PUT - mettre à jour des données
    const updatedUser = await apiPut('/users/1', {
      name: 'Jane Doe',
      email: 'jane@example.com'
    });
    console.log('Updated user:', updatedUser);

    // DELETE - supprimer des données
    await apiDelete('/users/1');
    console.log('User deleted');

  } catch (error) {
    console.error('API Error:', error);
  }
}

// === Utilisation avec instance personnalisée ===

export async function exempleAvecInstancePersonnalisee() {
  try {
    // Toutes les requêtes utilisent automatiquement le token Keycloak
    const products = await backendApi.get('/products');

    const newProduct = await backendApi.post('/products', {
      name: 'Nouveau produit',
      price: 29.99
    });

    // Requête sans authentication (rare)
    const publicData = await backendApi.get('/public/status', {
      skipAuth: true
    });

    // Requête avec headers personnalisés
    const specialData = await backendApi.get('/special-endpoint', {
      headers: {
        'X-Special-Header': 'special-value'
      }
    });

  } catch (error) {
    console.error('Backend API Error:', error);
  }
}

// === Gestion des erreurs avancée ===

export async function exempleGestionErreurs() {
  try {
    const data = await apiGet('/users/999'); // utilisateur qui n'existe pas
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.log('Utilisateur non trouvé');
      } else if (error.message.includes('Authentication required')) {
        console.log('Redirection vers login nécessaire');
        // window.location.href = '/landing';
      } else {
        console.error('Erreur inattendue:', error.message);
      }
    }
  }
}

// === Exemples de types TypeScript ===

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  role?: string;
}

export async function exempleAvecTypes() {
  try {
    // GET avec typage
    const users = await apiGet<User[]>('/users');
    console.log('Premier utilisateur:', users[0].name);

    // POST avec typage
    const createRequest: CreateUserRequest = {
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin'
    };

    const newUser = await apiPost<User>('/users', createRequest);
    console.log('Nouvel utilisateur créé:', newUser.id);

  } catch (error) {
    console.error('Error:', error);
  }
}

// === Utilisation avec React (exemple component) ===

/*
import { useApiGet, useApiPost } from '@/hooks/use-api';
import defaultApiProxy from '@/lib/api-proxy';

function UsersList() {
  // Hook pour récupérer les utilisateurs
  const { data: users, loading, error, execute: refetchUsers } = useApiGet<User[]>(
    '/users',
    defaultApiProxy,
    {
      immediate: true, // Charge automatiquement au mount
      onSuccess: (data) => console.log('Users loaded:', data.length),
      onError: (error) => console.error('Failed to load users:', error)
    }
  );

  // Hook pour créer un utilisateur
  const { mutate: createUser, loading: creating } = useApiPost<User, CreateUserRequest>(
    '/users',
    defaultApiProxy,
    {
      onSuccess: (user) => {
        console.log('User created:', user);
        refetchUsers(); // Recharger la liste
      }
    }
  );

  const handleCreateUser = () => {
    createUser({
      name: 'New User',
      email: 'new@example.com'
    });
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <button onClick={handleCreateUser} disabled={creating}>
        {creating ? 'Création...' : 'Créer un utilisateur'}
      </button>

      <ul>
        {users?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}
*/

export default {
  exempleUtilisationDirecte,
  exempleAvecInstancePersonnalisee,
  exempleGestionErreurs,
  exempleAvecTypes
};