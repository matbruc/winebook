import axios from 'axios';
import authHeader from './auth-header';

const API_URL = process.env.REACT_APP_API_URL;

class UserService {

  getUsers() {
    return axios.get(API_URL + '/api/users', { headers: authHeader() });
  }

}

export default new UserService();
