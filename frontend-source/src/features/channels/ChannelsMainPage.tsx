import { useEffect, useState } from "react";
import { ChannelsList } from "./ChannelsList";
import { ChannelChat } from "./ChannelChat";
import { ChannelDisplay } from "./ChannelDisplay";
import { Channel, deleteChannel, fetchChannels, selectAllChannels, selectChannelsStstus } from "./channelsSlice";
import { onMessage } from "firebase/messaging";
import { firebaseMessaging } from "@/services/firebase";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Spinner } from "@/components/Spinner";

export const ChannelsMainPage = () => {
  console.log('I am changing...');
  
  const channels = useAppSelector(selectAllChannels);
  console.log(...channels);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  const status = useAppSelector(selectChannelsStstus);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchChannels());
    }
  }, [status, dispatch]);

  const handleDelete = async (channelId: string) => {
    try {
      await dispatch(deleteChannel({ id: channelId })).unwrap();
      setSelectedChannel(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChannelsList channels={channels} handleChannelSelect={setSelectedChannel} />
      <main style={{ flex: 1, padding: '1rem' }}>
        {status === 'pending' &&
          <Spinner text="Loading..." />
        } 
        {selectedChannel ? (
          <ChannelDisplay channelId={selectedChannel.id} handleDelete={handleDelete} />
        ) : (
          <p>Please select a channel from the list.</p>
        )}
      </main>
    </div>
  );
};
