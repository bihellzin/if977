import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../services/socket';
import Textarea from '../components/Textarea';
import { Button, Row, Col, Form, InputGroup } from 'react-bootstrap';

function Room() {
  const socket = useContext(SocketContext);
  const roomCode = useParams<{ id: string }>().id;
  const [serverTime, setServerTime] = useState(new Date());
  const [roomName, setRoomName] = useState('Test');
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [players, setPlayers] = useState([
    {
      id: '1',
      name: 'Player 1',
      score: 99,
      wins: 1,
    },
    {
      id: '2',
      name: 'Player 2',
      score: 80,
      wins: 0,
    },
    {
      id: '3',
      name: 'Player 3',
      score: 75,
      wins: 0,
    },
    {
      id: '4',
      name: 'Player 4',
      score: 75,
      wins: 0,
    },
    {
      id: '5',
      name: 'Player 5',
      score: 75,
      wins: 0,
    },
  ]);

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

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (currentMsg) {
      socket.emit('chat-message', currentMsg);
      setCurrentMsg('');
    }
  };

  const sendAnswer = (e: any) => {
    e.preventDefault();
    if (currentAnswer) {
      socket.emit('chat-message', currentAnswer);
      setCurrentAnswer('');
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
            Room {roomName}
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
        <Col sm={3}>
          <h3>Placar</h3>
          {players.map(player => (
            <p key={player.id} className="boxed">
              <strong>{player.name}</strong>
              <br />
              {player.score} Pontos{' '}
              {player.wins > 0 ? `| ${player.wins} vitórias` : ''}
            </p>
          ))}
        </Col>
        <Col sm={9}>
          <Row>
            <Col xs={12} className="mb-3">
              <h3>Música</h3>
              <p className="boxed">
                Gênero: Rock
                <br />
                Quantidade de letras no nome da música: 7<br />
                Quantidade de letras no nome do autor: 7<br />
                Tempo: 7:00
              </p>
            </Col>
            <Col sm={12} md={6}>
              <h3>Repostas</h3>
              <Textarea value={[]}></Textarea>
              <Form onSubmit={sendAnswer}>
                <InputGroup>
                  <Form.Control
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.currentTarget.value)}
                    placeholder="Escreva sua resposta aqui..."
                  />
                  <Button variant="dark" type="submit">
                    ENVIAR
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col sm={12} md={6}>
              <h3>Bate-papo</h3>
              <Textarea value={messages}></Textarea>
              <Form onSubmit={sendMessage}>
                <InputGroup>
                  <Form.Control
                    value={currentMsg}
                    onChange={e => setCurrentMsg(e.currentTarget.value)}
                    placeholder="Escreva sua mensagem aqui..."
                  />
                  <Button variant="secondary" type="submit">
                    ENVIAR
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Room;
