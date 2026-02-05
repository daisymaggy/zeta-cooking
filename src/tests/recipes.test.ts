import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getRecipeById, getRelatedRecipes, getFavorites } from '../lib/recipes'
import type { Recipe } from '../types/recipe'

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockRecipe: Recipe = {
    calories: 500,
    category: 'main',
    cook_time: 30,
    cost: 10,
    created_at: '2024-01-01',
    created_by: 'chef',
    description: 'Test recipe',
    disclaimer: 'Test disclaimer',
    id: '123',
    image_url: 'https://example.com/image.jpg',
    instructions: 'Test instructions',
    name: 'Test Recipe',
    prep_time: 15,
    published: true,
    servings: 4,
    when_to_eat: 'dinner',
}

describe('recipes.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.resetAllMocks()
    })

    describe('getRecipeById', () => {
        it('should return a recipe when found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockRecipe),
            })

            const result = await getRecipeById('123')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://gourmet.cours.quimerch.com/recipes/123',
                { headers: { Accept: 'application/json' } }
            )
            expect(result).toEqual(mockRecipe)
        })

        it('should throw error when recipe not found', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
            })

            await expect(getRecipeById('999')).rejects.toThrow('Recipe not found')
        })
    })

    describe('getRelatedRecipes', () => {
        it('should return related recipes when found', async () => {
            const relatedRecipes = [mockRecipe, { ...mockRecipe, id: '456', name: 'Related Recipe' }]
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(relatedRecipes),
            })

            const result = await getRelatedRecipes('123')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://gourmet.cours.quimerch.com/recipes/123/related',
                { headers: { Accept: 'application/json' } }
            )
            expect(result).toEqual(relatedRecipes)
        })

        it('should return empty array when request fails', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            })

            const result = await getRelatedRecipes('123')

            expect(result).toEqual([])
        })
    })

    describe('getFavorites', () => {
        it('should return favorites when authenticated', async () => {
            const favorites = [mockRecipe]
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(favorites),
            })

            const result = await getFavorites('testuser', 'valid-token')

            expect(mockFetch).toHaveBeenCalledWith(
                'https://gourmet.cours.quimerch.com/users/testuser/favorites',
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer valid-token',
                    },
                }
            )
            expect(result).toEqual(favorites)
        })

        it('should throw Unauthorized error when token is invalid', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
            })

            await expect(getFavorites('testuser', 'invalid-token')).rejects.toThrow('Unauthorized')
        })

        it('should throw generic error for other failures', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
            })

            await expect(getFavorites('testuser', 'token')).rejects.toThrow('Failed to get favorites')
        })
    })
})
