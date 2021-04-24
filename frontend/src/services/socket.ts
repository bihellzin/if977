import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
});

export default socket;
