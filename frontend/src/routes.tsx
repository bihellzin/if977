import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import CreateRoom from './pages/CreateRoom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Room from './pages/Room';

function Routes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Auth} exact />
          <Route path="/room/:id" component={Room} exact />
          <Route path="/lobby" component={Home} exact />
          <Route path="/createroom" component={CreateRoom} exact />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default Routes;
