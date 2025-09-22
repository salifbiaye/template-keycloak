'use client';

import {
  getTokenFromCookie,
  getUserInfo,
  isTokenExpired,
  isTokenExpiringSoon,
  refreshAccessToken
} from '@/lib/jwt-utils';

export interface ApiProxyConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface ApiProxyOptions {
  headers?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean;
  retryOnTokenExpiry?: boolean;
}

export class ApiProxy {
  private config: ApiProxyConfig;

  constructor(config: ApiProxyConfig) {
    this.config = {
      timeout: 30000, // 30 secondes par défaut
      ...config
    };
  }

  private async ensureValidToken(): Promise<string | null> {
    let token = getTokenFromCookie();

    if (!token) {
      console.warn('❌ No token found');
      return null;
    }

    const userInfo = getUserInfo();
    if (!userInfo) {
      console.warn('❌ Invalid token');
      return null;
    }

    // Si le token est expiré
    if (isTokenExpired(userInfo)) {
      console.log('🔄 Token expired, trying to refresh...');
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        token = getTokenFromCookie();
        console.log('✅ Token refreshed successfully');
      } else {
        console.error('❌ Failed to refresh expired token');
        return null;
      }
    }
    // Si le token expire bientôt
    else if (isTokenExpiringSoon(userInfo)) {
      console.log('⏰ Token expiring soon, refreshing preemptively...');
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        token = getTokenFromCookie();
        console.log('✅ Token refreshed preemptively');
      }
      // Si le refresh échoue mais que le token actuel est encore valide, on continue
    }

    return token;
  }

  private async makeRequest(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body?: any,
    options: ApiProxyOptions = {}
  ): Promise<Response> {
    const {
      headers = {},
      timeout = this.config.timeout,
      skipAuth = false,
      retryOnTokenExpiry = true
    } = options;

    // Construire l'URL complète
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;

    // Préparer les headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.defaultHeaders,
      ...headers
    };

    // Ajouter l'authorization si nécessaire
    if (!skipAuth) {
      const token = await this.ensureValidToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication required but no valid token available');
      }
    }

    // Préparer la configuration de la requête
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: timeout ? AbortSignal.timeout(timeout) : undefined
    };

    // Ajouter le body si nécessaire
    if (body && method !== 'GET') {
      if (typeof body === 'string') {
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    try {
      console.log(`🌐 ${method} ${fullUrl}`);
      const response = await fetch(fullUrl, requestConfig);

      // Si la réponse indique un token expiré et qu'on peut retry
      if (response.status === 401 && retryOnTokenExpiry && !skipAuth) {
        console.log('🔄 Received 401, attempting token refresh and retry...');

        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newToken = await this.ensureValidToken();
          if (newToken) {
            requestHeaders['Authorization'] = `Bearer ${newToken}`;
            requestConfig.headers = requestHeaders;

            console.log(`🔄 Retrying ${method} ${fullUrl} with new token`);
            return await fetch(fullUrl, requestConfig);
          }
        }

        throw new Error('Authentication failed and token refresh unsuccessful');
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  // Méthodes publiques pour chaque type de requête HTTP
  async get<T = any>(url: string, options?: ApiProxyOptions): Promise<T> {
    const response = await this.makeRequest(url, 'GET', undefined, options);

    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
    }

    // Gérer les réponses vides
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  }

  async post<T = any>(url: string, body?: any, options?: ApiProxyOptions): Promise<T> {
    const response = await this.makeRequest(url, 'POST', body, options);

    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  }

  async put<T = any>(url: string, body?: any, options?: ApiProxyOptions): Promise<T> {
    const response = await this.makeRequest(url, 'PUT', body, options);

    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  }

  async patch<T = any>(url: string, body?: any, options?: ApiProxyOptions): Promise<T> {
    const response = await this.makeRequest(url, 'PATCH', body, options);

    if (!response.ok) {
      throw new Error(`PATCH ${url} failed: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  }

  async delete<T = any>(url: string, options?: ApiProxyOptions): Promise<T> {
    const response = await this.makeRequest(url, 'DELETE', undefined, options);

    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.status} ${response.statusText}`);
    }

    // Pour les DELETE, la réponse peut être vide
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return (text || null) as T;
    }
  }

  // Méthode pour faire des requêtes brutes si besoin
  async raw(url: string, options: RequestInit & { skipAuth?: boolean } = {}): Promise<Response> {
    const { skipAuth = false, ...fetchOptions } = options;

    if (!skipAuth) {
      const token = await this.ensureValidToken();
      if (token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    }

    const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
    return await fetch(fullUrl, fetchOptions);
  }
}

// Instance par défaut pour faciliter l'utilisation
const defaultApiProxy = new ApiProxy({
  baseUrl: '/api', // Utilise les API routes Next.js locales
  defaultHeaders: {
    'Accept': 'application/json',
  }
});

export default defaultApiProxy;

// Export des méthodes directement pour une utilisation simplifiée
export const apiGet = <T = any>(url: string, options?: ApiProxyOptions) =>
  defaultApiProxy.get<T>(url, options);

export const apiPost = <T = any>(url: string, body?: any, options?: ApiProxyOptions) =>
  defaultApiProxy.post<T>(url, body, options);

export const apiPut = <T = any>(url: string, body?: any, options?: ApiProxyOptions) =>
  defaultApiProxy.put<T>(url, body, options);

export const apiPatch = <T = any>(url: string, body?: any, options?: ApiProxyOptions) =>
  defaultApiProxy.patch<T>(url, body, options);

export const apiDelete = <T = any>(url: string, options?: ApiProxyOptions) =>
  defaultApiProxy.delete<T>(url, options);

export const apiRaw = (url: string, options?: RequestInit & { skipAuth?: boolean }) =>
  defaultApiProxy.raw(url, options);