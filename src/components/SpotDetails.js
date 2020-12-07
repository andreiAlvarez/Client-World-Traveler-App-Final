import React from "react";
import SPOT_SERVICE from "../services/SpotService";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default class SpotDetails extends React.Component {
  state = {
    spot: {},
  };

  loadSpotDetails = () => {
    console.log({ props: this.props.match.params });
    SPOT_SERVICE.getSpotDetails(this.props.match.params.id)
      .then((responseFromServer) => {
        console.log({ spotDetails: responseFromServer.data });
        const { spot } = responseFromServer.data;
        this.setState({ spot });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    console.log("spot details component", this.state.spot);
    this.loadSpotDetails();
  }

  deleteSpot = (spotId) => {
    SPOT_SERVICE.deleteSpot(spotId)
      .then(() => {
        this.props.onSpotsChangeAfterDelete(spotId);
        this.props.history.push("/home");
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { _id, name, rating, pictureUrl } = this.state.spot;
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
          <h3>{name}</h3>
          {rating && <h2>Rating: {rating}</h2>}
        </div>
        <div >
          <img className="details-spot-image" src={pictureUrl} alt="spot"></img>
        </div>
        <div className="details-spot-buttons"> 
          {
            <>
              <Link className="edit-menu-link"
                to={{
                  pathname: `/spots/${_id}/edit`,
                  spot: this.state.spot,
                }}
              >
                Edit
              </Link>
              <br />
              <button className="delete-button" onClick={() => this.deleteSpot(_id)}>Delete</button>
            </>
          }
        </div>
        </section>
        <Footer />
      </div>
    );
  }
}

