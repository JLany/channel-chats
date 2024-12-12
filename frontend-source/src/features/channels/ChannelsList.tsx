import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Channel, fetchChannels, selectAllChannels, selectChannelsStstus } from "./channelsSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ChannelsListProps {
  handleChannelSelect: React.Dispatch<React.SetStateAction<Channel | null>>;
  channels: Channel[];
}

export const ChannelsList = ({ handleChannelSelect, channels }: ChannelsListProps) => {
  const navigate = useNavigate();

  return (
    <aside style={{ width: '20%', borderRight: '1px solid #ccc', padding: '1rem', backgroundColor: '#959e6e' }}>
      <div>
        <h3>Channels</h3>
        <ul>
          {channels.map(channel => (
            <li
              key={channel.id}
              style={{ cursor: 'pointer', padding: '0.5rem 0' }}
              onClick={() => handleChannelSelect(channel)}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate('/channels/create')}
        style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Add New Channel
      </button>
    </aside>
  );
};
