import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AUTH_SERVICE from "./services/AuthService";
import COUNTRY_SERVICE from "./services/CountryService";
import SPOT_SERVICE from "./services/SpotService";

import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import CreateCountry from "./components/CreateCountry";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SpotDetails from "./components/SpotDetails";
import UpdateSpot from "./components/UpdateSpot";
import CountryDetails from "./components/CountryDetails";
import CountryUpdate from "./components/CountryUpdate";

export default class App extends React.Component {
  state = {
    currentUser: null,
    countries: [],
    spots: [],
  };

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    Promise.all([
      COUNTRY_SERVICE.getCountries(),
      SPOT_SERVICE.getSpots(),
      AUTH_SERVICE.getAuthenticatedUser(),
    ])
      .then((responseFromServer) => {
        console.log("Getting the spots from DB");
        const { countries } = responseFromServer[0].data;
        const { spots } = responseFromServer[1].data;
        const { user } = responseFromServer[2].data;

        this.setState({ countries, spots, currentUser: user });
      })
      .catch((err) => console.log(err));
  };

  updateUser = (user) => {
    this.setState({ currentUser: user });
  };

  updateCountries = (country) => {
    const updatedCountries = [...this.state.countries, country];
    this.setState({ countries: updatedCountries });
  };

  updateSpots = (spot) => {
    const updatedSpots = [...this.state.spots, spot];
    this.setState({ spots: updatedSpots });
  };

  updateSpotsAfterDelete = (id) => {
    const updatedSpots = [...this.state.spots];

    updatedSpots.splice(
      updatedSpots.findIndex((spot) => spot._id === id),
      1
    );
    this.setState({ spots: updatedSpots });
  };

  updateCountriesAfterDelete = (id) => {
    const updatedCountries = [...this.state.countries];

    updatedCountries.splice(
      updatedCountries.findIndex((country) => country._id === id),
      1
    );
    this.setState({ countries: updatedCountries });
  };

  render() {
    console.log("user in client: ", this.state.currentUser);
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            {/* <Route path='/somePage' component={someComponent} /> author */}
            <Route
              exact
              path="/"
              render={(props) => <LandingPage getData={this.getData} />}
            />
            {/* <Route exact path='/' render={props => <Home authors={this.state.authors} />} /> */}
            <Route
              exact
              path="/signup-page"
              render={(props) => (
                <Signup {...props} onUserChange={this.updateUser} />
              )}
            />
            <Route
              exact
              path="/login-page"
              render={(props) => (
                <Login {...props} onUserChange={this.updateUser} />
              )}
            />
            <ProtectedRoute
              exact
              path="/home"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <Home
                  {...props}
                  spots={this.state.spots}
                  countries={this.state.countries}
                  getData={this.getData}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/profile"
              authorized={this.state.currentUser}
              redirect={"/signup-page"}
              render={(props) => (
                <Profile
                  {...props}
                  currentUser={this.state.currentUser}
                  countries={this.state.countries}
                  spots={this.state.spots}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/spots/:id/edit"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <UpdateSpot
                  {...props}
                  countries={this.state.countries}
                  spots={this.state.spots}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/countries/create"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <CreateCountry
                  {...props}
                  onCountriesChange={this.updateCountries}
                  spots={this.state.spots}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/countries/:id/edit"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <CountryUpdate
                  {...props}
                  countries={this.state.countries}
                  spots={this.state.spots}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/spots/:id"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <SpotDetails
                  {...props}
                  // spots={this.state.spots}
                  onSpotsChangeAfterDelete={this.updateSpotsAfterDelete}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
            <ProtectedRoute
              exact
              path="/countries/:id"
              authorized={this.state.currentUser}
              redirect={"/login-page"}
              render={(props) => (
                <CountryDetails
                  {...props}
                  // spots={this.state.spots}
                  onCountryChangeAfterDelete={this.updateCountriesAfterDelete}
                  currentUser={this.state.currentUser}
                  onUserChange={this.updateUser}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
