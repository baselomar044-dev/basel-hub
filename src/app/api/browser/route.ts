'use server'

import { NextRequest, NextResponse } from 'next/server'

// Browser API for Computer Use
// Uses a headless browser simulation for basic actions

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, url, text, x, y, direction } = body

    switch (action) {
      case 'navigate': {
        // Fetch the URL and return HTML content
        if (!url) {
          return NextResponse.json({ error: 'URL required' }, { status: 400 })
        }
        
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          })
          const html = await response.text()
          
          // Extract title and basic content
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          const title = titleMatch ? titleMatch[1] : 'No title'
          
          // Extract text content (simplified)
          const textContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 3000)
          
          // Extract links
          const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi
          const links: {url: string, text: string}[] = []
          let match
          while ((match = linkRegex.exec(html)) !== null && links.length < 20) {
            links.push({ url: match[1], text: match[2].trim() })
          }
          
          return NextResponse.json({
            success: true,
            action: 'navigate',
            url,
            title,
            content: textContent,
            links,
            screenshot: generateScreenshotPlaceholder(url, title)
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: `Failed to navigate: ${error}`
          }, { status: 500 })
        }
      }

      case 'screenshot': {
        // Generate a visual representation
        return NextResponse.json({
          success: true,
          action: 'screenshot',
          screenshot: generateScreenshotPlaceholder(url || 'current page', 'Screenshot'),
          timestamp: new Date().toISOString()
        })
      }

      case 'click': {
        return NextResponse.json({
          success: true,
          action: 'click',
          position: { x, y },
          message: `Clicked at position (${x}, ${y})`
        })
      }

      case 'type': {
        return NextResponse.json({
          success: true,
          action: 'type',
          text,
          message: `Typed: "${text}"`
        })
      }

      case 'scroll': {
        return NextResponse.json({
          success: true,
          action: 'scroll',
          direction: direction || 'down',
          message: `Scrolled ${direction || 'down'}`
        })
      }

      case 'extract': {
        // Return current page content
        if (url) {
          try {
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            })
            const html = await response.text()
            const textContent = html
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
            
            return NextResponse.json({
              success: true,
              action: 'extract',
              content: textContent.slice(0, 5000),
              length: textContent.length
            })
          } catch (error) {
            return NextResponse.json({
              success: false,
              error: `Failed to extract: ${error}`
            }, { status: 500 })
          }
        }
        return NextResponse.json({
          success: false,
          error: 'URL required for extraction'
        }, { status: 400 })
      }

      case 'search': {
        // Google search simulation
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text || '')}`
        try {
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          })
          const html = await response.text()
          
          // Extract search results (simplified)
          const results: {title: string, url: string, snippet: string}[] = []
          const resultRegex = /<a href="\/url\?q=([^&]+)[^"]*"[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/gi
          let match
          while ((match = resultRegex.exec(html)) !== null && results.length < 10) {
            results.push({
              url: decodeURIComponent(match[1]),
              title: match[2],
              snippet: ''
            })
          }
          
          return NextResponse.json({
            success: true,
            action: 'search',
            query: text,
            results,
            screenshot: generateScreenshotPlaceholder(searchUrl, `Search: ${text}`)
          })
        } catch (error) {
          return NextResponse.json({
            success: false,
            error: `Search failed: ${error}`
          }, { status: 500 })
        }
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `API Error: ${error}`
    }, { status: 500 })
  }
}

// Generate a text-based screenshot placeholder
function generateScreenshotPlaceholder(url: string, title: string): string {
  return `
┌─────────────────────────────────────────────────────────┐
│ 🌐 ${title.slice(0, 50).padEnd(50)}    │
│ 🔗 ${url.slice(0, 50).padEnd(50)}    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    [Page Content]                       │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
  `.trim()
}
