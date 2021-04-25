import React from 'react';
import { useHistory } from 'react-router';
import { CardColumns, Col, Row, Button, Card } from 'react-bootstrap';
import { GrClose } from 'react-icons/all';
import client, { Genre } from 'services/api';
import './styles.scss';

const Home: React.FC = () => {
  const history = useHistory();
  const [selectedGenre, setSelectedGenre] = React.useState<number>(0);
  const [genres, setGenres] = React.useState<Genre[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      const { status, data } = await client.get('/genre');
      if (mounted) {
        if (status === 200 && data.data) {
          setGenres(data.data);
        } else {
          setGenres([]);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleGenreClick = (id: number) => {
    setSelectedGenre(id);
  };

  const handleNewRoomClick = async () => {
    if (genres.some(g => g.id === selectedGenre)) {
      const { status, data } = await client.post('/room', {
        genreId: selectedGenre,
      });
      if (status === 201 && data.data) {
        history.push(`/room/${data.data.id}`);
      }
    }
  };

  const handlerClickCancel = () => {
    history.push('/lobby');
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
            {genres.map(genre => {
              return (
                <Card
                  key={`${genre.id}`}
                  className={
                    selectedGenre === genre.id
                      ? 'card-room-selected'
                      : 'card-room'
                  }
                  onClick={() => handleGenreClick(genre.id)}
                >
                  <Card.Body>
                    <Card.Title className="label-black text-center">
                      {genre.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>

          <Row xs={12} className="justify-content-center pt-3">
            <Col xs={12} md={4} className="mt-3 mb-3">
              <Button
                className="button-custom"
                variant="primary"
                onClick={handleNewRoomClick}
                block
              >
                CRIAR SALA
              </Button>
            </Col>
            <Col xs={12} md={4} className="mt-3 mb-3">
              <Button
                className="button-custom"
                variant="primary"
                onClick={handlerClickCancel}
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
