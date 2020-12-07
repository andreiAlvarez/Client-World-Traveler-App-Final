import axios from "axios";

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true,
});

const COUNTRY_SERVICE = {
  createCountry(countryData) {
    let formData = new FormData();
    formData.append("pictureUrl", countryData.pictureUrl);
    formData.append("name", countryData.name);
    return service.post("/api/countries", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });  
  },
  getCountries() {
    return service.get("/api/countries");
  },
  deleteCountry(countryId) {
    return service.post(`/api/countries/${countryId}/delete`);
  },                    
  updateCountry(countryId, CountryData) {
    return service.post(`/api/countries/${countryId}/update`, CountryData);
  },
  getCountryDetails(countryId) {
    return service.get(`/api/countries/${countryId}`);
  },
};

export default COUNTRY_SERVICE;
