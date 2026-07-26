import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { STORAGE_KEY } from "../auth/AuthContext";

const baseURL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_BASE_URL;;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}`,
  credentials: "include",
});

const SESSION_EXPIRED_PATH = "/session-expired";

const baseQueryWithSessionCheck: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiInstance, extraOptions) => {
  const result = await rawBaseQuery(args, apiInstance, extraOptions);

  if (result.error?.status === 401) {
    // Login session has expired — clear auth state and route the user to
    // the session-expired screen.
    sessionStorage.removeItem(STORAGE_KEY);
    if (window.location.pathname !== SESSION_EXPIRED_PATH) {
      window.location.assign(SESSION_EXPIRED_PATH);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithSessionCheck,
  tagTypes: ["Account","CreateSession","EndSession","Cards","OpenCard","CloseCard"] as const,
  endpoints: () => ({}),
});
