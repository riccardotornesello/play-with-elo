import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import { verifyPassword } from '../../../lib/crypto';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Play your elo',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username, isAdmin: true },
        });
        if (!user || !user.passwordHash || !user.passwordSalt) {
          return null;
        }

        const isValid = await verifyPassword(
          user.passwordHash,
          user.passwordSalt,
          credentials.password,
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
          isAdmin: user.isAdmin,
          isPlayer: user.isPlayer,
          email: null,
          picture: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
};

export default NextAuth(authOptions);
