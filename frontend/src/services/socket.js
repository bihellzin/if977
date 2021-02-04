import React from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const SocketContext = React.createContext();
const SocketConsumer = SocketContext.Consumer;

function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export { SocketContext, SocketProvider, SocketConsumer };
