import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import { hashPassword, verifyPassword } from '../../../lib/crypto';

export const authOptions: NextAuthOptions = {
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

        const user = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });
        if (!user) {
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

        return { id: user.id, name: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = 'admin';
      return token;
    },
  },
};

export default NextAuth(authOptions);
