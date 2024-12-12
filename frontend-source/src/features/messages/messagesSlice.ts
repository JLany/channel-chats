import { RootState } from "@/app/store";
import { createAppAsyncThunk } from "@/app/withTypes";
import { database } from "@/services/firebase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import { ref, set } from "firebase/database";
import { selectCurrentUserId, selectCurrentUsername } from "../auth/authSlice";
import NotificationsHttpClient from "@/api/httpclient";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  username: string;
};

interface MessageReceivedPayload {
  messages: Message[];
  channelId: string;
}

interface NewMessagePayload {
  content: string;
  channelId: string;
  channelName: string;
}

interface MessagesState {
  [channelId: string]: Message[];
};


export const addNewMessage = createAppAsyncThunk(
  'messages/addNewMessage',
  async (newMsg: NewMessagePayload, thunkApi) => {
    const userId = selectCurrentUserId(thunkApi.getState());
    const username = selectCurrentUsername(thunkApi.getState());

    const message = {
      id: nanoid(),
      content: newMsg.content,
      userId,
      username,
      timestamp: new Date().toISOString(),
    }

    const msgRef = ref(database, 'messages/' + newMsg.channelId + '/' + message.id);
    await set(msgRef, message);

    await NotificationsHttpClient.notifyChannel({
      title: newMsg.channelName + ': New message',
      body: newMsg.content,
      channel: newMsg.channelId,
    });
  }
)


const initialState: MessagesState = {
  
};


const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageReceived: (state, action: PayloadAction<MessageReceivedPayload>) => {
      console.log(state);

      state[action.payload.channelId] =
        Object.entries(action.payload.messages)
        .map(([key, value]) => {
          return value;
      });
      console.log(state);
    },
  }
});

export default messagesSlice.reducer;

export const { messageReceived } = messagesSlice.actions;

export const selectChannelMessages = (state: RootState, channelId: string) => {
  return state.messages[channelId];
}
