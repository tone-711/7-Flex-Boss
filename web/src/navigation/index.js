import React from "react";
import { Router, Route, Switch } from "wouter";
import RegisterEmployee from "../screens/RegisterEmployee";
import Shifts from "../screens/Shifts";
import Login from "../screens/Login";
import Register from "../screens/Register";
import CreateGig from "../screens/CreateGig";
import Addlocation from "../screens/AddLocation";
import Navbar from "../components/Navbar";


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
