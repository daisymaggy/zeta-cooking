import { defineMiddleware } from 'astro/middleware'

export const onRequest = defineMiddleware((context, next) => {
  if (!context.isPrerendered) {
    const token = context.cookies.get('auth_token')?.value

    const protectedRoutes = ['/favourites', '/profile']

    if (protectedRoutes.some((path) => context.url.pathname.startsWith(path)) && !token) {
      return Response.redirect(new URL('/login', context.url), 302)
    }
  }

  return next()
})
