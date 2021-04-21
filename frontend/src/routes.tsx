import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Home from './pages/Home';
import Room from './pages/Room';
import Auth from './pages/Auth';
import CreateRoom from './pages/CreateRoom';

function Routes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Auth} exact />
          <Route path="/room/:id" component={Room} exact />
          <Route path="/lobby" component={Home} exact />
          <Route path="/about" component={About} exact />
          <Route path="/createroom" component={CreateRoom} exact />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default Routes;
