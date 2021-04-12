import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './services/reportWebVitals';
import { SocketProvider } from './services/socket';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

ReactDOM.render(
  <React.Fragment>
    <SocketProvider>
      <Routes />
    </SocketProvider>
  </React.Fragment>,
  document.getElementById('root'),
);

reportWebVitals();
