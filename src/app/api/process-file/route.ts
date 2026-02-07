'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 })
    }

    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    let content = ''
    let extractedData: any = null

    // Text-based files
    if (
      fileType.includes('text') ||
      fileType.includes('json') ||
      fileType.includes('javascript') ||
      fileType.includes('typescript') ||
      fileType.includes('xml') ||
      fileType.includes('html') ||
      fileType.includes('css') ||
      fileType.includes('markdown') ||
      fileName.endsWith('.md') ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.json') ||
      fileName.endsWith('.js') ||
      fileName.endsWith('.ts') ||
      fileName.endsWith('.tsx') ||
      fileName.endsWith('.jsx') ||
      fileName.endsWith('.css') ||
      fileName.endsWith('.html') ||
      fileName.endsWith('.xml') ||
      fileName.endsWith('.yaml') ||
      fileName.endsWith('.yml') ||
      fileName.endsWith('.env') ||
      fileName.endsWith('.sh') ||
      fileName.endsWith('.py') ||
      fileName.endsWith('.sql')
    ) {
      content = await file.text()
      extractedData = { type: 'text', lines: content.split('\n').length }
    }
    
    // CSV files
    else if (fileType.includes('csv') || fileName.endsWith('.csv')) {
      content = await file.text()
      const lines = content.split('\n')
      const headers = lines[0]?.split(',') || []
      extractedData = {
        type: 'csv',
        rows: lines.length - 1,
        columns: headers.length,
        headers: headers.slice(0, 10),
      }
    }
    
    // JSON files
    else if (fileType.includes('json') || fileName.endsWith('.json')) {
      content = await file.text()
      try {
        const parsed = JSON.parse(content)
        extractedData = {
          type: 'json',
          structure: Array.isArray(parsed) ? 'array' : 'object',
          keys: Array.isArray(parsed) ? parsed.length : Object.keys(parsed).slice(0, 20),
        }
      } catch {
        extractedData = { type: 'json', error: 'Invalid JSON' }
      }
    }

    // PDF - extract text (basic)
    else if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      const buffer = await file.arrayBuffer()
      // Basic PDF text extraction (will be enhanced with library)
      content = '[PDF file uploaded - محتوى PDF]'
      extractedData = {
        type: 'pdf',
        size: fileSize,
        note: 'تم رفع ملف PDF. أخبرني ماذا تريد أن أفعل به.',
      }
    }

    // Images
    else if (fileType.includes('image')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      content = `[Image: ${fileName}]`
      extractedData = {
        type: 'image',
        format: fileType,
        size: fileSize,
        base64: `data:${fileType};base64,${base64}`,
      }
    }

    // Audio
    else if (fileType.includes('audio')) {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      content = `[Audio: ${fileName}]`
      extractedData = {
        type: 'audio',
        format: fileType,
        size: fileSize,
        base64: `data:${fileType};base64,${base64}`,
      }
    }

    // Video
    else if (fileType.includes('video')) {
      content = `[Video: ${fileName}]`
      extractedData = {
        type: 'video',
        format: fileType,
        size: fileSize,
        note: 'تم رفع فيديو. أخبرني ماذا تريد أن أفعل به.',
      }
    }

    // Archives
    else if (
      fileType.includes('zip') ||
      fileType.includes('rar') ||
      fileType.includes('tar') ||
      fileType.includes('gzip')
    ) {
      content = `[Archive: ${fileName}]`
      extractedData = {
        type: 'archive',
        format: fileType,
        size: fileSize,
        note: 'تم رفع ملف مضغوط.',
      }
    }

    // Unknown
    else {
      const buffer = await file.arrayBuffer()
      // Try to read as text
      try {
        content = new TextDecoder().decode(buffer)
        extractedData = { type: 'unknown-text', size: fileSize }
      } catch {
        content = `[Binary file: ${fileName}]`
        extractedData = { type: 'binary', size: fileSize }
      }
    }

    return NextResponse.json({
      success: true,
      fileName,
      fileType,
      fileSize,
      content: content.slice(0, 50000), // Limit content size
      extractedData,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Note: Next.js App Router handles FormData automatically - no config needed
