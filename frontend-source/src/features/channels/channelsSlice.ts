import { RootState } from "@/app/store";
import { createAppAsyncThunk } from "@/app/withTypes";
import { database, firestore, generateDeviceToken } from "@/services/firebase";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { ref, set } from "firebase/database";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc } from "firebase/firestore";
import { selectCurrentUserId } from "../auth/authSlice";
import NotificationsHttpClient from "@/api/httpclient";

const CHANNELS_COLLECTION = 'channels';

const channelsCollection = () => collection(firestore, CHANNELS_COLLECTION);

export interface Channel {
  id: string;
  name: string;
  userId: string;
  subs: string[];
};


// await addDoc(collection(db, POST_COLLECTION), postDetails);

type NewChannelPayload = Pick<Channel, 'name'>
type DeleteChannelPayload = Pick<Channel, 'id'>
type SubscribePayload = { channelId: string; userId: string };

export const addNewChannel = createAppAsyncThunk(
  'channels/addNewChannel',
  async ({ name }: NewChannelPayload, thunkApi) => {
    const userId = selectCurrentUserId(thunkApi.getState());
    const response = await addDoc(channelsCollection(), { name, userId, subs: [] });

    const newDoc = await getDoc(doc(firestore, CHANNELS_COLLECTION, response.id));

    const data = newDoc.data()!;
    const channel = {
      id: newDoc.id,
      name: data.name,
      userId: data.userId,
      subs: data.subs,
    };

    await set(
      ref(database, 'messages/' + channel.id + '/fstmsg'),
      {
        content: `Welcome to ${channel.name}!`,
        username: 'System',
        timestamp: sub(new Date(), { years: 1000 }).toISOString(),
      });
    
    await NotificationsHttpClient.notifyNewChannel({ channelName: channel.name });

    return channel;
  }
)

export const fetchChannels = createAppAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const channelsQuery = query(channelsCollection());

    const snapshot = await getDocs(channelsQuery);

    let channels: Channel[] = [];

    snapshot.forEach(doc => {
      const ch = doc.data();
      channels.push({
        id: doc.id,
        name: ch.name,
        userId: ch.userId,
        subs: ch.subs,
      });
    });

    return channels;
  },
  {
    condition: (arg, thunkApi) => {
      const status = selectChannelsStstus(thunkApi.getState());
      if (status === 'pending')
        return false;
    }
  }
)

export const deleteChannel = createAppAsyncThunk(
  'channels/deleteChannel',
  async ({ id }: DeleteChannelPayload) => {
    await deleteDoc(doc(firestore, CHANNELS_COLLECTION, id));
    return id;
  }
)

export const subscribeToTopic = createAppAsyncThunk(
  'channels/subscribeToTopic',
  async (topic: string) => {
    const deviceToken = await generateDeviceToken();

    await NotificationsHttpClient.subscribe({
      token: deviceToken!,
      topic,
    })
  }
);

export const unsubscribeFromTopic = createAppAsyncThunk(
  'channels/unsubscribeFromTopic',
  async (topic: string) => {
    const deviceToken = await generateDeviceToken();

    await NotificationsHttpClient.unsubscribe({
      token: deviceToken!,
      topic,
    })
  }
);


export const subscribeToChannel = createAppAsyncThunk(
  'channels/subscribeToChannel',
  async ({ channelId, userId }: SubscribePayload, thunkApi) => {
    const channel = selectChannelById(thunkApi.getState(), channelId);
    if (!channel) {      
      thunkApi.rejectWithValue({});
      return;
    }

    const updatedSubs = [...channel.subs, userId];

    await updateDoc(doc(firestore, CHANNELS_COLLECTION, channelId), {
      subs: updatedSubs,
    });

    await thunkApi.dispatch(subscribeToTopic(channelId)).unwrap();

    return { channelId, subs: updatedSubs };
  }
)

export const unsubscribeFromChannel = createAppAsyncThunk(
  'channels/unsubscribeFromChannel',
  async ({ channelId, userId }: SubscribePayload, thunkApi) => {
    const channel = selectChannelById(thunkApi.getState(), channelId);
    if (!channel) {      
      thunkApi.rejectWithValue({});
      return;
    }

    const updatedSubs = channel.subs.filter(sub => sub !== userId);

    await updateDoc(doc(firestore, CHANNELS_COLLECTION, channelId), {
      subs: updatedSubs,
    });

    await thunkApi.dispatch(unsubscribeFromTopic(channelId)).unwrap();

    return { channelId, subs: updatedSubs };
  }
)

interface ChannelsState {
  channels: Channel[];
  status: 'idle' | 'pending' | 'failed' | 'succeeded';
  error: string | null;
};

const initialState: ChannelsState = {
  channels: [],
  status: 'idle',
  error: null,
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels.push(...action.payload);
      })
      .addCase(addNewChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.channels = state.channels.filter(ch => ch.id !== action.payload);
      })
      .addCase(subscribeToChannel.fulfilled, (state, action) => {
        const candidate = state.channels.find(ch => ch.id === action.payload?.channelId)!;
        candidate.subs = action.payload?.subs!;
        console.log(state);
      })
      .addCase(unsubscribeFromChannel.fulfilled, (state, action) => {
        const candidate = state.channels.find(ch => ch.id === action.payload?.channelId)!;
        candidate.subs = action.payload?.subs!;
        console.log(state);
      })
  }
});

export const { } = channelsSlice.actions;

export default channelsSlice.reducer;

export const selectAllChannels = (state: RootState) => state.channels.channels;
export const selectChannelsStstus = (state: RootState) => state.channels.status;

export const selectChannelById = (state: RootState, channelId: string) =>
  state.channels.channels.find(ch => ch.id === channelId);
