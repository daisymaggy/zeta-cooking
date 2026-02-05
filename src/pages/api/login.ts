import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')

    const res = await fetch('https://gourmet.cours.quimerch.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { token } = await res.json()

    const headers = new Headers()
    headers.set('Location', '/favourites')

    headers.append(
      'Set-Cookie',
      [
        `auth_token=${token}`,
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        import.meta.env.PROD ? 'Secure' : '',
        'Max-Age=86400',
      ]
        .filter(Boolean)
        .join('; '),
    )

    headers.append(
      'Set-Cookie',
      [
        `username=${encodeURIComponent(String(username))}`,
        'Path=/',
        'SameSite=Lax',
        import.meta.env.PROD ? 'Secure' : '',
        'Max-Age=86400',
      ]
        .filter(Boolean)
        .join('; '),
    )

    return new Response(null, {
      status: 302,
      headers,
    })
  } catch {
    return new Response('Server error', { status: 500 })
  }
}
