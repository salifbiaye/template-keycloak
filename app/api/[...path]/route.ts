import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

async function proxyToBackend(
  method: string,
  path: string[],
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Récupérer le token
    const cookieStore = await cookies();
    const token = cookieStore.get('keycloak-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // URL vers le backend
    const backendUrl = `${BACKEND_URL}/${path.join('/')}`;

    // Body pour POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await request.text();
    }

    // Query params
    const url = new URL(backendUrl);
    const searchParams = new URL(request.url).searchParams;
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Appel backend
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: 'Backend error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyToBackend('GET', params.path, request);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyToBackend('POST', params.path, request);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyToBackend('PUT', params.path, request);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return proxyToBackend('DELETE', params.path, request);
}