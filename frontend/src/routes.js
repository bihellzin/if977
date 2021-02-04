const { BrowserRouter, Switch, Route } = require("react-router-dom");

const pages = [{ path: "", component: "" }];

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        {pages.map(({ path, component }) => (
          <Route path={path} component={component} />
        ))}
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
