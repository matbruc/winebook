import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class ProducerService {
  getProducers() {
    return axios.get(API_URL + "/api/producers", { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }
  getProducer(id) {
    return axios.get(API_URL + "/api/producers/" + id, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }
  updateProducer(id, producer) {
    return axios.patch(API_URL + "/api/producers/" + id, producer, { headers: authHeader() });
  }
  deleteProducer(id) {
    return axios.delete(API_URL + "/api/producers/" + id, { headers: authHeader() });
  }
  createProducer(producer) {
    return axios.post(API_URL + "/api/producers", producer, { headers: authHeader() })
      .then(response => {
        return response.data;
      });
  }
}

export default new ProducerService();
