export default function TestKeycloakPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Keycloak Direct</h1>
      <p className="mb-4">Testez ces URLs directement :</p>

      <div className="space-y-2">
        <a
          href="http://localhost:8080/realms/sib-app"
          target="_blank"
          className="block text-blue-600 hover:underline"
        >
          1. Test Realm: http://localhost:8080/realms/sib-app
        </a>

        <a
          href="http://localhost:8080/realms/sib-app/protocol/openid-connect/auth?client_id=oauth2-pkce&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=openid&prompt=login"
          target="_blank"
          className="block text-blue-600 hover:underline"
        >
          2. Test Login (sans PKCE): Login simple
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Si le premier lien fonctionne mais pas le second, il y a un problème avec votre client Keycloak.
      </p>
    </div>
  );
}