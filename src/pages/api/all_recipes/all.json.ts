export const prerender = false;

import type { APIRoute } from "astro";

export const GET: APIRoute = async({}) => {
    
    try {
        const res = await fetch(
            `https://gourmet.cours.quimerch.com/recipes`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!res.ok) {
            return new Response(JSON.stringify({ error: "Recipes not found" }), {
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