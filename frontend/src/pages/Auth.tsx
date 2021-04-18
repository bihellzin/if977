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
import logo from '../assets/logo.png';
import avatar1 from '../assets/avatar-1.png';

const AuthPage: React.FC = () => {
  const history = useHistory();
  return (
    <>
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
            <Figure>
              <Figure.Image
                width={160}
                height={160}
                alt="Avatar"
                src={avatar1}
              />
            </Figure>
          </Row>
          <Form>
            <Form.Row>
              <InputGroup className="search-box mb-3">
                <FormControl className="input-control" placeholder="Nickname" />
              </InputGroup>
            </Form.Row>
            <Form.Row>
              <Button
                className="button-default"
                variant="primary"
                onClick={() => history.push('/lobby')}
                block
              >
                JOGAR
              </Button>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AuthPage;
