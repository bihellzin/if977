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
  Container,
} from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';

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
      <Row className="justify-content-center pt-3">
        <Col xs={2}></Col>
        <Col xs={8} md={4}>
          <Form>
            <Form.Row className="mb-3">
              <InputGroup className="search-box">
                <Form.Control
                  className="input-control"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="Pesquisar uma sala"
                />
                <FiSearch size={24} />
              </InputGroup>
            </Form.Row>
          </Form>
        </Col>
        <Col xs={2}>
          <FiSearch size={24} />
        </Col>
      </Row>
      <Row className="justify-content-center pt-3">
        <Col xs={10}>
          <CardColumns>
            {rooms.map(room => {
              return (
                <Card
                  key={room.code}
                  className={
                    selectedRoom === room.code
                      ? 'card-room-selected'
                      : 'card-room'
                  }
                  onClick={() => handleRoomClick(room.code)}
                >
                  <Card.Body>
                    <Card.Title className="label-black text-center">
                      Sala do {room.owner}
                    </Card.Title>
                    <Row>
                      <Col xs={6}>
                        <Card.Text className="label-grey text-center">
                          Jogadores: {room.players}
                        </Card.Text>
                      </Col>
                      <Col xs={6}>
                        <Card.Text className="label-grey text-center">
                          Gênero: {room.theme}
                        </Card.Text>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>

          <Row xs={12} className="justify-content-center pt-3">
            <Col xs={6}>x</Col>
            <Col xs={6}>x</Col>
            <Col xs={6} md={4} className="mb-3">
              <Button
                className="button-default"
                variant="primary"
                onClick={() => history.push('/room/test')}
                size="lg"
                block
              >
                CRIAR SALA
              </Button>
            </Col>
            <Col xs={6} md={4} className="mb-3">
              <Button
                className="button-default"
                variant="primary"
                onClick={() => history.push('/room/test')}
                size="lg"
                block
              >
                ENTRAR
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

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
    </>
  );
};

export default Home;
