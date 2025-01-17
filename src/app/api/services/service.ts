import { authorizationCookie, userIdCookie } from "@/utils/constants";
import { HTTPStatusCodeType } from "../enums/HttpStatusCodeType";
import { Client } from "./api";
import { getCookie } from "cookies-next";
// import { redirect } from "next/navigation";

const baseUrl = "http://api.xtnginternational.com";
async function authorizedFetchFunction(
  url: RequestInfo,
  init: RequestInit
): Promise<Response> {
  const controller: AbortController = new AbortController();
  const signal: AbortSignal = controller.signal;
  const language = getCookie("content-language");
  const userId = getCookie(userIdCookie);
  const authorize = getCookie(authorizationCookie);
  const headers: A = {
    signal,
    "content-language": language,
    userId,
  };

  if (authorize) headers["Authorization"] = "Bearer " + authorize;

  init.headers = { ...init.headers, ...headers };
  return fetch(url, init);
}

const catchServiceErrors = <T>(target: T): T => {
  const prototype = Object.getPrototypeOf(target);
  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (descriptor && typeof descriptor.value === "function") {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: A[]) {
        let redirectPath: string | null = null;
        try {
          const res = await originalMethod.apply(this, args);
          return res;
        } catch (error: A) {
          redirectPath = `/${getCookie(
            "content-language"
          )}/auth/login?from=user`;
          handleServiceError(error);
        } finally {
          if (redirectPath) {
            // window.location.href = redirectPath;
          }
        }
      };
      Object.defineProperty(prototype, key, descriptor);
    }
  }
  return target;
};

const handleServiceError = (error: A) => {
  // Handle service error
  switch (error.status) {
    case HTTPStatusCodeType.UNAUTHORIZED:
      console.error("unauthorized");
      throw new Error("unauthorized");
    case HTTPStatusCodeType.BAD_REQUEST:
      throw new Error(error?.errors?.[0].message);
    case HTTPStatusCodeType.INTERNAL_SERVER_ERROR:
      localStorage.setItem("IsServerError", "true");
      dispatchEvent(new Event("storage"));
      break;
    case HTTPStatusCodeType.NOT_FOUND:
      localStorage.setItem("isShowNotFoundPage", "true");
      dispatchEvent(new Event("storage"));
      break;
    default:
      console.error(error);
      break;
  }
};

const ClientApi = catchServiceErrors(
  new Client(baseUrl, {
    fetch: authorizedFetchFunction,
  })
);

interface Service {
  client: Client;
}

export const service: Service = {
  client: ClientApi,
};
