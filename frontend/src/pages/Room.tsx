import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../services/socket';

function Room() {
  const socket = useContext(SocketContext);
  const roomId = useParams<{ id: string }>().id;
  const [serverTime, setServerTime] = useState(new Date());
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  useEffect(() => {
    socket.emit('join-room', roomId);
    socket.on('join-room', (data: any) => {
      if (data) {
        setMessages(data);
      } else {
        alert('Failed join room');
      }
    });
  }, [roomId]);

  useEffect(() => {
    socket.on('server-time', (data: any) => {
      if (data) setServerTime(new Date(data));
    });
  }, []);

  const sendMessage = () => {
    if (currentMsg) {
      socket.emit('chat-message', currentMsg);
      setCurrentMsg('');
    }
  };

  useEffect(() => {
    socket.on('chat-message', (data: any) => {
      if (data) setMessages(data);
    });
  }, []);

  return (
    <div>
      <h1>Room {roomId}</h1>
      <a href="\">Sair</a>
      <h2>{serverTime.toISOString()}</h2>
      <div>
        {messages.map(({ id, message, from }) => (
          <p key={id}>
            {from}: {message}
          </p>
        ))}
      </div>
      <input
        value={currentMsg}
        onChange={e => setCurrentMsg(e.currentTarget.value)}
        placeholder="Write here..."
      />
      <input type="button" onClick={sendMessage} value="Send" />
    </div>
  );
}

export default Room;
