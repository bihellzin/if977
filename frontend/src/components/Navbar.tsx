import React from 'react';
import { Container, Navbar, Nav, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const CustomNavbar = () => {
  const history = useHistory();

  const handleRoute = (location: string) => {
    history.push(location);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container as="header">
        <Navbar.Brand>30 Secongs</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => handleRoute('/')}>Início</Nav.Link>
            <Nav.Link onClick={() => handleRoute('/about')}>Sobre</Nav.Link>
          </Nav>
          <Form inline>
            <Button
              variant="outline-light"
              onClick={() => handleRoute('/auth')}
            >
              ENTRAR
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
