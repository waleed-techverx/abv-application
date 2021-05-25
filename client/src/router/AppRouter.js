import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createBrowserHistory } from 'history';
import { Route, Switch, Router } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import Logout from '../components/Logout';
import Account from '../components/Account';
import SideMenu from '../components/SideMenu'
import NavBar from '../components/NavBar';
import {CssBaseline} from '@material-ui/core';

export const history = createBrowserHistory();

const AppRouter = ({ auth }) => {
  return (
    
    <Router history={history}>
      {!_.isEmpty(auth.token) && <SideMenu />}
      <div>
        {!_.isEmpty(auth.token) && <NavBar />}
        
          <Switch>
            <Route path="/" component={Login} exact={true} />
            <Route path="/register" component={Register} />
            <Route path="/account" component={Account} />
            <Route path="/profile" component={Profile} />
            <Route path="/logout" component={Logout} />
          </Switch>
      
      </div>
      <CssBaseline/>
    </Router>
  );
};



const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AppRouter);