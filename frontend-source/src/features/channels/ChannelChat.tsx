import { useEffect, useState } from "react";
import { Channel } from "./channelsSlice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addNewMessage, messageReceived, selectChannelMessages } from "../messages/messagesSlice";
import { get, onValue, ref, set } from "firebase/database";
import { database } from "@/services/firebase";
import { selectCurrentUserId, selectCurrentUsername } from "../auth/authSlice";
import { SingleMessage } from "../messages/SingleMessage";
import { Spinner } from "@/components/Spinner";

export const ChannelChat = ({ channel }: { channel: Channel }) => {
  // const [messages, setMessages] = useState([
  //   { id: 1, text: 'Welcome to the chat!', user: 'System' },
  //   { id: 2, text: 'Hello everyone!', user: 'User1' },
  // ]);
  const [newMessage, setNewMessage] = useState('');

  const messages = useAppSelector(state => selectChannelMessages(state, channel.id));
  const orderedMessages = messages?.slice().sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  console.log('messages', messages);

  const [status, setStatus] = useState<'idle' | 'loaded'>('idle');
  const msgRef = ref(database, 'messages/' + channel.id);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === 'idle') {
      onValue(msgRef, (snapshot) => {
        console.log('data came');
        const data = snapshot.val();
        console.log(data);
        if (data) {
          setStatus('loaded');
          dispatch(messageReceived({ channelId: channel.id, messages: data }));
        }
      });
    }
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      // setMessages([...messages, { id: Date.now(), text: newMessage, user: 'You' }]);
      dispatch(addNewMessage({
        content: newMessage,
        channelId: channel.id,
        channelName: channel.name,
      }));

      setNewMessage('');
    }
  };

  return (
    <>
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f3f3f3' }}>
        {status === 'idle' && <Spinner text="Loading..." />}
        {messages &&
          orderedMessages.map(msg => (
            <SingleMessage key={msg.id} msg={msg} />
          ))}
      </div>
      <footer >
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(e) }}
          style={{ borderTop: '1px solid #ccc', padding: '1rem', backgroundColor: '#f9f9f9', display: 'flex' }} >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, marginRight: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage} type='button'
            style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Send
          </button>
        </form>
      </footer>
    </>
  );
};