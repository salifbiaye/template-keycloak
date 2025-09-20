export default function DebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">🔧 Debug Keycloak</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">1. Test direct du realm</h2>
          <a
            href="http://keycloak:8080/realms/sib-app"
            target="_blank"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tester le Realm
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">2. Test login sans PKCE</h2>
          <a
            href="http://keycloak:8080/realms/sib-app/protocol/openid-connect/auth?client_id=oauth2-pkce&redirect_uri=http://localhost:3000/auth/callback&response_type=code&scope=openid&prompt=login"
            target="_blank"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Login Direct
          </a>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">3. Landing page avec login</h2>
          <a
            href="/"
            className="inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Landing Page
          </a>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Diagnostic :</h3>
        <ul className="text-sm space-y-1">
          <li>• Si le lien 1 ne marche pas → Keycloak n'est pas démarré</li>
          <li>• Si le lien 1 marche mais pas le 2 → Problème de client Keycloak</li>
          <li>• Si les liens 1 et 2 marchent mais pas le 3 → Problème dans le login de la landing page</li>
        </ul>
      </div>
    </div>
  );
}