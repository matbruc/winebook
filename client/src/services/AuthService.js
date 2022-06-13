import axios from "axios";

class AuthService {
  login(email, password) {
    return axios
      .post(process.env.REACT_APP_API_URL + "/api/login", {
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
    return axios.post(process.env.REACT_APP_API_URL + "/api/register", {
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
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
