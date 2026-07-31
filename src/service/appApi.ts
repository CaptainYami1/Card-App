import { api } from "./client";
import type { Card } from "../pages/Home/types";

type GetCardsResponse = Card[] | { cards?: Card[]; data?: Card[] };

type OpenCardWindowResponse = { activeWindowExpiresAt: string | null };

type OpenCardWindowArgs = {
  cardId: string;
  durationSeconds: number;
  verificationId?: string;
};

export const appApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccountName: builder.mutation({
      query: (body) => ({
        url: `accounts/validate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Account"],
    }),
    createSession: builder.mutation({
      query: (body) => ({
        url: `sessions`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["CreateSession"],
    }),
    endSession: builder.mutation({
      query: (body) => ({
        url: `sessions/complete`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EndSession"],
    }),
    getCards: builder.query<GetCardsResponse, string | undefined>({
      query: (verificationId) => ({
        url: `cards`,
        method: "GET",
        headers: verificationId
          ? { "X-Verification-Id": verificationId }
          : undefined,
      }),
      providesTags: ["Cards"],
    }),
    openCardWindow: builder.mutation<OpenCardWindowResponse, OpenCardWindowArgs>({
      query: ({ cardId, durationSeconds, verificationId }) => ({
        url: `cards/${cardId}/window/open`,
        method: "POST",
        body: { durationSeconds },
        headers: verificationId
          ? { "X-Verification-Id": verificationId }
          : undefined,
      }),
      invalidatesTags: ["OpenCard"],
    }),
    closeCardWindow: builder.mutation({
      query: ({ cardId, verificationId }) => ({
        url: `cards/${cardId}/window/close`,
        method: "POST",
        headers: verificationId
          ? { "X-Verification-Id": verificationId }
          : undefined,
      }),
      invalidatesTags: ["CloseCard"],
    }),
  }),
});

export const {
  useGetAccountNameMutation,
  useCreateSessionMutation,
  useEndSessionMutation,
  useGetCardsQuery,
  useOpenCardWindowMutation,
  useCloseCardWindowMutation,
} = appApi;
