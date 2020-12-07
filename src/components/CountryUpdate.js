import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

import COUNTRY_SERVICE from "../services/CountryService";

export default class UpdateCountry extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { _id, name, spots, imageArray } = this.props.location.country;

    this.state = {
      _id,
      name,
      spots,
      imageArray,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmission = (event) => {
    event.preventDefault();

    const { _id, name, spots, imageArray } = this.state;

    COUNTRY_SERVICE.updateCountry(_id, { name, spots, imageArray })
      .then((responseFromServer) => {
        // console.log('res from server in book update:', responseFromServer);
        const { country } = responseFromServer.data;
        this.props.history.push(`/countries/${country._id}`);
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { name } = this.state;
    //country
    console.log("Update spot component");

    return (
      <div>
        <nav>
          <NavBar
            currentUser={this.props.currentUser}
            onUserChange={this.props.onUserChange}
          />
        </nav>
        <section className="home-new">
          <h2 className="edit-title"> Edit Country Visited </h2>

          <form className="form-edit" onSubmit={this.handleFormSubmission}>
          <div className="labels-edit">
            <label>
              Country:
              <input 
              className="input-all"
                name="name"
                type="text"
                value={name}
                onChange={this.handleInputChange}
              />
            </label>
          </div>
            <button className="edit-button"> Save changes </button>
          </form>
        </section>
        <Footer />
      </div>
    );
  }
}
