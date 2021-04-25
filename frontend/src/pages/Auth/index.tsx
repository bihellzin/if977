import React from 'react';
import { Row, Col, Button, Figure, InputGroup, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import logo from 'assets/logo.png';
import client from 'services/api';
import { AuthContext } from 'services/auth';
import './styles.scss';

const AuthPage: React.FC = () => {
  const history = useHistory();
  const avatars = [
    '/avatars/avatar-1.png',
    '/avatars/avatar-2.png',
    '/avatars/avatar-3.png',
    '/avatars/avatar-4.png',
    '/avatars/avatar-5.png',
    '/avatars/avatar-6.png',
  ];
  const [avatar, setAvatar] = React.useState(
    avatars[Math.floor(Math.random() * avatars.length)],
  );
  const [nickname, setNickname] = React.useState('');
  const [, setUser] = React.useContext(AuthContext);

  const handlerNickname: React.ChangeEventHandler<HTMLInputElement> = e => {
    setNickname(e.currentTarget.value);
  };
  const handlerAvatar = () => {
    setAvatar(
      p =>
        avatars[
          avatars.indexOf(p) + 1 >= avatars.length ? 0 : avatars.indexOf(p) + 1
        ],
    );
  };

  React.useEffect(() => {
    if (history.location.pathname === '/') {
      sessionStorage.removeItem('token');
    }
  }, [history]);

  const handlerPlay: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    if (nickname.length >= 3 && nickname.length <= 8) {
      const response = await client.post('/auth', { nickname, avatar });
      if (response.status === 201) {
        const { data, token } = response.data;
        sessionStorage.setItem('token', token);
        setUser(data);
        if (history.location.pathname === '/') {
          history.push('/lobby');
        }
      }
    }
  };

  return (
    <div className="d-flex flex-column pt-3">
      <Col>
        <Row className="justify-content-center">
          <Figure>
            <Figure.Image alt="Avatar" src={logo} />
          </Figure>
        </Row>
      </Col>
      <Row className="justify-content-center">
        <Col md={2}>
          <Row className="justify-content-center">
            <Figure onClick={handlerAvatar} className="pointer-hover">
              <Figure.Image
                width={160}
                height={160}
                alt="Avatar"
                src={avatar}
              />
            </Figure>
          </Row>
          <Form onSubmit={handlerPlay}>
            <Form.Row>
              <InputGroup className="group-custom mb-3">
                <input
                  className="control-custom"
                  placeholder="Nickname"
                  value={nickname}
                  onChange={handlerNickname}
                  disabled={nickname.length < 3 && nickname.length > 8}
                />
              </InputGroup>
            </Form.Row>
            <Form.Row>
              <Button
                className="button-custom mt-1"
                variant="primary"
                type="submit"
                block
              >
                JOGAR
              </Button>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AuthPage;
