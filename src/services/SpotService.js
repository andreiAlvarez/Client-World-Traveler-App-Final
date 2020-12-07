import axios from "axios";

const baseURL = process.env.REACT_APP_SERVER_POINT;

const service = axios.create({
  baseURL,
  withCredentials: true,
});

const SPOT_SERVICE = {
  createSpot(spotData) {
    let formData = new FormData();
    formData.append("pictureUrl", spotData.pictureUrl);
    formData.append("name", spotData.name);
    formData.append("rating", spotData.rating);
    return service.post("api/spots", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getSpots() {
    return service.get("/api/spots");
  },
  deleteSpot(spotId) {
    return service.post(`/api/spots/${spotId}/delete`);
  },
  updateSpot(spotId, spotData) {
    return service.post(`/api/spots/${spotId}/update`, spotData);
  },
  getSpotDetails(spotId) {
    return service.get(`/api/spots/${spotId}`);
  },
};

export default SPOT_SERVICE;
