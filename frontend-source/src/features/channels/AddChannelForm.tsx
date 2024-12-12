import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNewChannel } from "./channelsSlice";
import { selectCurrentUserId } from "../auth/authSlice";
import { Spinner } from "@/components/Spinner";

export const AddChannelForm = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus('loading');
      await dispatch(addNewChannel({ name })).unwrap();
      navigate('/channels');
    } catch (error) {
      console.error('Error adding channel:', error);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Add New Channel</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="channelName" style={{ display: 'block', marginBottom: '0.5rem' }}>Channel Name:</label>
          <input
            id="channelName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button
          type="submit" disabled={status==='loading'}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Channel
        </button>
      </form>
      {status === 'loading' && <Spinner text="Adding channel..." />}
    </div>
  );
};
