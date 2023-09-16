import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/mongodb';
import { authenticateUser } from '../../../models/User';
import { bcryptCompare } from '../../../lib/crypto';

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

        console.log('1')

        await dbConnect();

        const user = await authenticateUser({ username: credentials.username });
        if (!user) {
          return null;
        }

        console.log('user', user)

        const isValid = await bcryptCompare(
          credentials.password,
          user.password,
        );
        console.log('isValid', isValid)
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.username,
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
