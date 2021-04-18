import React from 'react';
import { Figure, Container } from 'react-bootstrap';
import background from '../assets/background.svg';

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      <Figure style={{ position: 'absolute' }}>
        <Figure.Image alt="Background" src={background} />
      </Figure>
      {children}
    </Container>
  );
};

export default Layout;
