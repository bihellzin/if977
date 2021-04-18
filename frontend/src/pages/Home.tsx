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
} from 'react-bootstrap';
import {
  FiSearch,
  GrClose,
  FiChevronRight,
  FiChevronLeft,
} from 'react-icons/all';

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
      <Row className="justify-content-center p-3">
        <Col xs={10} md={3} className="ml-auto mr-auto">
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
            <Col xs={6}>
              <div
                className="button-round"
                onClick={() => setPage(Math.max(page - 1, 1))}
              >
                <FiChevronLeft size={24} />
              </div>
            </Col>
            <Col xs={6}>
              <div
                className="button-round ml-auto"
                onClick={() => setPage(Math.min(page + 1, rooms.length))}
              >
                <FiChevronRight size={24} />
              </div>
            </Col>
            <Col xs={12} md={4} className="mt-3 mb-3">
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
            <Col xs={12} md={4} className="mt-3 mb-3">
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
    </>
  );
};

export default Home;
