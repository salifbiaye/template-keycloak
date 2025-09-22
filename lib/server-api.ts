'use server';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('keycloak-token')?.value || null;
}

async function makeServerRequest(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  body?: any
) {
  const token = await getToken();

  if (!token) {
    throw new Error('Authentication required');
  }

  const fullUrl = `${BACKEND_URL}${url}`;

  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store' // Toujours récupérer des données fraîches
  });

  if (!response.ok) {
    throw new Error(`${method} ${url} failed: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
}

// === API SERVER ACTIONS (même principe que apiGet etc) ===

export async function serverGet<T = any>(url: string): Promise<T> {
  return makeServerRequest(url, 'GET');
}

export async function serverPost<T = any>(url: string, body?: any): Promise<T> {
  return makeServerRequest(url, 'POST', body);
}

export async function serverPut<T = any>(url: string, body?: any): Promise<T> {
  return makeServerRequest(url, 'PUT', body);
}

export async function serverPatch<T = any>(url: string, body?: any): Promise<T> {
  return makeServerRequest(url, 'PATCH', body);
}

export async function serverDelete<T = any>(url: string): Promise<T> {
  return makeServerRequest(url, 'DELETE');
}