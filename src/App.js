import React, { Component } from 'react';
import { } from 'antd';
import { Route, Switch } from 'react-router-dom';
import Admin from './pages/admin/admin.jsx';
import Login from './pages/login/login.jsx';
import 'antd/dist/antd.less'
export default class App extends Component {
  render() {
    return (
      <div className="app" >
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
        </Switch>
      </div>
    )
  }
}