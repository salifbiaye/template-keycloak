'use server';

import { serverGet, serverPost, serverPut, serverDelete } from '@/lib/server-api';
import { revalidatePath } from 'next/cache';

// === ACTIONS POUR USERS (même simplicité que apiGet) ===

export async function getUsers() {
  return await serverGet('/users');
}

export async function getUserById(id: string) {
  return await serverGet(`/users/${id}`);
}

export async function createUser(formData: FormData) {
  const userData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
  };

  const newUser = await serverPost('/users', userData);

  // Revalider la page pour actualiser les données
  revalidatePath('/users');

  return newUser;
}

export async function updateUser(id: string, formData: FormData) {
  const userData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
  };

  const updatedUser = await serverPut(`/users/${id}`, userData);

  revalidatePath('/users');
  revalidatePath(`/users/${id}`);

  return updatedUser;
}

export async function deleteUser(id: string) {
  await serverDelete(`/users/${id}`);
  revalidatePath('/users');
}

// === ACTIONS AVEC DONNÉES DIRECTES (pas de FormData) ===

export async function createUserDirect(userData: {
  name: string;
  email: string;
  firstName: string;
  lastName: string;
}) {
  const newUser = await serverPost('/users', userData);
  revalidatePath('/users');
  return newUser;
}

export async function updateUserDirect(id: string, userData: any) {
  const updatedUser = await serverPut(`/users/${id}`, userData);
  revalidatePath('/users');
  revalidatePath(`/users/${id}`);
  return updatedUser;
}