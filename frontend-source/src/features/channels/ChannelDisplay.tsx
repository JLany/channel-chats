import React, { useState } from "react";
import { ChannelChat } from "./ChannelChat";
import { Channel, deleteChannel, selectChannelById, subscribeToChannel, unsubscribeFromChannel } from "./channelsSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUserId, selectCurrentUsername } from "../auth/authSlice";

interface ChannelDisplayProps {
  channelId: string,
  handleDelete: (channelId: string) => any
};

export const ChannelDisplay = ({ channelId, handleDelete }: ChannelDisplayProps) => {
  const channel = useAppSelector(state => selectChannelById(state, channelId))!;
  if (!channel) {
    return (
      <></>
    );
  }

  const currentUserId = useAppSelector(selectCurrentUserId)!;
  const isSubscribed = channel.subs.find(sub => sub === currentUserId) !== undefined;

  const dispatch = useAppDispatch();

  const handleSubscribe = async () => {
    try {
      await dispatch(subscribeToChannel({ channelId: channel.id, userId: currentUserId })).unwrap();
    } catch (error) {
      alert('An error occurred');
      console.error(error);
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await dispatch(unsubscribeFromChannel({ channelId: channel.id, userId: currentUserId })).unwrap();
    } catch (error) {
      alert('An error occurred');
      console.error(error);
    }
  }

  return (
    <>
      {channel &&
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} key={channel.id}>
          <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '1rem', backgroundColor: '#f9f9f9' }}>
            <h2>{channel.name}</h2>

            {channel.userId && channel.userId === currentUserId &&
              <button
                onClick={() => handleDelete(channel.id)}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            }
            {isSubscribed &&
              <button
                onClick={handleUnsubscribe}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#d4545b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Unsubscribe
              </button>
            }
          </header>
          {isSubscribed
            ? <ChannelChat channel={channel} />
            : (
              <button
                onClick={handleSubscribe}
                style={{ padding: '0.5rem 1rem', backgroundColor: '#0e565f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Subscribe
              </button>
            )
          }
        </div>
      }
    </>
  );
};
