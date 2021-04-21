import React from 'react';
import { useHistory } from 'react-router';
import { CardColumns, Col, Row, Button, Card } from 'react-bootstrap';
import { GrClose } from 'react-icons/all';

const Home: React.FC = () => {
  const history = useHistory();
  const [selectedRoom, setSelectedRoom] = React.useState('');
  const rooms = [
    { code: '1', theme: 'Rock' },
    { code: '2', theme: 'MPB' },
    { code: '3', theme: 'Brega' },
    { code: '4', theme: 'Soul' },
    { code: '5', theme: 'Funk' },
    { code: '6', theme: 'Metal' },
  ];

  const handleRoomClick = (code: string) => {
    setSelectedRoom(code);
  };

  return (
    <div className="pt-3 pb-5">
      <Row>
        <Col xs={12}>
          <div
            className="button-close ml-auto"
            onClick={() => history.goBack()}
          >
            <GrClose size={24} />
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center pt-5">
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
                      {room.theme}
                    </Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>

          <Row xs={12} className="justify-content-center pt-3">
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
                onClick={() => history.push('/lobby')}
                size="lg"
                block
              >
                CANCELAR
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
