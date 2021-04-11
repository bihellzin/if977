import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';

const AuthPage: React.FC = () => {
  return (
    <Row className="justify-content-md-center">
      <Col xs={6}>
        <h1>Autenticar-se</h1>
        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Digite seu e-mail" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Digite sua senha" />
          </Form.Group>
          <Button variant="secondary" type="submit" block>
            Autenticar
          </Button>
        </Form>
      </Col>
      <Col xs={6}>
        <h1>Inscrever-se</h1>
        <Form>
          <Form.Group>
            <Form.Label>Nickname</Form.Label>
            <Form.Control type="text" placeholder="Digite seu nickname" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Digite seu e-mail" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Digite sua senha" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repita a senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha novamente"
            />
          </Form.Group>
          <Button variant="primary" type="submit" block>
            Inscrever
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default AuthPage;
