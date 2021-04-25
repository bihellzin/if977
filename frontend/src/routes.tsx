import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import CreateRoom from './pages/CreateRoom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Room from './pages/Room';
import client from 'services/api';
import { AuthContext } from 'services/auth';

const Routes: React.FC = () => {
  const [user, setUser] = React.useContext(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await client.get('/auth', {
          validateStatus: status => [200, 401].includes(status),
        });
        if (response.status === 200) {
          const { data } = response.data;
          setUser(data);
        } else if (response.status === 401) {
          sessionStorage.removeItem('token');
        }
      }
    };
    fetchData();
  }, [setUser]);

  const AuthGuard = (route: React.FC) => {
    return user.id ? route : Auth;
  };

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Auth} exact />
          <Route path="/lobby" component={AuthGuard(Home)} exact />
          <Route path="/room/:id" component={AuthGuard(Room)} exact />
          <Route path="/createroom" component={AuthGuard(CreateRoom)} exact />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default Routes;
