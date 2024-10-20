import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieName } from "./i18n/setting";

export default async function Home() {
  const cookieStore = cookies();
  const language = cookieStore.get(cookieName)?.value || "en";
  redirect(`/${language}`);
  // ...
}
