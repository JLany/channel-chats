import { useAppSelector } from '@/app/hooks';
import { TimeAgo } from '@/components/TimeAgo';
import { UserIcon } from '@/components/UserIcon';
import { Message } from '@/features/messages/messagesSlice';
import { selectCurrentUsername } from '../auth/authSlice';

export const SingleMessage = ({ msg }: { msg: Message }) => {
  const currentUsername = useAppSelector(selectCurrentUsername);

  let msgUsername: string;
  if (!msg.username) {
    msgUsername = 'Unknown';
  } else if (msg.username === currentUsername) {
    msgUsername = 'You';
  } else {
    msgUsername = msg.username;
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <UserIcon size={34} />
      <strong>{msgUsername}: </strong>
      <span>{msg.content}</span>
      <TimeAgo timestamp={msg.timestamp} />
    </div>
  );
}
