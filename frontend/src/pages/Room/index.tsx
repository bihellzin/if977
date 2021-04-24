import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Textarea from 'components/TextArea';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { GrClose, AiOutlineSend } from 'react-icons/all';
import { AuthContext } from 'services/auth';
import socket from 'services/socket';
import client, { DEFAULT_ROOM, Room, User, Message, Play } from 'services/api';
import './styles.scss';

const RoomPage: React.FC = () => {
  const history = useHistory();
  const [user] = React.useContext(AuthContext);
  const roomCode = useParams<{ id: string }>().id;
  const [room, setRoom] = React.useState<Room>(DEFAULT_ROOM);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [plays, setPlays] = React.useState<Play[]>([]);
  const [currentMsg, setCurrentMsg] = React.useState('');
  const [currentAnswer, setCurrentAnswer] = React.useState('');
  const [players, setPlayers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const joinRoom = async () => {
      await client.patch(
        `/user/${user.id}`,
        { roomId: roomCode },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      socket.emit('join-room', roomCode);
    };
    joinRoom();
    return () => {
      const leaveRoom = async () => {
        await client.patch(
          `/user/${user.id}`,
          { roomId: null },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
      };
      leaveRoom();
      socket.emit('leave-room', roomCode);
    };
  }, [roomCode, user.id, user.token]);

  React.useEffect(() => {
    socket.on('join-room', async (data: string) => {
      if (data) {
        let response = await client.get(`/room/${roomCode}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.status === 200) {
          const { data } = response.data;
          setRoom(data);
        }

        response = await client.get(`/user?roomId=${roomCode}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.status === 200) {
          const { data } = response.data;
          setPlayers(data);
        }
      }
    });
  }, [roomCode, user.token]);

  const fetchMessages = React.useCallback(async () => {
    const response = await client.get(`/message?roomId=${roomCode}&limit=25`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (response.status === 200) {
      const { data } = response.data;
      setMessages(data);
    }
  }, [roomCode, user.token]);

  React.useEffect(() => {
    socket.on('messages', fetchMessages);
  }, [fetchMessages]);

  const sendMessage: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    if (user.token && currentMsg) {
      const response = await client.post(
        `/message`,
        {
          content: currentMsg,
          roomId: roomCode,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (response.status === 201) {
        setCurrentMsg('');
      }
    }
  };

  const fetchPlays = React.useCallback(async () => {
    const response = await client.get(`/play?roomId=${roomCode}&limit=25`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (response.status === 200) {
      const { data } = response.data;
      setPlays(data);
    }
  }, [roomCode, user.token]);

  React.useEffect(() => {
    socket.on('plays', fetchPlays);
  }, [fetchPlays]);

  const sendAnswer: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    if (user.token && currentAnswer && room.music) {
      const response = await client.post(
        `/play`,
        {
          answer: currentMsg,
          roomId: roomCode,
          musicId: room.music.id,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      if (response.status === 201) {
        setCurrentAnswer('');
      }
    }
  };

  const handlerClickCancel = () => {
    history.push('/lobby');
  };

  return (
    <div className="d-flex flex-column pt-3">
      <Row>
        <Col xs={12}>
          <div className="button-close ml-auto" onClick={handlerClickCancel}>
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
                  <Row className="label-pontuacao">{player.nickname}</Row>
                  <Row>
                    {player.wins > 0 && player.wins + ' wins | '}
                    {player.score} pts
                  </Row>
                </Col>
              </Row>
            </div>
          ))}
        </Col>
        <Col sm={9}>
          <Row>
            <Col xs={12} className="mt-3 mb-3">
              <h3>Música</h3>
              <p className="chat-box p-3">
                Gênero: {room.genre.name}
                <br />
                Quantidade de letras no nome da música: 7<br />
                Quantidade de letras no nome do autor: 7
              </p>
            </Col>
            <Col sm={6} className="mb-3">
              <h3>Repostas</h3>
              <Form onSubmit={sendAnswer} className="chat-box p-3">
                <Textarea value={plays}></Textarea>
                <InputGroup className="chat-input">
                  <input
                    className="control-chat"
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.currentTarget.value)}
                    placeholder="Escreva sua resposta aqui..."
                  />
                  <AiOutlineSend size={24} style={{ alignSelf: 'center' }} />
                </InputGroup>
              </Form>
            </Col>
            <Col sm={6} className="mb-3">
              <h3>Bate-papo</h3>
              <Form onSubmit={sendMessage} className="chat-box p-3">
                <Textarea value={messages}></Textarea>
                <InputGroup className="chat-input">
                  <input
                    className="control-chat"
                    value={currentMsg}
                    onChange={e => setCurrentMsg(e.currentTarget.value)}
                    placeholder="Escreva sua mensagem aqui..."
                  />
                  <AiOutlineSend size={24} style={{ alignSelf: 'center' }} />
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default RoomPage;
