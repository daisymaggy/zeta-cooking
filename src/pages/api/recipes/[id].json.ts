export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async({ params }) => {
    const { id } = params;
    
    if (!id) {
        return new Response(JSON.stringify({ error: "ID manquant" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    try {
        const res = await fetch(
            `https://gourmet.cours.quimerch.com/recipes/${id}`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!res.ok) {
            return new Response(JSON.stringify({ error: "Recette non trouvée" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const data = await res.json();
        
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