'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('🔄 Processing callback...');

      // Récupérer le code d'autorisation depuis l'URL
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Authentication error:', error);
        console.error('Error description:', searchParams.get('error_description'));
        console.error('Full URL:', window.location.href);
        router.push('/?error=' + error);
        return;
      }

      if (!code) {
        console.error('No authorization code found');
        router.push('/?error=no_code');
        return;
      }

      console.log('✅ Got authorization code:', code);

      try {
        // Échanger le code contre un token
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

        if (!codeVerifier) {
          console.error('No code verifier found');
          router.push('/?error=no_verifier');
          return;
        }

        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8080';
        const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'sib-app';
        const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'oauth2-pkce';

        const tokenParams = {
          grant_type: 'authorization_code',
          client_id: clientId,
          code: code,
          redirect_uri: window.location.origin + '/auth/callback',
          code_verifier: codeVerifier,
        };


        const tokenResponse = await fetch(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(tokenParams),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('Token exchange failed:', tokenResponse.status, errorText);
          throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Got token:', tokenData);

        // Stocker le token dans un cookie (8 heures)
        document.cookie = `keycloak-token=${tokenData.access_token}; path=/; samesite=lax; max-age=28800`;

        // Nettoyer le code verifier
        sessionStorage.removeItem('pkce_code_verifier');

        // Rediriger vers le dashboard
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