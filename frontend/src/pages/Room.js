import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "./../services/socket";

function Room() {
  const { id: roomId } = useParams();
  const socket = React.useContext(SocketContext);
  const [serverTime, setServerTime] = React.useState(new Date());
  const [messages, setMessages] = React.useState([]);
  const [currentMsg, setCurrentMsg] = React.useState();

  // socket.connect();
  // socket.disconnect();

  console.log(socket);

  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("join-room", (data) => {
      if (!data) alert("Failed join room");
    });
  }, [roomId]);

  const sendMessage = () => {
    if (currentMsg) {
      socket.emit("chat-message", currentMsg);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("server-time", (data) => {
      if (data) setServerTime(new Date(data));
    });
  }, []);

  useEffect(() => {
    socket.on("chat-message", (data) => {
      if (data) setMessages(data);
    });
  }, []);

  return (
    <div>
      <h1>Room {roomId}</h1>
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
        onChange={(e) => setCurrentMsg(e.currentTarget.value)}
        placeholder="Write here..."
      />
      <input type="button" onClick={sendMessage} value="Send" />
    </div>
  );
}

export default Room;
