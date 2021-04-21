import { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { SocketContext } from '../services/socket';
import Textarea from '../components/Textarea';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { GrClose, AiOutlineSend } from 'react-icons/all';
import avatar1 from '../assets/avatar-1.png';
import avatar2 from '../assets/avatar-2.png';
import avatar3 from '../assets/avatar-3.png';
import avatar4 from '../assets/avatar-4.png';
import avatar5 from '../assets/avatar-5.png';
import avatar6 from '../assets/avatar-6.png';

function Room() {
  const history = useHistory();
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
      avatar: avatar1,
      score: 99,
      wins: 1,
    },
    {
      id: '2',
      name: 'Player 2',
      avatar: avatar2,
      score: 80,
      wins: 0,
    },
    {
      id: '3',
      name: 'Player 3',
      avatar: avatar3,
      score: 75,
      wins: 0,
    },
    {
      id: '4',
      name: 'Player 4',
      avatar: avatar4,
      score: 75,
      wins: 0,
    },
    {
      id: '5',
      name: 'Player 5',
      avatar: avatar5,
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
      <Row className="pt-3">
        <Col xs={12}>
          <div
            className="button-close ml-auto"
            onClick={() => history.goBack()}
          >
            <GrClose size={24} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={3} className="pt-3">
          {players.map(player => (
            <div key={player.id} className="card-room mt-3 mb-3">
              <Row className="p-3">
                <Col>
                  <img height={64} src={player.avatar} alt="avatar" />
                </Col>
                <Col>
                  <Row className="label-pontuacao">{player.name}</Row>
                  <Row className="label-pontuacao">{player.score} pts</Row>
                </Col>
              </Row>
            </div>
          ))}
        </Col>
        <Col sm={9}>
          <Row>
            <Col xs={12} className="mt-3 mb-3">
              <h3>Música</h3>
              <p className="chat-box boxed p-3">
                Gênero: Rock
                <br />
                Quantidade de letras no nome da música: 7<br />
                Quantidade de letras no nome do autor: 7
              </p>
            </Col>
            <Col sm={6} className="mb-3">
              <h3>Repostas</h3>
              <Form onSubmit={sendAnswer} className="chat-box p-3">
                <Textarea value={[]}></Textarea>
                <InputGroup className="chat-input">
                  <Form.Control
                    className="chat-control"
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.currentTarget.value)}
                    placeholder="Escreva sua resposta aqui..."
                  />
                  <AiOutlineSend size={24} />
                </InputGroup>
              </Form>
            </Col>
            <Col sm={6} className="mb-3">
              <h3>Bate-papo</h3>
              <Form onSubmit={sendMessage} className="chat-box p-3">
                <Textarea value={messages}></Textarea>
                <InputGroup className="chat-input">
                  <Form.Control
                    className="chat-control"
                    value={currentMsg}
                    onChange={e => setCurrentMsg(e.currentTarget.value)}
                    placeholder="Escreva sua mensagem aqui..."
                  />
                  <AiOutlineSend size={24} />
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
