import { compare } from 'bcrypt-ts';
import { z } from 'zod';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from '@/app/lib/data';
import { authConfig } from '@/app/(auth)/auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string() })
        .safeParse(credentials);

        if(parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const users = await getUser(email);
          if(users.length === 0) return null;
          const passwordsMatch = await compare(password, users[0].password!);
          if(!passwordsMatch) return null;
          return users[0];
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
  
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: User;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
