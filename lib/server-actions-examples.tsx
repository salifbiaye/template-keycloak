// Exemples d'utilisation des Server Actions avec la même simplicité que apiGet

import { getUsers, createUser, updateUser, deleteUser } from '@/actions/user-actions';
import { serverGet } from '@/lib/server-api';

// === DANS UN SERVER COMPONENT ===

export async function UsersPage() {
  // Même simplicité que apiGet !
  const users = await getUsers();

  return (
    <div>
      <h1>{users.length} utilisateurs</h1>
      {users.map((user: any) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}

      <CreateUserForm />
    </div>
  );
}

// === FORMULAIRE AVEC ACTION ===

function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Nom" required />
      <input name="email" placeholder="Email" required />
      <input name="firstName" placeholder="Prénom" required />
      <input name="lastName" placeholder="Nom de famille" required />
      <button type="submit">Créer utilisateur</button>
    </form>
  );
}

// === BOUTON DE SUPPRESSION ===

function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <form action={deleteUser.bind(null, userId)}>
      <button type="submit">Supprimer</button>
    </form>
  );
}

// === AVEC startTransition POUR L'UX ===

'use client';

import { startTransition } from 'react';
import { createUserDirect } from '@/actions/user-actions';

function CreateUserButton() {
  const handleCreate = () => {
    startTransition(async () => {
      await createUserDirect({
        name: 'John Doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe'
      });
    });
  };

  return <button onClick={handleCreate}>Créer utilisateur</button>;
}

// === RÉCUPÉRATION DIRECTE DANS SERVER COMPONENT ===

export async function UserProfile({ userId }: { userId: string }) {
  // Utilisation directe de serverGet (même que apiGet)
  const user = await serverGet(`/users/${userId}`);
  const orders = await serverGet(`/orders?userId=${userId}`);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>{orders.length} commandes</p>
    </div>
  );
}

// === AUTRES MICROSERVICES ===

export async function ProductsPage() {
  // Même simplicité pour tous les microservices
  const products = await serverGet('/products');
  const categories = await serverGet('/categories');

  return (
    <div>
      <h1>{products.length} produits</h1>
      <p>{categories.length} catégories</p>
    </div>
  );
}

export default {
  UsersPage,
  CreateUserForm,
  DeleteUserButton,
  CreateUserButton,
  UserProfile,
  ProductsPage
};