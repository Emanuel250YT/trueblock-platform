import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://trust.cloudycoding.com'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "API info retrieval failed", message: `External API returned ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "API info retrieval failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
