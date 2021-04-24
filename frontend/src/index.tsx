import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './services/reportWebVitals';
import { AuthProvider } from './services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

ReactDOM.render(
  <React.Fragment>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.Fragment>,
  document.getElementById('root'),
);

reportWebVitals();
