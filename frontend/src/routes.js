import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/room/:id" component={Room} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
