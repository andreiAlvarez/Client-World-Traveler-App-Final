import React from "react";
import SPOT_SERVICE from "../services/SpotService";
import { Link } from "react-router-dom";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
// import { places } from "./places.JSON";

export default class SearchSpot extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      name: "",
      value: "",
      spotVisited: false,
      error: null,
      spotItems: [],
      rating: "",
      spots: [], 
      user: ""
    };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    this.setSpots();
  }

  setSpots = () => {
    // this.props.getData();
    SPOT_SERVICE.getSpots()
      .then((spotsFromDb) => {
        console.log({ theSpots: spotsFromDb.data.spots });
        this.setState({ spots: spotsFromDb.data.spots });
      })
      .catch((err) => console.log(err));
  };

  // Accepting the user input
  handleChange = (event) => {
    this.setState({ value: event.target.value });
    //  console.log({currentState: this.state})
  };

  updatingUser() {
    this.setState((state) => {
      return {user: this.props.user._id}
  });
}


  // Submiting the user's input and getting an api response
  handleSubmit = (event) => {
    console.log("handle submit");
    // alert('A place was submitted: ' + this.state.value);
    event.preventDefault();
    fetch(`http://localhost:3001/searchplace/${this.state.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(function (response) {
        return response.json();
        // console.log({response: response.json()});
      })
      .catch((err) => console.log({ err }))
      .then((myJson) => {
        console.log("------> ", myJson.candidates, { thisIs: this });
        this.setState({ spotItems: myJson.candidates });
      })
      .catch((error) => console.log({ error }));
  };

  // handleUpdatingSpots = (event) => {
  //   this.setState({ spots: this.state.spots.push(this.state.spotItems[0]) });
  //   console.log("is true ---> ", { currentState: this.state });
  // };

  handleSpotFormSubmission = (event) => {
    console.log("handle form submit");
    event.preventDefault();
    let { name, rating } = this.state.spotItems[0];
    let { user } = this.state.user;
    console.log({ name, rating, user });
    SPOT_SERVICE.createSpot({
      name,
      rating,
      user: this.updatingUser(),
      pictureUrl: this.fileInput.current.files[0],
    })
      .then((responseFromServer) => {
        console.log({ responseFromServer });
        // const { spot } = responseFromServer.data;

        // this.props.onSpotsChange(spot);
        // this.props.history.push("/home");
        this.setSpots();
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
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Spot:
              <input
              className="input-all"
              placeholder="Miami Beach"
                type="text"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </label>
            <input className="submit-menu-link" type="submit" value="Submit" />
          </form>
          {this.state.spotItems.map((spot) => {
            return (
              <div key={spot._id}>
                <h2>Name: {spot.name}</h2>
                <h3>Address: {spot.formatted_address}</h3>
                <form onSubmit={this.handleSpotFormSubmission}>
                  <label>
                    Upload file:
                    <input type="file" ref={this.fileInput}></input>
                    <input
                    className="submit-menu-link"
                      type="submit"
                      value="Confirm"
                      // onSubmit={this.handleUpdatingSpots}
                    ></input>
                  </label>
                </form>
              </div>
            );
          })}
        </div>
        <section className="spots-section">
          {this.state.spots.length >= 1 && <h2 className="your-spots" >Your Spots:</h2>}
          <CarouselProvider
            totalSlides={this.state.spots.length / 3}
            naturalSlideHeight={0}
            naturalSlideWidth={10}
            visibleSlides={1}
          >
            <Slider>
              <ul className="display-cards">
                {this.state.spots &&
                  this.state.spots.map((spot) => (
                    <Slide index={spot._id}>
                      <li>
                        {" "}
                        <Link to={`spots/${spot._id}`} key={spot.pictureUrl}>
                          <div className="card">
                            <div className="image-card">
                              <img
                                src={spot.pictureUrl}
                                alt="Avatar"
                                className="card-spot-home"
                              />
                            </div>

                            <div className="container">
                              <h4>
                                <b>{spot.name}</b>
                              </h4>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </Slide>
                  ))}
              </ul>{" "}
            </Slider>
            {this.state.spots.length >= 4 && (
              <div>
                <ButtonBack className="submit-menu-link">Back</ButtonBack>
                <ButtonNext className="submit-menu-link">Next</ButtonNext>
              </div>
            )}
          </CarouselProvider>
        </section>
        <section className="top-destinations">
          <h2 className="your-spots">Popular destinations around the world</h2>
          <CarouselProvider
            totalSlides={25}
            naturalSlideHeight={0}
            naturalSlideWidth={100}
            visibleSlides={1}
          >
            <Slider>
              <ul className="display-cards">
                {this.places &&
                  this.places.map((place) => (
                    <Slide index={place.id}>
                      <li>
                        {" "}
                      
                          <div className="card" key={place.id}>
                            <div className="image-card">
                              <img
                                src={place.urlToImage}
                                alt="Avatar"
                                className="card-spot-home"
                              />
                            </div>

                            <div className="container">
                              <h4>
                                <b>{place.spot}</b>
                              </h4>
                            </div>
                          </div>
                   
                      </li>
                    </Slide>
                  ))}
              </ul>{" "}
            </Slider>
            <ButtonBack className="submit-menu-link">Back</ButtonBack>
            <ButtonNext className="submit-menu-link">Next</ButtonNext>
          </CarouselProvider>
        </section>
      </>
    );
  }

  places = [
    {
      id: 1,
      spot: "Great Wall of China",
      points: 10,
      country: "China",
      urlToImage:
        "https://i.insider.com/5e21c57cab49fd40043ae7f5?width=700&format=jpeg&auto=webp",
      content:
        "At over 13,000 miles long, the Great Wall of China is a UNESCO World Heritage Site and was voted one of the New Seven Wonders of the World in 2007. The Mutianyu section of the Great Wall is the most popular with tourists, just two hours outside Beijing.",
    },
    {
      id: 2,
      spot: "Taj Mahal",
      points: 10,
      country: "India",
      urlToImage:
        "https://i.insider.com/5d38929736e03c2138374645?width=700&format=jpeg&auto=webp",
      content:
        "The Taj Mahal was built by the emperor Shah Jahan between 1631 and 1648. UNESCO calls it: the greatest architectural achievement in the whole range of Indo-Islamic architecture.",
    },
    {
      id: 3,
      spot: "Eiffel Tower",
      points: 10,
      country: "France",
      urlToImage:
        "https://i.insider.com/5d3878bb36e03c348c7cfcd6?width=700&format=jpeg&auto=webp",
      content:
        "No trip to France is complete without visiting the iconic Eiffel Tower, which was completed in 1889 and stands at 1,063 feet tall.",
    },
    {
      id: 4,
      spot: "Niagara Falls",
      points: 8,
      country: "United States and Canada",
      urlToImage:
        "https://i.insider.com/5d377bf436e03c29e93eed13?width=700&format=jpeg&auto=webp",
      content:
        "With about 30 million visitors a year, Niagara Falls is one of the most popular waterfalls in the world.",
    },
    {
      id: 5,
      spot: "Christ the Redeemer, Rio de Janeiro",
      points: 10,
      country: "Brazil",
      urlToImage:
        "https://i.insider.com/5d3776e836e03c01ae25c453?width=700&format=jpeg&auto=webp",
      content:
        "The 98-foot-tall statue in Tijuca Forest National Park can be seen for miles and is one of the new seven wonders of the world.",
    },
    {
      id: 6,
      spot: "Old Havana",
      points: 7,
      country: "Cuba",
      urlToImage:
        "https://i.insider.com/5d377fd436e03c170541f807?width=700&format=jpeg&auto=webp",
      content:
        "Old Havana was founded around 1519. It has five plazas serving as historical city centers with Baroque and neoclassical architecture and is a UNESCO World Heritage Site.",
    },
    {
      id: 7,
      spot: "Burj Khalifa",
      points: 9,
      country: "United Arab Emirates",
      urlToImage:
        "https://i.insider.com/5d38c33536e03c120b6d5233?width=700&format=jpeg&auto=webp",
      content:
        "Burj Khalifa in Dubai holds seven world records, including the tallest building in the world, at 2,716 feet tall.",
    },
    {
      id: 8,
      spot: "Great Sphinx",
      points: 10,
      country: "Egypt",
      urlToImage:
        "https://i.insider.com/5d3867af36e03c4a363b5c44?width=700&format=jpeg&auto=webp",
      content:
        "The Great Sphinx with the face of the ancient Egyptian King Khafre is 240 feet long and 66 feet high.",
    },
    {
      id: 9,
      spot: "Mount Fuji",
      points: 8,
      country: "Japan",
      urlToImage:
        "https://i.insider.com/5d38bf5536e03c0465428de6?width=700&format=jpeg&auto=webp",
      content:
        "Climbing all 12,388 feet of Mount Fuji isn't for the faint of heart, but it's doable to reach the summit in a day or two.",
    },
    {
      id: 10,
      spot: "Buckingham Palace",
      points: 8,
      country: "United Kingdom",
      urlToImage:
        "https://www.telegraph.co.uk/content/dam/Travel/2017/April/buckingham-palace-london.jpg",
      content:
        "Buckingham Palace is the British monarchy's administrative headquarters with a total of 775 rooms. Tourists who time their visits right can witness the Changing of the Guard ceremony, and may even catch a glimpse of a member of the royal family.",
    },
    {
      id: 11,
      spot: "Sydney Opera House",
      points: 8,
      country: "Australia",
      urlToImage:
        "https://i.insider.com/5d37715d36e03c3ec304ccd6?width=700&format=jpeg&auto=webp",
      content:
        "This symbol of the Sydney Harbor and UNESCO World Heritage Site opened in 1973 and remains one of the most recognizable buildings in the world.",
    },
    {
      id: 12,
      spot: "Parthenon",
      points: 10,
      country: "Greece",
      urlToImage:
        "https://i.insider.com/5d3879da36e03c1d1260f734?width=700&format=jpeg&auto=webp",
      content:
        "Built in the 5th century BCE for the goddess Athena, much of the white marble basic structure has remained.",
    },
    {
      id: 13,
      spot: "Las Vegas",
      points: 9,
      country: "United States",
      urlToImage:
        "https://www.sorianoviajes.com.uy/viajes/oeste%20anericano/image%20-%20copia.jpg",
      content:
        "The city bills itself as The Entertainment Capital of the World, and is famous for its mega casino-hotels and associated activities.",
    },
    {
      id: 14,
      spot: "Salar de Uyuni",
      points: 9,
      country: "Bolivia",
      urlToImage:
        "https://i.insider.com/5b4d00d1ba49431c008b4586?width=700&format=jpeg&auto=webp",
      content:
        "The world's largest salt flat makes for some amusing photo opportunities that play with perspective.",
    },
    {
      id: 15,
      spot: "La Sagrada Familia",
      points: 9,
      country: "Spain",
      urlToImage:
        "https://i.insider.com/5d38bcc136e03c10dd2815b6?width=700&format=jpeg&auto=webp",
      content:
        "Construction on the ornate temple began in 1882 and still isn't finished (the expected completion date is 2026). Over 4.5 million people visit the cathedral each year.",
    },
    {
      id: 16,
      spot: "Blue Lagoon",
      points: 7,
      country: "Iceland",
      urlToImage:
        "https://i.insider.com/57a0b9b0d7c3dbb8028b5e33?width=1100&format=jpeg&auto=webp",
      content:
        "Contrary to popular belief, the Blue Lagoon isn't a naturally-occurring phenomenon. It's made from a nearby geothermal power plant's discharge. ",
    },
    {
      id: 17,
      spot: "Chichen-Itza",
      points: 10,
      country: "Mexico",
      urlToImage:
        "https://i.insider.com/5d3896e336e03c548d2a598a?width=700&format=jpeg&auto=webp",
      content:
        "This ancient Mayan settlement dates back to the 400s and was abandoned in the 15th century. Thousands of people visit its remains each day.",
    },
    {
      id: 18,
      spot: "Hobbiton",
      points: 8,
      country: "New Zealand",
      urlToImage:
        "https://i.insider.com/5d38a4d836e03c25514c8684?width=700&format=jpeg&auto=webp",
      content:
        "Fans of 'The Lord of the Rings' can visit Middle Earth in the form of Hobbiton, the movie set used to film scenes in the Shire for the 'Lord of the Rings' movies.",
    },
    {
      id: 19,
      spot: "Dubrovnik Old Town",
      points: 8,
      country: "Croatia",
      urlToImage:
        "https://i.insider.com/5d38754b36e03c1c25565f17?width=700&format=jpeg&auto=webp",
      content:
        "The Dubrovnik Old Town is one of the most well-preserved medieval cities in the world with enormous walls dating back to the 11th century.",
    },
    {
      id: 20,
      spot: "Ba Na Hill mountain resort",
      points: 7,
      country: "Vietnam",
      urlToImage:
        "https://i.insider.com/5d38b0b336e03c401422cdf8?width=700&format=jpeg&auto=webp",
      content:
        "Ba Na Hill's attractions include cable cars through the mountains, the Golden Bridge held up by enormous stone hands, and theme park rides.",
    },
    {
      id: 21,
      spot: "Victoria Falls",
      points: 9,
      country: "Zambia",
      urlToImage:
        "https://i.insider.com/5d38b84c36e03c28c6288eaa?width=700&format=jpeg&auto=webp",
      content:
        "At the border of Zambia and Zimbabwe lies Victoria Falls, a 354-foot waterfall that has been called 'the greatest curtain of falling water in the world.'",
    },
    {
      id: 22,
      spot: "Disney World",
      points: 9,
      country: "United States",
      urlToImage:
        "https://i.insider.com/5d38ad7236e03c01a7108a67?width=700&format=jpeg&auto=webp",
      content:
        "Disney World is one of the most popular tourist sites in the US with over 17 million visitors every year.",
    },
    {
      id: 23,
      spot: "Anne Frank House",
      points: 8,
      country: "The Netherlands",
      urlToImage:
        "https://i.insider.com/5d38c86236e03c00a8103607?width=700&format=jpeg&auto=webp",
      content:
        "Anne Frank's diary chronicling her life before World War II, her years hiding from the Nazis, and her musings as a young woman became world famous after the war. Visiting the Anne Frank House in Amsterdam where her family hid in a secret annex requires a reservation months in advance. ",
    },
    {
      id: 24,
      spot: "Leaning Tower of Pisa",
      points: 10,
      country: "Italy",
      urlToImage:
        "https://i.insider.com/5d38ca7d36e03c5dfa2ed4e3?width=700&format=jpeg&auto=webp",
      content:
        "It's nearly impossible to resist the optical illusion photo-ops that the leaning tower of Pisa provides. Construction on the building began in 1173, and it currently leans about four degrees.",
    },
    {
      id: 25,
      spot: "Tianzi mountains",
      points: 9,
      country: "China",
      urlToImage:
        "https://i.insider.com/5e837bdf14f18f671e0dea06?width=700&format=jpeg&auto=webp",
      content:
        "An inspiration for the alien visages in James Cameron's 'Avatar,' some of the towers are as tall as 4,100 feet with sandstone peaks that are 300 million years old. The ledges capture soil, allowing forests to grow around and even on top of the peaks. ",
    },
    {
      id: 26,
      spot: "Antelope Canyon",
      points: 9,
      country: "United States",
      urlToImage:
        "https://i.insider.com/5e83859d14f18f6ed918b883?width=700&format=jpeg&auto=webp",
      content:
        "A slot canyon in Arizona, Antelope Canyon, has narrow walkways that were formed by millions of years of water erosion.",
    },
    {
      id: 27,
      spot: "Geiranger Fjord",
      points: 9,
      country: "Norway",
      urlToImage:
        "https://res.cloudinary.com/simpleview/image/upload/v1450117455/clients/norway/unesco-geirangerfjord-skagefla-waterfall-2-1_6cc6a64a-a204-432e-8753-01ef2080f24e.jpg",
      content:
        "A fjord is best described as an underwater valley. Formed by glaciers, these long and narrow waterways are deep and surrounded by steep mountains on all sides. The Geiranger Fjord is one of Norway's most famous, and is also a UNESCO World Heritage site.",
    },
    {
      id: 28,
      spot: "Beach of the Cathedrals",
      points: 8,
      country: "Spain",
      urlToImage:
        "https://i.insider.com/5ac68628facba83a008b45ac?width=700&format=jpeg&auto=webp",
      content:
        "These incredible buttress-like formations were shaped solely by nature.",
    },
    {
      id: 29,
      spot: " Cliffs of Moher",
      points: 9,
      country: "Ireland",
      urlToImage:
        "https://i.insider.com/5b4e03baafb775b6008b45b9?width=700&format=jpeg&auto=webp",
      content:
        "One of Ireland's most-visited natural attractions, the Cliffs of Moher stretch along the country's west coast for five majestic miles.",
    },
    {
      id: 30,
      spot: "Grand Canyon",
      points: 9,
      country: "United States",
      urlToImage:
        "https://i.insider.com/5bf4274d48eb12375d11e7e3?width=700&format=jpeg&auto=webp",
      content:
        "The canyon stretches on for 277 river miles and spans 18 miles from side to side. While the South Rim is open all year round, the North Rim is open to visitors on a more seasonal basis.",
    },
    {
      id: 31,
      spot: "Iguazu Falls",
      points: 9,
      country: "Argentina and Brazil",
      urlToImage:
        "https://i.insider.com/5e83afb71378e3054050f475?width=700&format=jpeg&auto=webp",
      content:
        "Spanning Argentina and Brazil, the Iguazu Falls are part of a massive waterfall system that totals around 275 waterfalls.",
    },
    {
      id: 32,
      spot: "Blyde River Canyon",
      points: 9,
      country: "South Africa",
      urlToImage:
        "https://i.insider.com/5b5b36b0bda1c723008b4580?width=700&format=jpeg&auto=webp",
      content:
        "Blyde River Canyon sits at an elevation of more than 2,600 feet. This canyon also boasts diverse flora and fauna.",
    },
    {
      id: 33,
      spot: "Amalfi Coast",
      points: 10,
      country: "Italy",
      urlToImage:
        "https://i.insider.com/5d10dca39c510114d845407a?width=700&format=jpeg&auto=webp",
      content:
        "The Amalfi Coast is a popular tourist destination for the region and Italy as a whole, attracting thousands of tourists annually. In 1997, the Amalfi Coast was listed as a UNESCO World Heritage Site.",
    },
    {
      id: 34,
      spot: "Great Barrier Reef",
      points: 9,
      country: "Australia",
      urlToImage:
        "https://i.insider.com/5d10e7179c5101134d12e827?width=700&format=jpeg&auto=webp",
      content:
        "The Great Barrier Reef is the world's largest coral reef system composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres (1,400 mi) over an area of approximately 344,400 square kilometres.",
    },
    {
      id: 35,
      spot: "Santorini",
      points: 8,
      country: "Greece",
      urlToImage:
        "https://upload.wikimedia.org/wikipedia/commons/5/5b/Fira_by_night.jpg",
      content:
        "Santorini was ranked the world's top island by many magazines and travel sites. Akrotiri is a major archaeological site, with ruins from the Minoan era. An estimated 2 million tourists visit annually.",
    },
    {
      id: 36,
      spot: "Patagonia",
      points: 8,
      country: "Argentina",
      urlToImage:
        "https://i.insider.com/5a42a2d9430d0329008b4693?width=700&format=jpeg&auto=webp",
      content:
        "The five dramatic Patagonian provinces stretch from the ice fields and granite peaks of the Andes mountains to the rugged Atlantic coast, where southern right whales gather to breed. A nature lover's dream, it's also home to the sizable Peninsula Valdes southern elephant seal colony and the world's largest Magellanic penguin colony.",
    },
    {
      id: 37,
      spot: "Florence",
      points: 9,
      country: "Italy",
      urlToImage:
        "https://i.insider.com/5d1100e89c510117875ec662?width=700&format=jpeg&auto=webp",
      content:
        "The city attracts millions of tourists each year, and UNESCO declared the Historic Centre of Florence a World Heritage Site in 1982. The city contains numerous museums and art galleries, such as the Uffizi Gallery and the Palazzo Pitti, and still exerts an influence in the fields of art, culture and politics.",
    },
    {
      id: 38,
      spot: "San Francisco",
      points: 8,
      country: "United States",
      urlToImage:
        "https://i.insider.com/5d1108ec9c51011cd05bd884?width=700&format=jpeg&auto=webp",
      content:
        "San Francisco, California, is home to Alcatraz Island, the Golden Gate Bridge, Lombard Street, and the Painted Ladies.",
    },
    {
      id: 39,
      spot: "Amsterdam",
      points: 8,
      country: "Netherlands",
      urlToImage:
        "https://i.insider.com/5d110bec9c510105f05e9212?width=700&format=jpeg&auto=webp",
      content:
        "As the capital of the Netherlands, Amsterdam is one of the most popular cities to visit in Europe. Travelers can explore more than 165 canals, the Van Gogh Museum, the Anne Frank House, and Red Light District.",
    },
    {
      id: 40,
      spot: "Maldives",
      points: 9,
      country: "Maldives",
      urlToImage:
        "https://i.insider.com/5d110daa9c5101195473ecb3?width=700&format=jpeg&auto=webp",
      content:
        "Located off the southern coast of India, the Maldives is a stunning collection of islands clustered around coral reefs.",
    },
    {
      id: 41,
      spot: "Machu Picchu",
      points: 10,
      country: "Peru",
      urlToImage:
        "https://i.insider.com/5d1111e19c51011ac82887c3?width=700&format=jpeg&auto=webp",
      content:
        "Machu Picchu is a lost ancient Incan city located 7,972 feet above sea level in Peru's Andes Mountains.",
    },
    {
      id: 42,
      spot: "New York City",
      points: 10,
      country: "United States",
      urlToImage:
        "https://i.insider.com/5d11149b9c51011b1f437664?width=700&format=jpeg&auto=webp",
      content:
        "From museums and skyscrapers galore to the quiet serenity of Central Park, New York City has five boroughs worth of activities to partake in and sites to see.",
    },
    {
      id: 43,
      spot: "Rainbow Mountain",
      points: 9,
      country: "Peru",
      urlToImage:
        "https://i.insider.com/5c817383eb3ce87b2721ede6?width=900&format=jpeg&auto=webp",
      content:
        "In the middle of the 2010s, mass tourism came to Rainbow Mountain, attracted by the mountain's series of stripes of various colors due to its mineralogical composition on the slopes and summits.",
    },
    {
      id: 44,
      spot: "Venice",
      points: 10,
      country: "Italy",
      urlToImage:
        "https://expertvagabond.com/wp-content/uploads/venice-italy-sunset-900x600.jpg",
      content:
        "The City of Water is celebrated because of its unusual circumstances, sitting on 100+ small islands connected by over 400 bridges. There are basically no roads, transportation is accomplished via boats on a confusing network of canals.",
    },
    {
      id: 45,
      spot: "Petra",
      points: 10,
      country: "Jordan",
      urlToImage:
        "https://blog.grandvoyage.com/wp-content/uploads/2018/12/petra-grandvoyage-01-800x420.jpg",
      content:
        "Famous for its rock-cut architecture and water conduit system, Petra is also called the 'Rose City' because of the colour of the stone from which it is carved. It has been a UNESCO World Heritage Site since 1985. UNESCO has described Petra as 'one of the most precious cultural properties of man's cultural heritage'.",
    },
    {
      id: 46,
      spot: "Colosseum",
      points: 10,
      country: "Italy",
      urlToImage:
        "https://mymodernmet.com/wp/wp-content/uploads/2019/05/colosseum-facts-3.jpg",
      content:
        "Earthquakes and stone-robbers have left the Colosseum in a state of ruin, but portions of the structure remain open to tourists, and its design still influences the construction of modern-day amphitheaters, some 2,000 years later.",
    },
    {
      id: 47,
      spot: "Tokyo",
      points: 8,
      country: "Japan",
      urlToImage:
        "https://i.insider.com/55f9e1b59dd7cc10008bae25?width=700&format=jpeg&auto=webp",
      content:
        "Tokyo has more signs than any other city in the world. From the city, you can only see Mount Fuji about 80 days a year.",
    },
    {
      id: 48,
      spot: "Singapore",
      points: 9,
      country: "Singapore",
      urlToImage:
        "https://static.independent.co.uk/s3fs-public/thumbnails/image/2019/03/11/10/singapore.jpg",
      content:
        " It’s a city of (man-made) waterfalls. No trip to Singapore is complete without a visit to the world’s tallest indoor waterfall in Jewel Changi Airport. The HSBC Rain Vortex soars at 40 metres, and is surrounded by a lush indoor garden.",
    },
    {
      id: 49,
      spot: "Big Ben",
      points: 9,
      country: "United Kingdom",
      urlToImage:
        "https://lp-cms-production.imgix.net/image_browser/london-big-ben.jpg",
      content:
        "Big Ben is arguably London’s most famous landmark. Surprisingly, it is actually meant to go by the name ‘The Clock Tower’, while ‘Big Ben’ is the name of the bell. Feel free to bore your friends and family with that fact if you ever do a tour of London.",
    },
    {
      id: 50,
      spot: "Bangkok",
      points: 9,
      country: "Thailand",
      urlToImage:
        "https://cms.finnair.com/resource/blob/498774/0ca442250fd3a3623b0fb674885655ac/bangkok-shopping-data.jpg?impolicy=crop&width=3888&height=2187&x=0&y=204&imwidth=768",
      content:
        "That’s just the abbreviated form of the Thai name for Bangkok. The entire name has 169 characters making it the longest city name in the world. Take a deep breath and prepare to read the full city name; here goes: Krungthepmahanakhon Amonrattanakosin Mahinthara Yutthaya Mahadilok Phop Noppharat Ratchathani Burirom Udom Ratchaniwet Mahasathan Amonphiman Awatansathit Sakkathattiya Witsanukamprasit.",
    },
  ];
}
