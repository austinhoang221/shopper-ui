import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { service } from "./app/api/services/service";
import {
  UserLoginRequest,
  UserLoginWithGoogleRequest,
} from "./app/api/services/api";
import Credentials from "next-auth/providers/credentials";
import { userIdCookie } from "./utils/constants";

import { cookies } from "next/headers";
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
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        cookies().set({
          name: userIdCookie,
          value: response?.id ?? "",
          expires: expires,
          path: "/",
        });
        return (response as User) ?? null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      try {
        if (account?.id_token) {
          const response = await service.client.loginWithGoogle(
            UserLoginWithGoogleRequest.fromJS({ idToken: account?.id_token })
          );
          token.id = response.id;
          token.name = response.name;
          token.email = response.email;
          token.phoneNumber = response.phoneNumber;
          token.photoUrl = response.photoUrl;
          if (response?.id) {
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);
            cookies().set({
              name: userIdCookie,
              value: response?.id,
              expires: expires,
              path: "/",
            });
          }
        } else {
          if (user?.id) {
            token.id = user?.id;
            token.name = user?.name;
            token.email = user?.email;
            token.phoneNumber = user?.phoneNumber;
            token.photoUrl = user?.photoUrl;
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }

      return token;
    },
    signIn({}) {
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