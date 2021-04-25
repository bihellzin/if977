import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import reportWebVitals from './services/reportWebVitals';
import { AuthProvider } from './services/auth';
import { SoundProvider } from './services/sound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

ReactDOM.render(
  <React.Fragment>
    <AuthProvider>
      <SoundProvider>
        <Routes />
      </SoundProvider>
    </AuthProvider>
  </React.Fragment>,
  document.getElementById('root'),
);

reportWebVitals();
