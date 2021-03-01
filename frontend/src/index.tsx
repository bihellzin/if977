import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './services/reportWebVitals';
import { SocketProvider } from './services/socket';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <Routes />
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
