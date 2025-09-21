// Fonctions côté CLIENT uniquement
export function logout() {
  const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL ||'http://keycloak:8080';
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sib-app';

  // Nettoyer les cookies et storage
  if (typeof window !== 'undefined') {
    document.cookie = 'keycloak-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.clear();
    sessionStorage.clear();

    // Redirection directe vers landing page sans passer par Keycloak logout
    window.location.href = window.location.origin + '/landing';
  }
}