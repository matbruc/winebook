import axios from 'axios';
import authHeader from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000';

class UserService {

  getUsers() {
    return axios.get(API_URL + '/api/users', { headers: authHeader() });
  }

}

export default new UserService();
