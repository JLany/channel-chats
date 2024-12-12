import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/features/auth/authSlice';
import channelsReducer from '@/features/channels/channelsSlice';
import messagesReducer from '@/features/messages/messagesSlice';

export const store = configureStore({
  // Pass in the root reducer setup as the `reducer` argument
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
  }
})

export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
