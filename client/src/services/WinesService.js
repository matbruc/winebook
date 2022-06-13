import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class WinesService {
  getWines() {
    return axios.get(API_URL + "/api/wines", { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }

  getWine(id) {
    return axios.get(API_URL + "/api/wines/" + id, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }

  updateWine(id, wine) {
    return axios.patch(API_URL + "/api/wines/" + id, wine, { headers: authHeader() });
  }

  deleteWine(id) {
    return axios.delete(API_URL + "/api/wines/" + id, { headers: authHeader() });
  }

  createWine(wine) {
    return axios.post(API_URL + "/api/wines", wine, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }

}

export default new WinesService();
