import React from 'react';
import {
  Row,
  Col,
  Button,
  Figure,
  InputGroup,
  FormControl,
  Form,
} from 'react-bootstrap';
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
  const [avatar, setAvatar] = React.useState('/avatars/avatar-1.png');
  const [nickname, setNickname] = React.useState('');
  const [user, setUser] = React.useContext(AuthContext);

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

  const handlerPlay = async () => {
    const response = await client.post('/auth', { nickname, avatar });

    if (response.status === 201) {
      const { data, token } = response.data;
      setUser({ ...data, token });
      history.push('/lobby');
    }
  };

  return (
    <>
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
              <Figure onClick={handlerAvatar}>
                <Figure.Image
                  width={160}
                  height={160}
                  alt="Avatar"
                  src={avatar}
                />
              </Figure>
            </Row>
            <Form>
              <Form.Row>
                <InputGroup className="search-box mb-3">
                  <FormControl
                    className="input-control"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={handlerNickname}
                  />
                </InputGroup>
              </Form.Row>
              <Form.Row>
                <Button
                  className="button-default mt-1"
                  variant="primary"
                  onClick={handlerPlay}
                  block
                >
                  JOGAR
                </Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default AuthPage;
