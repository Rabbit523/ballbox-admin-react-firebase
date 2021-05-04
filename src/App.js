import React from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import withAuthentication from './views/Session/withAuthentication';
import Navigation from './views/Base/Navigation';
import * as ROUTES from './routes';

import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
});

const DASHBOARD = Loadable({
  loader: () => import('./views/Dashboard/Dashboard'),
  loading
});

const TAGTABLES = Loadable({
  loader: () => import('./views/Base/TagTables/TagTables'),
  loading
});

const EDIT_TAG = Loadable({
  loader: () => import('./views/Base/EditCategory/EditCategory'),
  loading
});

const ADD_TAG = Loadable({
  loader: () => import('./views/Base/Addcategory/Addcategory'),
  loading
});

const EVENTLIST = Loadable({
  loader: () => import('./views/Base/EventTables/EventTables'),
  loading
});

const EDIT_EVENT = Loadable({
  loader: () => import('./views/Base/EditEvent/EditEvent'),
  loading
});

const ADD_EVENT = Loadable({
  loader: () => import('./views/Base/Forms/Forms'),
  loading
});

const App = () => (
  <BrowserRouter>
    <div>
      <Navigation />
      
      <Switch>
      
        <Route path={ROUTES.SIGN_UP} component={Register} />
        <Route path={ROUTES.SIGN_IN} component={Login} />
        {/* <Route
          path={ROUTES.PASSWORD_FORGET}
          component={PasswordForgetPage}
        /> */}
        <Route exact path={ROUTES.DASHBOARD} component={DASHBOARD} />
        <Route exact path={ROUTES.TAGLIST} component={TAGTABLES} />
        <Route exact path={ROUTES.TAG_EDIT} component={EDIT_TAG} />
        <Route exact path={ROUTES.TAG_ADD} component={ADD_TAG} />
        <Route exact path={ROUTES.EVENTLIST} component={EVENTLIST} />
        <Route exact path={ROUTES.EVENT_EDIT} component={EDIT_EVENT} />
        <Route exact path={ROUTES.EVENT_ADD} component={ADD_EVENT} />
        <Route exact path={ROUTES.HOME} render={() => (<Redirect to={ROUTES.SIGN_IN} />)} /> 
      </Switch>
    </div>
  </BrowserRouter>
);
export default withAuthentication(App);
