export const prerender = false;

import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ request, cookies }) => {
    try {
        const token = cookies.get("auth_token")?.value;
        const username = cookies.get("username")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Non authentifié" }), {
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
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!res.ok) {
            return new Response(JSON.stringify({ error: "Echec de la suppression de la recette des favoris" }), {
                status: res.status,
                headers: { "Content-Type": "application/json" }
            });
        }


        return new Response(
            JSON.stringify({ success: true }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: "Erreur serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}