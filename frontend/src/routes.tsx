import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

function Routes() {
  return (
    <div id="layout">
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/room/:id" component={Room} exact />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;
