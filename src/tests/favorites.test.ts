import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as addFavorite } from '../pages/api/favorites/addFavorite.json'
import { DELETE as removeFavorite } from '../pages/api/favorites/removeFavorite.json'

const mockFetch = vi.fn()
global.fetch = mockFetch

function createMockCookies(values: Record<string, string | undefined>) {
    return {
        get: (key: string) => {
            const value = values[key]
            return value ? { value } : undefined
        },
    }
}

function createMockRequest(body: any) {
    return {
        json: () => Promise.resolve(body),
    } as unknown as Request
}

describe('favorites API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('addFavorite', () => {
        it('should return 401 when not authenticated', async () => {
            const cookies = createMockCookies({ auth_token: undefined, username: 'user' })
            const request = createMockRequest({ id: '123' })

            const response = await addFavorite({ request, cookies } as any)

            expect(response.status).toBe(401)
        })

        it('should return 400 when id is missing', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'user' })
            const request = createMockRequest({})

            const response = await addFavorite({ request, cookies } as any)

            expect(response.status).toBe(400)
        })

        it('should add favorite successfully', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'testuser' })
            const request = createMockRequest({ id: '123' })

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })

            const response = await addFavorite({ request, cookies } as any)

            expect(response.status).toBe(200)
            expect(mockFetch).toHaveBeenCalledWith(
                'https://gourmet.cours.quimerch.com/users/testuser/favorites?recipeID=123',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer token',
                    },
                }
            )
        })

        it('should return error when external API fails', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'testuser' })
            const request = createMockRequest({ id: '123' })

            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                json: () => Promise.resolve({ message: 'Already exists' }),
            })

            const response = await addFavorite({ request, cookies } as any)

            expect(response.status).toBe(409)
            const json = await response.json()
            expect(json.error).toBe('Already exists')
        })
    })

    describe('removeFavorite', () => {
        it('should return 401 when not authenticated', async () => {
            const cookies = createMockCookies({ auth_token: undefined, username: 'user' })
            const request = createMockRequest({ id: '123' })

            const response = await removeFavorite({ request, cookies } as any)

            expect(response.status).toBe(401)
        })

        it('should return 400 when id is missing', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'user' })
            const request = createMockRequest({})

            const response = await removeFavorite({ request, cookies } as any)

            expect(response.status).toBe(400)
        })

        it('should remove favorite successfully', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'testuser' })
            const request = createMockRequest({ id: '123' })

            mockFetch.mockResolvedValueOnce({
                ok: true,
            })

            const response = await removeFavorite({ request, cookies } as any)

            expect(response.status).toBe(200)
            const json = await response.json()
            expect(json.success).toBe(true)
        })

        it('should return error when external API fails', async () => {
            const cookies = createMockCookies({ auth_token: 'token', username: 'testuser' })
            const request = createMockRequest({ id: '123' })

            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            })

            const response = await removeFavorite({ request, cookies } as any)

            expect(response.status).toBe(404)
        })
    })
})
