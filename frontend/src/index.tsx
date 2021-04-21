import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './services/reportWebVitals';
import { SocketProvider } from './services/socket';
import { AuthProvider } from './services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

ReactDOM.render(
  <React.Fragment>
    <AuthProvider>
      <SocketProvider>
        <Routes />
      </SocketProvider>
    </AuthProvider>
  </React.Fragment>,
  document.getElementById('root'),
);

reportWebVitals();
