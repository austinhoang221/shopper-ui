// nextauth.d.ts
import { DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  username: string;
  phoneNumber: string;
  photoUrl: string;
  accessToken: string;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
  interface Crea {
    user?: User;
  }
}
