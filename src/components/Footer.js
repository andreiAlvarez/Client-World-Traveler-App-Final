import React from 'react';

import linkedin from "../images/linkedin-logo.webp";
import github from "../images/github-logo.png";

export default function Footer() {
    return (
        <div>
            <footer className="footer">
            {" "}
            <h4 className="title-footer"> Made by Andrei Alvarez</h4>
            <div className="logo-personal-brand">
              <a href="https://github.com/andreiAlvarez" target="blank"><img className="images-logos-brand" src={github} alt="github"></img></a>
              <a href="https://www.linkedin.com/in/andreialvarez/" target="blank"><img className="images-logos-brand" src={linkedin} alt="linkedin"></img></a>
            </div>
          {" "}
          </footer>
        </div>
    )
}
