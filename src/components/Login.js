import React from "react";
import video from "./videoBackground.mp4";
import { Link } from "react-router-dom";
import arrow from "../images/arrowBlue.png";

import AUTH_SERVICE from "../services/AuthService";

export default class Login extends React.Component {
  state = {
    email: "",
    password: "",
    message: null,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmission = (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    AUTH_SERVICE.login({ email, password })
      .then((responseFromServer) => {
        const { user } = responseFromServer.data;

        // Lift the user object to the App.js
        this.props.onUserChange(user);

        // Redirect user to home page after successful sign up
        this.props.history.push("/home");
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          return this.setState({ message: err.response.data.message });
        }
      });
  };

  render() {
    return (
      <>
        <video className="videoTag" autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
        <div className="back-arow">
          <Link to="/">
            <img src={arrow} className="back-link" alt="back"></img>
          </Link>
        </div>
        <section className="login-section">
          <form onSubmit={this.handleFormSubmission} className="form-signup">
            <label className="country-input-login">
              Email:
              <input
              className="input-all-login"
                id="input-email"
                name="email"
                type="email"
                placeholder="ana@ironhack.com"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </label>
            <label className="country-input-login">
              Password:
              <input
              className="input-all-login"
                name="password"
                type="password"
                placeholder="**********"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </label>
            <button className="submit-menu-link-login"> Login </button>
            <div className="sign-link-login">
              <h6>Don't have an account? </h6>
              <Link className="link-title-login-signup" to="/signup-page">
                Signup
              </Link>
            </div>
          </form>
          {this.state.message && <div> {this.state.message} </div>}
        </section>
      </>
    );
  }
}
