import React from 'react';
import { Figure, Container } from 'react-bootstrap';
import background from 'assets/background.png';
import './styles.scss';

const Layout: React.FC = ({ children }) => {
  return (
    <Container id="wrap">
      <Figure className="background-img">
        <Figure.Image alt="Background" src={background} />
      </Figure>
      {children}
    </Container>
  );
};

export default Layout;
