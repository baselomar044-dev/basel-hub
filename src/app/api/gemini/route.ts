'use server'

import { NextRequest, NextResponse } from 'next/server'

// Gemini API with Groq fallback
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroqFallback(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'أنت مساعد ذكي. أجب بنفس لغة السؤال.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    throw new Error('Groq API error')
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'الرجاء إدخال نص' }, { status: 400 })
    }

    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt
    const googleKey = process.env.GOOGLE_AI_KEY
    const groqKey = process.env.GROQ_API_KEY

    let responseText = ''
    let usedFallback = false

    // Try Gemini first
    if (googleKey) {
      try {
        responseText = await callGemini(fullPrompt, googleKey)
      } catch (e) {
        // Gemini failed, try Groq fallback
        if (groqKey) {
          responseText = await callGroqFallback(fullPrompt, groqKey)
          usedFallback = true
        } else {
          throw e
        }
      }
    } else if (groqKey) {
      // No Gemini key, use Groq directly
      responseText = await callGroqFallback(fullPrompt, groqKey)
      usedFallback = true
    } else {
      return NextResponse.json({ error: 'No API keys configured' }, { status: 500 })
    }

    return NextResponse.json({
      response: responseText,
      model: usedFallback ? 'groq-fallback' : 'gemini-2.0-flash'
    })
  } catch (error: any) {
    console.error('Gemini error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
