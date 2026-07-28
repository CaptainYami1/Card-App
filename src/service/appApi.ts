import { api } from "./client";

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
    getCards: builder.query({
      query: (params) => ({
        url: `cards`,
        method: "GET",
        params,
      }),
      providesTags: ["Cards"],
    }),
    openCardWindow: builder.mutation({
      query: ({ cardId, durationSeconds }) => ({
        url: `cards/${cardId}/window/open`,
        method: "POST",
        body: { durationSeconds },
      }),
      invalidatesTags: ["OpenCard"],
    }),
    closeCardWindow: builder.mutation({
      query: (cardId) => ({
        url: `cards/${cardId}/window/close`,
        method: "POST",
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
