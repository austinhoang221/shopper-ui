import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { service } from "./app/api/services/service";
import {
  UserLoginRequest,
  UserLoginWithGoogleRequest,
} from "./app/api/services/api";
import Credentials from "next-auth/providers/credentials";
import { authorizationCookie, userIdCookie } from "./utils/constants";

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

        cookies().set({
          name: authorizationCookie,
          value: response?.accessToken ?? "",
          expires: expires,
          path: "/",
        });
        return (response as User) ?? null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      try {
        if (account?.id_token) {
          const response = await service.client.loginWithGoogle(
            UserLoginWithGoogleRequest.fromJS({
              id: cookies().get(userIdCookie)?.value,
              idToken: account?.id_token,
            })
          );

          if (response?.id) {
            token.id = response.id;
            token.name = response.name;
            token.username = response.username;
            token.email = response.email;
            token.phoneNumber = response.phoneNumber;
            token.photoUrl = response.photoUrl;
            const expires = new Date();

            expires.setDate(expires.getDate() + 7);
            cookies().set({
              name: userIdCookie,
              value: response?.id,
              expires: expires,
              path: "/",
            });

            cookies().set({
              name: authorizationCookie,
              value: response?.accessToken ?? "",
              expires: expires,
              path: "/",
            });
          }
        } else {
          if (user?.id) {
            token.id = user?.id;
            token.name = user?.name;
            token.username = user?.username;
            token.email = user?.email;
            token.phoneNumber = user?.phoneNumber;
            token.photoUrl = user?.photoUrl ? user?.photoUrl : user?.image;
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
      if (trigger == "update") {
        if (session?.user) {
          token.email = session.user.email;
          token.name = session.user.name;
          token.username = session.user.username;
        }
      }
      return token;
    },
    signIn({}) {
      return true;
    },

    session({ session, token, user }) {
      if (token && session.user) {
        session.user.name = token.name;
        session.user.username = (token.username as string) ?? "";
        session.user.email = token.email ?? "";
        session.user.phoneNumber = (token.phoneNumber as string) ?? "";
        session.user.photoUrl =
          ((token.photoUrl as string)
            ? (token.photoUrl as string)
            : user?.image) ?? "";
      }
      if (user) {
        console.log(user);
        session.user = user;
      }
      return session;
    },
  },
});
