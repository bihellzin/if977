import React from 'react';
import { useHistory } from 'react-router';
import {
  CardColumns,
  Form,
  Col,
  Row,
  Button,
  Card,
  InputGroup,
  Pagination,
} from 'react-bootstrap';
import Carousel from '../components/Carousel';

const Home: React.FC = () => {
  const history = useHistory();
  const [selectedRoom, setSelectedRoom] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [keyword, setKeyword] = React.useState('');
  const [page, setPage] = React.useState(1);
  const rooms = [
    { code: '1', name: 'Room 1', theme: 'Rock', owner: 'asd', players: 3 },
    { code: '2', name: 'Room 1', theme: 'Rock', owner: 'asd', players: 3 },
    { code: '3', name: 'Room 1', theme: 'Rock', owner: 'asd', players: 3 },
    { code: '4', name: 'Room 1', theme: 'Rock', owner: 'asd', players: 3 },
    { code: '5', name: 'Room 1', theme: 'Rock', owner: 'sdf', players: 3 },
    { code: '6', name: 'Room 1', theme: 'Rock', owner: 'fgh', players: 3 },
  ];

  const handleRoomClick = (code: string) => {
    setSelectedRoom(code);
  };

  return (
    <>
      <Carousel />
      <Form>
        <Form.Row>
          <Col xs={12} md={6} className="mb-3">
            <Form.Label>Nickname</Form.Label>
            <InputGroup>
              <Form.Control
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Escreva seu nickname"
              />
            </InputGroup>
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <Form.Label>Buscar sala</Form.Label>
            <InputGroup>
              <Form.Control
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Buscar sala"
              />
            </InputGroup>
          </Col>
        </Form.Row>
      </Form>
      <CardColumns>
        {rooms.map(room => {
          return (
            <Card
              key={room.code}
              className={
                selectedRoom === room.code
                  ? 'hover-pointer bg-secondary text-white text-center'
                  : 'hover-pointer text-center'
              }
              onClick={() => handleRoomClick(room.code)}
            >
              <Card.Body>
                <Card.Title>{room.name}</Card.Title>
                <Card.Text>
                  <small>
                    Tema: {room.theme} | Jogadores: {room.players} | Criado por:{' '}
                    {room.owner}
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </CardColumns>
      <Row>
        <Col>
          <Pagination className="justify-content-center">
            <Pagination.First onClick={() => setPage(1)} />
            <Pagination.Prev onClick={() => setPage(Math.max(page - 1, 1))} />
            {Array.from({ length: rooms.length }, (v, k) => k + 1).map(i => (
              <Pagination.Item
                key={i}
                active={page === i}
                onClick={() => setPage(i)}
              >
                {i}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(Math.min(page + 1, rooms.length))}
            />
            <Pagination.Last onClick={() => setPage(rooms.length)} />
          </Pagination>
        </Col>
      </Row>
      <Row xs={12}>
        <Col xs={12} md={3} className="mb-3">
          <Button
            variant="outline-secondary"
            onClick={() => history.push('/room/test')}
            size="lg"
            block
          >
            CRIAR SALA
          </Button>
        </Col>
        <Col xs={12} md={3} className="mb-3">
          <Button
            variant="outline-secondary"
            onClick={() => history.push('/room/test')}
            size="lg"
            block
          >
            SALA DE TESTE
          </Button>
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <Button
            variant="primary"
            onClick={() => history.push('/room/test')}
            size="lg"
            block
          >
            JOGAR
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Home;
