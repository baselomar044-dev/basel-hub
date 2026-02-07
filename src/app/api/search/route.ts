'use server'

import { NextRequest, NextResponse } from 'next/server'

const TAVILY_API_URL = 'https://api.tavily.com/search'

export async function POST(req: NextRequest) {
  try {
    const { query, searchDepth = 'advanced', maxResults = 5 } = await req.json()

    const apiKey = process.env.TAVILY_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TAVILY_API_KEY غير موجود' },
        { status: 500 }
      )
    }

    if (!query) {
      return NextResponse.json(
        { error: 'الرجاء إدخال نص للبحث' },
        { status: 400 }
      )
    }

    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: searchDepth, // 'basic' or 'advanced'
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
        include_images: false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavily API error: ${error}`)
    }

    const data = await response.json()

    return NextResponse.json({
      answer: data.answer,
      results: data.results?.map((r: any) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
      query: data.query,
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
