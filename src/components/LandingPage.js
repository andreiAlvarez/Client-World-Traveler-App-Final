import React from "react";
import video from "./videoBackground.mp4";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="landing__page">
        <h1 className="become-title">Become a world traveler!</h1>
      <div className="landing-links">
          <Link className="link-title-sign" to="/signup-page">Signup</Link>
          <Link className="link-title-login" to="/login-page">Login</Link>
      </div>
      <video className="videoTag" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}
