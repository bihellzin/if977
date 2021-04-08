import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Home from './pages/Home';
import Room from './pages/Room';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

function Routes() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/room/:id" component={Room} exact />
          <Route path="/about" component={About} exact />
          <Route path="/signin" component={Signin} exact />
          <Route path="/signup" component={Signup} exact />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default Routes;
