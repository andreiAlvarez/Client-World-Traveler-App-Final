import React from "react";
import COUNTRY_SERVICE from "../services/CountryService";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default class CreateCountry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      pictureUrl: "",
      user: "",
      spot: "",
      message: null,
      countries: [],
    };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    this.setCountries();
  }

  setCountries = () => {
    console.log("setting countries");
    COUNTRY_SERVICE.getCountries()
      .then((countriesFromDb) => {
        console.log({ theCountries: countriesFromDb.data.countries });
        this.setState({ countries: countriesFromDb.data.countries });
      })
      .catch((err) => console.log(err));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmission = (event) => {
    console.log("handle form submit");
    event.preventDefault();

    // alert(`Selected file - ${this.fileInput.current.files[0].name}`);
    const { name, pictureUrl } = this.state;
    console.log(pictureUrl);
    COUNTRY_SERVICE.createCountry({
      name,
      pictureUrl: this.fileInput.current.files[0],
    })
      .then((responseFromServer) => {
        console.log({ responseFromServer });

        this.setCountries();
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          return this.setState({ message: err.response.data.message });
        }
      });
  };

  render() {
    const { name, message } = this.state;
    return (
      <>
        <nav>
          <NavBar
            currentUser={this.props.currentUser}
            onUserChange={this.props.onUserChange}
          />
        </nav>
        <div className="details-spot">
        <section>
        <div className="details-spot-info">
          <h2>Add a country:</h2>
          <form onSubmit={this.handleFormSubmission}>
          <div className="country-input">
            <label>
              Country:
              <input
              className="input-all"
                name="name"
                type="text"
                placeholder="United States"
                value={name}
                onChange={this.handleInputChange}
              />
            </label>
          </div>

          <div className="country-file-create">
            <span className="file-input">
              Upload Picture:
               </span>
              <input type="file" ref={this.fileInput}></input>


            <button className="country-button"> Create Country </button>
          </div>


          </form></div>
          <div>{message && <div>{message}</div>}</div>
        </section>
        <section>
          <h2>Your Countries:</h2>
            <div className="countries-list">
              {this.state.countries &&
                this.state.countries.map((country) => (
                  <Link to={`/countries/${country._id}`} key={country._id}>
                    <div className="countries-link">{country.name}</div>
                  </Link>
                ))}
            </div>
        </section>
        </div>

        <Footer />
      </>
    );
  }
}
