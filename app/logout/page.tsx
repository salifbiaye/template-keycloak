import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function LogoutPage() {
  // Supprimer le cookie côté serveur
  const cookieStore = cookies();
  cookieStore.delete('keycloak-token');

  // Rediriger vers la landing page
  redirect('/landing');
}