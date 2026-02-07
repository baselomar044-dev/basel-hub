'use server'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { action, token: clientToken, data } = await req.json()

    // Use server token from .env.local if no client token provided
    const token = clientToken || process.env.VERCEL_TOKEN

    if (!token) {
      return NextResponse.json({ error: 'Vercel token مطلوب' }, { status: 400 })
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    const baseUrl = 'https://api.vercel.com'

    switch (action) {
      case 'list-projects': {
        const res = await fetch(`${baseUrl}/v9/projects`, { headers })
        const projects = await res.json()
        return NextResponse.json({ projects: projects.projects || [] })
      }

      case 'get-project': {
        const res = await fetch(`${baseUrl}/v9/projects/${data.projectId}`, { headers })
        const project = await res.json()
        return NextResponse.json({ project })
      }

      case 'list-deployments': {
        const url = data.projectId 
          ? `${baseUrl}/v6/deployments?projectId=${data.projectId}&limit=20`
          : `${baseUrl}/v6/deployments?limit=20`
        const res = await fetch(url, { headers })
        const deployments = await res.json()
        return NextResponse.json({ deployments: deployments.deployments || [] })
      }

      case 'get-deployment': {
        const res = await fetch(`${baseUrl}/v13/deployments/${data.deploymentId}`, { headers })
        const deployment = await res.json()
        return NextResponse.json({ deployment })
      }

      case 'create-project': {
        const res = await fetch(`${baseUrl}/v10/projects`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.name,
            framework: data.framework || 'nextjs',
            gitRepository: data.gitRepo ? {
              repo: data.gitRepo,
              type: 'github',
            } : undefined,
          }),
        })
        const project = await res.json()
        return NextResponse.json({ project })
      }

      case 'deploy-from-github': {
        // Link GitHub repo and trigger deploy
        const res = await fetch(`${baseUrl}/v10/projects`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.projectName,
            framework: 'nextjs',
            gitRepository: {
              repo: data.repo, // format: "owner/repo"
              type: 'github',
            },
          }),
        })
        const project = await res.json()
        return NextResponse.json({ project, message: 'تم ربط المشروع بـ GitHub. الـ deploy سيبدأ تلقائياً.' })
      }

      case 'set-env-vars': {
        const envVars = data.envVars.map((env: any) => ({
          key: env.key,
          value: env.value,
          target: ['production', 'preview', 'development'],
          type: 'encrypted',
        }))
        
        const res = await fetch(`${baseUrl}/v10/projects/${data.projectId}/env`, {
          method: 'POST',
          headers,
          body: JSON.stringify(envVars),
        })
        const result = await res.json()
        return NextResponse.json({ result })
      }

      case 'get-domains': {
        const res = await fetch(`${baseUrl}/v9/projects/${data.projectId}/domains`, { headers })
        const domains = await res.json()
        return NextResponse.json({ domains: domains.domains || [] })
      }

      case 'delete-project': {
        const res = await fetch(`${baseUrl}/v9/projects/${data.projectId}`, {
          method: 'DELETE',
          headers,
        })
        return NextResponse.json({ success: res.ok })
      }

      case 'redeploy': {
        const res = await fetch(`${baseUrl}/v13/deployments`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: data.projectName,
            target: 'production',
          }),
        })
        const deployment = await res.json()
        return NextResponse.json({ deployment })
      }

      default:
        return NextResponse.json({ error: 'Action غير معروف' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
