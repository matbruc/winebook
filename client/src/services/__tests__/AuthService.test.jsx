import axios from 'axios';
import AuthService from '../AuthService';

vi.mock('axios');

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    test('should login successfully and save user to localStorage', async () => {
      const mockResponse = {
        data: {
          email: 'test@test.com',
          token: 'mock-token',
          role: 'user'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login('test@test.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/api/login',
        { email: 'test@test.com', password: 'password123' }
      );
      expect(result).toEqual(mockResponse.data);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.data);
    });

    test('should handle login error and reject promise', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      };

      axios.post.mockRejectedValue(mockError);

      await expect(AuthService.login('test@test.com', 'wrongpassword'))
        .rejects
        .toBeDefined();
    });
  });

  describe('logout', () => {
    test('should remove user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ email: 'test@test.com', token: 'token' }));
      expect(localStorage.getItem('user')).toBeTruthy();

      AuthService.logout();

      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('register', () => {
    test('should register successfully and save user to localStorage', async () => {
      const mockResponse = {
        data: {
          name: 'Test User',
          email: 'test@test.com',
          token: 'mock-token',
          role: 'user'
        }
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register('Test User', 'test@test.com', 'password123');

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/api/register',
        { name: 'Test User', email: 'test@test.com', password: 'password123' }
      );
      expect(result).toEqual(mockResponse.data);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.data);
    });

    test('should handle registration error and reject promise', async () => {
      const mockError = {
        response: {
          data: { message: 'Email already exists' }
        }
      };

      axios.post.mockRejectedValue(mockError);

      await expect(AuthService.register('Test User', 'existing@test.com', 'password123'))
        .rejects
        .toBeDefined();
    });
  });

  describe('getCurrentUser', () => {
    test('should return null when no user in localStorage', () => {
      expect(AuthService.getCurrentUser()).toBeNull();
    });

    test('should return user object when user exists in localStorage', () => {
      const mockUser = { email: 'test@test.com', token: 'token', role: 'user' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      expect(AuthService.getCurrentUser()).toEqual(mockUser);
    });
  });
});
