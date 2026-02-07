'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { audio, language = 'ar' } = await request.json()
    
    if (!audio) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
    }

    // Try Groq Whisper first (fast and free)
    const groqKey = process.env.GROQ_API_KEY
    
    if (groqKey) {
      try {
        // Convert base64 to blob
        const audioBuffer = Buffer.from(audio, 'base64')
        
        // Create form data
        const formData = new FormData()
        const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' })
        formData.append('file', audioBlob, 'audio.webm')
        formData.append('model', 'whisper-large-v3')
        formData.append('language', language === 'ar' ? 'ar' : 'en')
        formData.append('response_format', 'json')
        
        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
          },
          body: formData,
        })
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({ 
            text: data.text,
            language: data.language || language,
            source: 'groq-whisper'
          })
        }
      } catch (e) {
        console.error('Groq Whisper error:', e)
      }
    }

    // Fallback to Google Speech-to-Text
    const googleKey = process.env.GOOGLE_AI_API_KEY
    
    if (googleKey) {
      try {
        const response = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${googleKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              config: {
                encoding: 'WEBM_OPUS',
                sampleRateHertz: 16000,
                languageCode: language === 'ar' ? 'ar-SA' : 'en-US',
                enableAutomaticPunctuation: true,
              },
              audio: {
                content: audio,
              },
            }),
          }
        )
        
        if (response.ok) {
          const data = await response.json()
          const transcript = data.results?.[0]?.alternatives?.[0]?.transcript
          
          if (transcript) {
            return NextResponse.json({ 
              text: transcript,
              language: language,
              source: 'google-speech'
            })
          }
        }
      } catch (e) {
        console.error('Google Speech error:', e)
      }
    }

    // If all APIs fail, return error with hint
    return NextResponse.json({ 
      error: 'Transcription failed',
      hint: 'Try using browser speech recognition',
      text: null
    }, { status: 500 })
    
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
