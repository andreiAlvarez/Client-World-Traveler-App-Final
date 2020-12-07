import React from "react";
import COUNTRY_SERVICE from "../services/CountryService";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default class CountryDetails extends React.Component {
  state = {
    country: {},
  };

  loadCountryDetails = () => {
    console.log({ props: this.props.match.params });
    COUNTRY_SERVICE.getCountryDetails(this.props.match.params.id)
      .then((responseFromServer) => {
        console.log({ countryDetails: responseFromServer.data });
        const { country } = responseFromServer.data;
        this.setState({ country });
        console.log("country details component", this.state.country);
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.loadCountryDetails();
  }

  deleteCountry = (countryId) => {
    COUNTRY_SERVICE.deleteCountry(countryId)
      .then(() => {
        this.props.onCountryChangeAfterDelete(countryId);
        this.props.history.push("/countries/create");
      })
      .catch((err) => console.log(err));
  };

  renderingCountryDetails = () => {
    console.log("rendering country")
    const { _id, name, pictureUrl } = this.state.country;
    return (
      <div>
<nav>
        <NavBar
          currentUser={this.props.currentUser}
          onUserChange={this.props.onUserChange}
        />
      </nav>
      <section className="details-spot">
      <div className="details-spot-info">
        <h3>Country: </h3>
        <h1>{name}</h1>
      </div>
      <div>
        <img className="details-spot-image" src={pictureUrl} alt="country"></img>
      </div>
        <div className="details-spot-buttons">
        { (
          <>
            <Link className="edit-menu-link"
              to={{
                pathname: `/countries/${_id}/edit`,
                country: this.state.country,
              }}
            >
              Edit
            </Link>
            <br />
            <button className="delete-button" onClick={() => this.deleteCountry(_id)}>Delete</button>
          </>
        )}
        </div>
      </section>
      <Footer />
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.state.country && this.renderingCountryDetails()}
      </div>
    )
  }
}