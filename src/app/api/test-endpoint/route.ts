import { NextRequest, NextResponse } from 'next/server'

// ============================================
// API TESTER PROXY ENDPOINT
// Forwards requests to external APIs to avoid CORS
// ============================================

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body } = await request.json()

    if (!url) {
      return NextResponse.json({ 
        success: false, 
        status: 400, 
        statusText: 'Bad Request',
        data: { error: 'URL is required' } 
      })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ 
        success: false, 
        status: 400, 
        statusText: 'Bad Request',
        data: { error: 'Invalid URL format' } 
      })
    }

    const fetchOptions: RequestInit = {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
    }

    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    // Make the request
    const startTime = Date.now()
    const response = await fetch(url, fetchOptions)
    const endTime = Date.now()

    // Get response headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Try to parse as JSON, fallback to text
    let data
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch {
        data = await response.text()
      }
    } else {
      data = await response.text()
      // Try to parse as JSON anyway
      try {
        data = JSON.parse(data)
      } catch {
        // Keep as text
      }
    }

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      time: endTime - startTime,
      data,
      headers: responseHeaders
    })

  } catch (error: any) {
    console.error('API Test Error:', error)
    
    return NextResponse.json({
      success: false,
      status: 0,
      statusText: 'Network Error',
      data: { 
        error: error.message || 'Failed to connect to the API',
        details: error.cause?.message || 'Check if the URL is correct and accessible'
      },
      headers: {}
    })
  }
}
