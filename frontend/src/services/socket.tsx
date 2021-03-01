import { createContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';

class SocketClient {
  public static socket = io(
    process.env.REACT_APP_API_URL || 'http://localhost:5000',
    {
      autoConnect: false,
      reconnection: true,
    },
  );
}

const SocketContext = createContext<Socket>(SocketClient.socket);
const SocketConsumer = SocketContext.Consumer;

const SocketProvider: React.FC = ({ children }) => {
  const [socket] = useState(SocketClient.socket);

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider, SocketConsumer };
