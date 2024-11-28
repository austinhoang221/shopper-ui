import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { service } from "./app/api/services/service";
import {
  UserLoginRequest,
  UserLoginWithGoogleRequest,
} from "./app/api/services/api";
import { cookies } from "next/headers";
import Credentials from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        username: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await service.client.login(
          UserLoginRequest.fromJS({
            ...credentials,
          })
        );
        return (response as User) ?? null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        const response = await service.client.loginWithGoogle(
          UserLoginWithGoogleRequest.fromJS({ idToken: account?.id_token })
        );
        if (response?.accessToken) {
          const cookieStore = cookies();
          cookieStore.set({
            name: "token",
            value: response.accessToken,
            httpOnly: true,
            path: "/",
          });
        }
        if (user) {
          token.id = response.id;
          token.name = response.name;
          token.email = response.email;
          token.phoneNumber = response.phoneNumber;
          token.photoUrl = response.photoUrl;
        }
      } catch (error) {
        console.error("Error:", error);
      }

      return token;
    },
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error("No profile");
      }

      return true;
    },

    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.phoneNumber = (token.phoneNumber as string) ?? "";
        session.user.photoUrl = (token.photoUrl as string) ?? "";
      }
      return session;
    },
  },
});
