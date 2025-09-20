/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:8080 http://keycloak:8080;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: http://localhost:8080 http://keycloak:8080;
              font-src 'self' data:;
              connect-src 'self' http://localhost:8080 http://keycloak:8080;
              frame-src 'self' http://localhost:8080 http://keycloak:8080;
              frame-ancestors 'self' http://localhost:8080 http://keycloak:8080;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig