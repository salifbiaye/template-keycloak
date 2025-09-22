import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// URL du backend interne (côté serveur)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8082'

export async function GET(
  request: NextRequest,
  { params }: { params: { codefonction: string } }
) {
  try {
    const { codefonction } = params

    // Récupérer le token depuis les cookies
    const cookieStore = cookies()
    const token = cookieStore.get('keycloak-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }

    console.log('🔄 Proxying navigation request for:', codefonction)
    console.log('🌐 Backend URL:', `${BACKEND_API_URL}/servicemodules/v1/fonctions/navigation/${codefonction}`)

    // Appel vers le backend
    const response = await fetch(
      `${BACKEND_API_URL}/servicemodules/v1/fonctions/navigation/${codefonction}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      }
    )

    if (!response.ok) {
      console.error('Backend API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)

      return NextResponse.json(
        { error: `Backend API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Navigation data received from backend')

    return NextResponse.json(data)

  } catch (error) {
    console.error('Navigation proxy error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}