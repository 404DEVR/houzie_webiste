// auth.ts
import { DefaultSession, NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AUTH_API_URL } from '@/constant/authUrl';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: User & DefaultSession['user'];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    id: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User; // Add user object to JWT
  }
}

// API response types
interface VerifyLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: 'User ID', type: 'text' },
        otp: { label: 'OTP', type: 'text', placeholder: 'Enter your OTP' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.userId || !credentials?.otp) {
          throw new Error('Please enter all required fields');
        }

        try {
          const res = await fetch(`${AUTH_API_URL}/auth/login/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: credentials.userId,
              otp: credentials.otp,
            }),
          });

          const data = (await res.json()) as VerifyLoginResponse;

          if (!res.ok) {
            throw new Error(
              data.message || `Error ${res.status}: Authentication failed`
            );
          }

          const { accessToken, refreshToken, user } = data;

          // Return the full user object
          return {
            ...user,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : 'Authentication failed'
          );
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.user?.accessToken,
        user: token.user as User,
      };
    },
  },
};
