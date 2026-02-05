import { describe, it, expect, vi, beforeEach } from 'vitest'
import { onRequest } from '../middleware'

function createMockContext(options: {
    pathname: string
    token?: string
    isPrerendered?: boolean
}) {
    const { pathname, token, isPrerendered = false } = options

    return {
        isPrerendered,
        url: new URL(`http://localhost${pathname}`),
        cookies: {
            get: (key: string) => {
                if (key === 'auth_token' && token) {
                    return { value: token }
                }
                return undefined
            },
        },
    }
}

describe('middleware', () => {
    const mockNext = vi.fn(() => Promise.resolve(new Response('OK')))

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should allow access to public routes without auth', async () => {
        const context = createMockContext({ pathname: '/' })

        const response = await onRequest(context as any, mockNext)

        expect(mockNext).toHaveBeenCalled()
    })

    it('should redirect to login when accessing protected route without token', async () => {
        const context = createMockContext({ pathname: '/favourites' })

        const response = await onRequest(context as any, mockNext)

        expect(response.status).toBe(302)
        expect(response.headers.get('Location')).toContain('/login')
    })

    it('should allow access to protected route with valid token', async () => {
        const context = createMockContext({
            pathname: '/favourites',
            token: 'valid-token'
        })

        await onRequest(context as any, mockNext)

        expect(mockNext).toHaveBeenCalled()
    })

    it('should not protect login page', async () => {
        const context = createMockContext({
            pathname: '/login'
        })

        await onRequest(context as any, mockNext)

        expect(mockNext).toHaveBeenCalled()
    })
})
