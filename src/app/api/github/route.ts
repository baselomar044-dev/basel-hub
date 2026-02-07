'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { action, token: clientToken, data } = await req.json()

    // Use server token from .env.local if no client token provided
    const token = clientToken || process.env.GITHUB_TOKEN

    if (!token) {
      return NextResponse.json({ error: 'GitHub token مطلوب' }, { status: 400 })
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }

    switch (action) {
      case 'list-repos': {
        const res = await fetch('https://api.github.com/user/repos?per_page=100', { headers })
        const repos = await res.json()
        return NextResponse.json({ repos })
      }

      case 'create-repo': {
        const res = await fetch('https://api.github.com/user/repos', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.name,
            description: data.description || '',
            private: data.private || false,
            auto_init: true,
          }),
        })
        const repo = await res.json()
        return NextResponse.json({ repo })
      }

      case 'push-file': {
        // Get current file SHA if exists
        let sha = undefined
        try {
          const getRes = await fetch(
            `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path}`,
            { headers }
          )
          if (getRes.ok) {
            const existing = await getRes.json()
            sha = existing.sha
          }
        } catch {}

        const res = await fetch(
          `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path}`,
          {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              message: data.message || 'Update via Basel Hub',
              content: Buffer.from(data.content).toString('base64'),
              sha,
            }),
          }
        )
        const result = await res.json()
        return NextResponse.json({ result })
      }

      case 'get-file': {
        const res = await fetch(
          `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path}`,
          { headers }
        )
        const file = await res.json()
        if (file.content) {
          file.decodedContent = Buffer.from(file.content, 'base64').toString('utf-8')
        }
        return NextResponse.json({ file })
      }

      case 'list-files': {
        const res = await fetch(
          `https://api.github.com/repos/${data.owner}/${data.repo}/contents/${data.path || ''}`,
          { headers }
        )
        const files = await res.json()
        return NextResponse.json({ files })
      }

      case 'delete-repo': {
        const res = await fetch(
          `https://api.github.com/repos/${data.owner}/${data.repo}`,
          { method: 'DELETE', headers }
        )
        return NextResponse.json({ success: res.ok })
      }

      default:
        return NextResponse.json({ error: 'Action غير معروف' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
