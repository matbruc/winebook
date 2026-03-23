import axios from "axios";

class AuthService {
  login(email, password) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';
    return axios
      .post(API_URL + "/api/login", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name, email, password) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';
    return axios.post(API_URL + "/api/register", {
      name,
      email,
      password
    }).then(response => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
