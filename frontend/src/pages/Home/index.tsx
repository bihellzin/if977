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
import { FiSearch, GrClose } from 'react-icons/all';
import ButtonRound from 'components/ButtonRound';
import './styles.scss';
import client, { Room } from 'services/api';

const Home: React.FC = () => {
  const history = useHistory();
  const [selectedRoom, setSelectedRoom] = React.useState(0);
  const [keyword, setKeyword] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [rooms, setRooms] = React.useState<Room[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const { status, data } = await client.get(
        `/room?limit=6&offset=${page * 6}`,
      );

      if (mounted) {
        if (status === 200 && data.data) {
          setRooms(data.data);
          setTotal(data.total);
        } else {
          setRooms([]);
          setTotal(0);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [page]);

  const handleRoomClick = (id: number) => {
    setSelectedRoom(id);
  };

  const handleRoomEntryClick = () => {
    if (rooms.some(r => r.id === selectedRoom)) {
      history.push(`/room/${selectedRoom}`);
    }
  };

  const handleKeywordSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    const { status, data } = await client.get(
      `/room?limit=6&offset=${page * 6}&query=${keyword}`,
    );

    if (status === 200 && data.data) {
      setRooms(data.data);
      setTotal(data.total);
    } else {
      setRooms([]);
      setTotal(0);
    }
  };

  const handlerClickCancel = () => {
    history.push('/');
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
      <Row className="justify-content-center p-3">
        <Col xs={10} md={3} className="ml-auto mr-auto">
          <Form onSubmit={handleKeywordSubmit}>
            <Form.Row className="mb-3">
              <InputGroup className="search-box">
                <input
                  className="control-custom"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="Pesquisar uma sala"
                />
                <FiSearch size={24} style={{ alignSelf: 'center' }} />
              </InputGroup>
            </Form.Row>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center pt-3">
        <Col sm={12} md={10}>
          <CardColumns>
            {rooms.map(room => {
              return (
                <Card
                  key={room.id}
                  className={
                    selectedRoom === room.id
                      ? 'card-room-selected mt-3 mb-3'
                      : 'card-room mt-3 mb-3'
                  }
                  onClick={() => handleRoomClick(room.id)}
                >
                  <Card.Body>
                    <Card.Title className="label-black text-center">
                      Sala do {room.owner.nickname}
                    </Card.Title>
                    <Row>
                      <Col xs={6}>
                        <Card.Text className="label-grey text-center">
                          Jogadores: {room.playerCount}
                        </Card.Text>
                      </Col>
                      <Col xs={6}>
                        <Card.Text className="label-grey text-center">
                          Gênero: <br />
                          {room.genre.name}
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
              <ButtonRound
                direction="left"
                onClick={() => setPage(Math.max(page - 1, 0))}
                size={24}
              />
            </Col>
            <Col xs={6}>
              <ButtonRound
                className="ml-auto"
                direction="right"
                onClick={() =>
                  setPage(Math.min(page + 1, Math.floor(total / 6)))
                }
                size={24}
              />
            </Col>
            <Col xs={12} md={4} className="mt-3">
              <Button
                className="button-custom"
                variant="primary"
                onClick={() => history.push('/createroom')}
                size="lg"
                block
              >
                CRIAR SALA
              </Button>
            </Col>
            <Col xs={12} md={4} className="mt-3 mb-3">
              <Button
                className="button-custom"
                variant="primary"
                onClick={handleRoomEntryClick}
                size="lg"
                block
              >
                ENTRAR
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
