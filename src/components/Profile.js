import React from "react";
import { Link } from "react-router-dom";
import COUNTRY_SERVICE from "../services/CountryService";
import SPOT_SERVICE from "../services/SpotService";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spots: [],
      countries: [],
    };
  }

  componentDidMount() {
    this.setSpots();
    this.setCountries();
  }

  setSpots = () => {
    // this.props.getData();
    SPOT_SERVICE.getSpots()
      .then((spotsFromDb) => {
        console.log({ theSpots: spotsFromDb.data.spots });
        this.setState({ spots: spotsFromDb.data.spots });
      })
      .catch((err) => console.log(err));
  };

  setCountries = () => {
    console.log("setting countries");
    COUNTRY_SERVICE.getCountries()
      .then((countriesFromDb) => {
        console.log({ theCountries: countriesFromDb.data.countries });
        this.setState({ countries: countriesFromDb.data.countries });
      })
      .catch((err) => console.log(err));
  };

  displayingResults = () => {
    return (
      <>
      <div className="name-email-rewards-rewards">
        {this.state.countries.length >= 5 && <h3>You are a World Traveler</h3>}
        {this.state.countries.length >= 2 &&
          this.state.countries.length <= 4 && (
            <h3>You are a Premium Traveler</h3>
          )}
        {this.state.countries.length === 1 && (
          <h3>You are an Expert Traveler</h3>
        )}
      </div>
     <div className="countries-spots">
        <section className="section-countries-spot">
        <h2>Spot Visited: {this.state.spots.length}</h2>
            <ul>
              {this.state.spots.map((spot) => (
                <Link to={`spots/${spot._id}`} key={spot._id}>
                  <li>{spot.name}</li>
                </Link>
              ))}
            </ul>
        </section>
        <section className="section-countries-spot">
          <h2>Countries Visited: {this.state.countries.length}</h2>
            <ul>
              {this.state.countries.map((country) => (
                <Link to={`countries/${country._id}`} key={country._id}>
                  <li>{country.name}</li>
                </Link>
              ))}
            </ul>
        </section>
     </div>
      </>
    );
  };

  render() {
    return (
      <div>
        <nav>
          <NavBar
            currentUser={this.props.currentUser}
            onUserChange={this.props.onUserChange}
          />
        </nav>
        <div className="home-new-profile">
          <h3 className="name-email-rewards">{this.props.currentUser.username}</h3>
          <h3 className="name-email-rewards" id="email">{this.props.currentUser.email} </h3>
          {this.state.spots && this.state.countries && this.displayingResults()}
        </div>
        <Footer />
      </div>
    );
  }
}
