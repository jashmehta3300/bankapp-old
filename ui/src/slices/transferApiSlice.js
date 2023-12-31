import { apiSlice } from "./usersApiSlice";
const transferUrl = import.meta.env.VITE_TRANSFER_URL;
const zelleUrl = import.meta.env.VITE_ZELLE_URL;

export const transferApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    postTransfer: builder.mutation({
      query: (data) => ({ 
        url: `${transferUrl}`, 
        method: "POST", 
        body: data 
      }),
    }),
    postTransferExternal: builder.mutation({
      query: (data) => ({
        url: `${zelleUrl}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePostTransferMutation, usePostTransferExternalMutation } = transferApiSlice;
