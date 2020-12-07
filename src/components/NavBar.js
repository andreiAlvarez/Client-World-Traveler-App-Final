import React from "react";
import { Link } from "react-router-dom";
import AUTH_SERVICE from "../services/AuthService";
import logo from "../images/logoTravel.png";

const NavBar = (props) => {
  const logoutAndLiftUserState = () => {
    AUTH_SERVICE.logout()
      .then(() => props.onUserChange(null))
      .catch((err) => console.log(err));
  };
  console.log(props);
  return (
    <nav className="navbar">
      <section className="menu-navbar">
        {props.currentUser && (
          <>
            <Link to="/home">
              {" "}
              <img src={logo} className="nav-menu-logo" alt="back"></img>{" "}
            </Link>
            <div className="menu-three">
              <Link to="/profile" className="nav-menu-link">
                Profile
              </Link>
              <Link to="/countries/create" className="nav-menu-link"> 
                Countries 
              </Link>
              <button className="log-button" onClick={logoutAndLiftUserState}>
                {" "}
                Logout{" "}
              </button>
            </div>
          </>
        )}
      </section>
      <h1 className="title-nav">
        Save your travel memories and get rewards for it!
      </h1>
    </nav>
  );
};

export default NavBar;
