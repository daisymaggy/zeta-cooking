import type { Recipe } from '../types/recipe'

const API_BASE = 'https://gourmet.cours.quimerch.com'

export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await fetch(`${API_BASE}/recipes/${id}`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Recipe not found')
  }

  return res.json()
}

export async function getRelatedRecipes(id: string): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE}/recipes/${id}/related`, {
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    return []
  }

  return res.json()
}

export async function getFavorites(username: string, token: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/users/${username}/favorites`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized')
    }
    throw new Error('Failed to get favorites')
  }

  return res.json()
}