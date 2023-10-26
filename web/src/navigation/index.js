import React from "react";
import { Router, Route, Switch } from "wouter";

import Shifts from "../screens/Shifts";
import Login from "../screens/Login";
import Register from "../screens/Register";


const Private = (props) => {
  return (
    <React.Fragment>
      <Router hook={props.hook}>
        <Switch>
          <Route path="/" component={Shifts} />
          <Route path="/:rest*">404, not found!</Route>
        </Switch>
      </Router>
    </React.Fragment>
)
};

const Public = (props) => {
    return (
      <React.Fragment>
        <Router hook={props.hook}>
          <Switch>
            <Route path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/:rest*">404, not found!</Route>
          </Switch>
        </Router>
      </React.Fragment>
  )
  };

export {Private, Public};
