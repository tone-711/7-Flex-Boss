import React from "react";
import Login from "../screens/Login";
import Shifts from "../screens/Shifts";
import Navbar from "../components/Navbar";
import Register from "../screens/Register";
import CreateGig from "../screens/CreateGig";
import { Router, Route, Switch } from "wouter";
import Addlocation from "../screens/AddLocation";
import RegisterEmployee from "../screens/RegisterEmployee";

const Private = (props) => {
  return (
    <React.Fragment>
      <Navbar />
      <Router hook={props.hook}>
        <Switch>
          <Route path="/" component={Shifts} />
          <Route path="/creategig" component={CreateGig} />
          <Route path="/addlocation" component={Addlocation} />
          <Route path="/registeremployee" component={RegisterEmployee} />
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
