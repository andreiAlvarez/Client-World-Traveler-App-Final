import React from "react";

import SPOT_SERVICE from "../services/SpotService";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default class UpdateSpot extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { _id, name, country, imageArray } = this.props.location.spot;

    this.state = {
      _id,
      name,
      country,
      imageArray,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmission = (event) => {
    event.preventDefault();

    const { _id, name, country, imageArray } = this.state;

    SPOT_SERVICE.updateSpot(_id, { name, country, imageArray })
      .then((responseFromServer) => {
        // console.log('res from server in book update:', responseFromServer);
        const { spot } = responseFromServer.data;
        this.props.history.push(`/spots/${spot._id}`);
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
          <h2 className="title-med"> Edit Place</h2>

          <form onSubmit={this.handleFormSubmission}>
            <label>
              Spot:
              <input
              className="input-all"
                name="name"
                type="text"
                value={name}
                onChange={this.handleInputChange}
              />
            </label>
            <button className="submit-menu-link"> Save changes </button>
          </form>
        </section>
        <Footer />
      </div>
    );
  }
}
