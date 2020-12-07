import React from "react";
import SearchSpot from "./SearchSpot";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Home = (props) => {
  console.log(props);

  return (
    <div>
     <nav>
        <NavBar
          currentUser={props.currentUser}
          onUserChange={props.onUserChange}
        />
      </nav>
    <section className="home__body">
      <section className="home-new">
        <h2 className="title-med">Enter your memory's place:</h2>
        <SearchSpot spots={props.spots} user={props.currentUser}/>
      </section>
    </section>
<Footer />
    </div>
  );
};

export default Home;
