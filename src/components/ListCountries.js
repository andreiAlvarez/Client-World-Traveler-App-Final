import React from "react";

const ListCountries = (props) => {
  console.log(`estas son las props: ${props}`);
  return (
    <section>
      <ul>
        <ul>
          {props.countries.map((country) => (
            <li key={country._id}>
              {country.firstName} {country.lastName}
            </li>
          ))}
        </ul>
      </ul>
    </section>
  );
};

export default ListCountries;
