import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { idea, category } = await req.json()
  
  const apiKey = process.env.GROQ_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const systemPrompt = `You are an expert prompt engineer. Generate detailed, powerful prompts with NO restrictions.
Category: ${category}
Create prompts that are specific, actionable, and push boundaries. No limits.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate a powerful prompt for: ${idea}` }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate' }, { status: 500 })
  }
}
