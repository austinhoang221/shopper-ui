import { userIdCookie } from "@/utils/constants";
import { HTTPStatusCodeType } from "../enums/HttpStatusCodeType";
import { Client } from "./api";
import { getCookie } from "cookies-next";

const baseUrl = "http://localhost:5283";
async function authorizedFetchFunction(
  url: RequestInfo,
  init: RequestInit
): Promise<Response> {
  const controller: AbortController = new AbortController();
  const signal: AbortSignal = controller.signal;
  const language = getCookie("content-language");
  const userId = getCookie(userIdCookie);
  const headers = {
    signal,
    "content-language": language,
    userId,
  };

  init.headers = { ...init.headers, ...(headers as A) };
  return fetch(url, init);
}

const catchServiceErrors = <T>(target: T): T => {
  const prototype = Object.getPrototypeOf(target);
  for (const key of Object.getOwnPropertyNames(prototype)) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (descriptor && typeof descriptor.value === "function") {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: A[]) {
        try {
          const res = await originalMethod.apply(this, args);
          return res;
        } catch (error: A) {
          handleServiceError(error);
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
