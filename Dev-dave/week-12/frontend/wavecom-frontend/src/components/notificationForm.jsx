import { useState } from 'react';

export default function NotificationForm({ onSent }) {
  const [recipient, setRecipient] = useState('user@example.com');
  const [channel, setChannel] = useState('email');

  return (
    <div className="form">
      <label>
        Recipient
        <input value={recipient} onChange={e => setRecipient(e.target.value)} />
      </label>

      <label>
        Channel
        <select value={channel} onChange={e => setChannel(e.target.value)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="push">Push</option>
        </select>
      </label>

      <button onClick={() => onSent({ channel, recipient, payload: { body: 'Test message' } })}>
        Send Notification
      </button>
    </div>
  );
}
