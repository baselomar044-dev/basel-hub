import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as Blob
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // Convert blob to proper format for Groq Whisper
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create FormData for Groq API
    const groqFormData = new FormData()
    const audioBlob = new Blob([buffer], { type: 'audio/webm' })
    groqFormData.append('file', audioBlob, 'audio.webm')
    groqFormData.append('model', 'whisper-large-v3')
    groqFormData.append('response_format', 'json')
    groqFormData.append('language', 'en')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: groqFormData
    })

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || 'Transcription failed')
    }

    return NextResponse.json({ text: data.text })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Transcription failed' },
      { status: 500 }
    )
  }
}
