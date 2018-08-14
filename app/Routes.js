/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import config from './config.json';
import routes from './containers/routes';

export default () => (
  <App>
    <Switch>
      {config.mainRoutes.map(rt => (
        <Route
          key={routes[rt].path}
          path={routes[rt].path}
          component={routes[rt].component}
        />
      ))}
      <Redirect from="/" to="/home" />
    </Switch>
  </App>
);
