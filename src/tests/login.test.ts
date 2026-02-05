import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../pages/api/login'

const mockFetch = vi.fn()
global.fetch = mockFetch

vi.stubGlobal('import', {
  meta: {
    env: {
      PROD: false,
    },
  },
})

function createMockRequest(formDataObj: Record<string, string>) {
  const formData = new Map(Object.entries(formDataObj))
  return {
    formData: () =>
      Promise.resolve({
        get: (key: string) => formData.get(key) ?? null,
      }),
  } as unknown as Request
}

describe('login API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 302 redirect on successful login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token-123' }),
    })

    const mockRequest = createMockRequest({
      username: 'testuser',
      password: 'testpass',
    })

    const response = await POST({ request: mockRequest } as any)

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/favourites')
  })

  it('should return 302 redirect on invalid credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    })

    const mockRequest = createMockRequest({
      username: 'wronguser',
      password: 'wrongpass',
    })

    const response = await POST({ request: mockRequest } as any)

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/login?error=invalid_credentials')
  })

  it('should return 302 redirect on server error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const mockRequest = createMockRequest({
      username: 'testuser',
      password: 'testpass',
    })

    const response = await POST({ request: mockRequest } as any)

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/login?error=server_error')
  })

  it('should call external API with correct payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'token' }),
    })

    const mockRequest = createMockRequest({
      username: 'myuser',
      password: 'mypass',
    })

    await POST({ request: mockRequest } as any)

    expect(mockFetch).toHaveBeenCalledWith('https://gourmet.cours.quimerch.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'myuser', password: 'mypass' }),
    })
  })
})
