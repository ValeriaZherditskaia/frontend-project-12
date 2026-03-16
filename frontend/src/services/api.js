import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery,
  tagTypes: ['Channel', 'Message'],
  endpoints: builder => ({
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channel'],
    }),
    addChannel: builder.mutation({
      query: name => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Channel'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channel'],
    }),
    deleteChannel: builder.mutation({
      query: id => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channel'],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      query: ({ text, channelId, username }) => ({
        url: '/messages',
        method: 'POST',
        body: { text, channelId, username },
      }),
      invalidatesTags: ['Message'],
    }),
  }),
})

export const {
  useGetChannelsQuery,
  useAddChannelMutation,
  useRenameChannelMutation,
  useDeleteChannelMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi
