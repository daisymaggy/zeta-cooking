export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const token = cookies.get("auth_token")?.value;
        const username = cookies.get("username")?.value;

        if (!token) {
            console.log('no token')
            return new Response(JSON.stringify({ error: "Not authenticated" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { id } = await request.json();

        if (!username || !id) {
            return new Response(JSON.stringify({ error: "Username ou ID manquant" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const res = await fetch(
            `https://gourmet.cours.quimerch.com/users/${username}/favorites?recipeID=${id}`,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return new Response(JSON.stringify({ error: data.message || "Echec de l'ajout de la recette aux favoris" }), {
                status: res.status,
                headers: { "Content-Type": "application/json" }
            });
        }


        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}