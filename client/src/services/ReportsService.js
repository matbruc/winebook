import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

class ReportsService {

  async getWineReport() {
    let report = {};
    let errors = [];

    await axios.get(API_URL + "/api/reports/winesPerProducer", { headers: authHeader() })
      .then(response => {
        report.winesPerProducer = response.data;
      })
      .catch(error => {
        errors.push(error);
      })

    await axios.get(API_URL + "/api/reports/winesPerRegion", { headers: authHeader() })
      .then(response => {
        report.winesPerRegion = response.data;
      })
      .catch(error => {
        errors.push(error);
      })

    await axios.get(API_URL + "/api/reports/winesPerSubregion", { headers: authHeader() })
      .then(response => {
        report.winesPerSubregion = response.data;
      })
      .catch(error => {
        errors.push(error);
      })

    await axios.get(API_URL + "/api/reports/topWines", { headers: authHeader() })
      .then(response => {
        report.topWines = response.data;
      })
      .catch(error => {
        errors.push(error);
      })

    return { report, errors };
  }

}

export default new ReportsService();
