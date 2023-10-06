import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/mongodb';
import { findUserByCredentials } from '../../../controllers/User';
import { verifyPassword } from '../../../lib/crypto';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Play your elo',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        await dbConnect();

        const user = await findUserByCredentials(credentials.username);
        if (!user) {
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          picture: null,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
  },
};

export default NextAuth(authOptions);
