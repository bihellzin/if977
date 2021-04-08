import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../services/socket';
import Textarea from '../components/Textarea';
import { Button, Row, Col, Form, InputGroup } from 'react-bootstrap';

function Room() {
  const socket = useContext(SocketContext);
  const roomCode = useParams<{ id: string }>().id;
  const [serverTime, setServerTime] = useState(new Date());
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    socket.emit('join-room', roomCode);
    socket.on('join-room', (data: any) => {
      if (data) {
        setMessages(data);
      } else {
        alert('Failed join room');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  useEffect(() => {
    socket.on('server-time', (data: any) => {
      if (data) setServerTime(new Date(data));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row>
        <Col xs={6}>
          <h1>
            Room Name
            <br />
            <small>Code: {roomCode}</small>
          </h1>
        </Col>
        <Col xs="auto">
          <p>
            Tempo atual do servidor:{' '}
            {serverTime
              .toLocaleString('en-us', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
              .replace(/(\d+)\/(\d+)\/(\d+)/, '$1/$2/$3')}
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Textarea value={[]}></Textarea>
          <InputGroup>
            <Form.Control
              value={currentAnswer}
              onChange={e => setCurrentAnswer(e.currentTarget.value)}
              placeholder="Escreva sua resposta aqui..."
            />
            <Button variant="dark" onClick={sendMessage}>
              ENVIAR
            </Button>
          </InputGroup>
        </Col>
        <Col>
          <Textarea value={messages}></Textarea>
          <InputGroup>
            <Form.Control
              value={currentMsg}
              onChange={e => setCurrentMsg(e.currentTarget.value)}
              placeholder="Escreva sua mensagem aqui..."
            />
            <Button variant="secondary" onClick={sendMessage}>
              ENVIAR
            </Button>
          </InputGroup>
        </Col>
      </Row>
    </>
  );
}

export default Room;
