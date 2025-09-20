'use client';

import { Button } from '@/components/ui/button';

// Fonction pour générer SHA256 correcte pour PKCE
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

// Générer un code verifier sécurisé
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default function LoginButton() {
  const handleLogin = async () => {
    console.log('🔴 Login button clicked!');

    // Nettoyer tous les cookies avant de commencer
    localStorage.clear();
    sessionStorage.clear();

    // Supprimer tous les cookies du domaine
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirection directe vers Keycloak avec PKCE
    const keycloakUrl = 'http://keycloak:8080';
    const realm = 'sib-app';
    const clientId = 'oauth2-pkce';

    // Générer des paramètres PKCE corrects
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await sha256(codeVerifier);

    console.log('🔐 PKCE Code Verifier:', codeVerifier);
    console.log('🔐 PKCE Code Challenge:', codeChallenge);

    // Stocker le code verifier pour plus tard
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);

    const loginUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&` +
      `response_type=code&` +
      `scope=openid&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256&` +
      `prompt=login`;

    console.log('Generated URL:', loginUrl);
    console.log('About to redirect...');

    try {
      window.location.href = loginUrl;
      console.log('Redirect initiated');
    } catch (error) {
      console.error('Redirect failed:', error);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      className="w-full"
      size="lg"
    >
      Se connecter avec Keycloak
    </Button>
  );
}