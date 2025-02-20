import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/signin',
    newUser: '/',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user;
      const isOnHome = nextUrl.pathname.startsWith("/");
      const isOnSignUp = nextUrl.pathname.startsWith("/signup");
      const isOnSignIn = nextUrl.pathname.startsWith("/signin");

      if(isSignedIn && (isOnSignIn || isOnSignUp)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if(isOnSignUp || isOnSignIn) {
        return true;
      }
      if(isOnHome) {
        if(isSignedIn) return true;
          return false;
      }
      if(isSignedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
