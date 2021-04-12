import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar></Navbar>
      <Container>{children}</Container>
      <Container as="footer">
        <p className="text-center mt-3 mb-3">
          <Link to="/">30 Secongs</Link> © Todos os direitos reservados,{' '}
          {new Date().getFullYear()}.
        </p>
      </Container>
    </>
  );
};

export default Layout;
