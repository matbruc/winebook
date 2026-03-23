import axios from 'axios';
import UserService from '../UserService';
import authHeader from '../auth-header';

vi.mock('axios');
vi.mock('../auth-header');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authHeader.mockReturnValue({ Authorization: 'Bearer mock-token' });
  });

  const mockUsers = [
    { _id: '1', name: 'User 1', email: 'user1@test.com', role: 'user' },
    { _id: '2', name: 'User 2', email: 'user2@test.com', role: 'admin' }
  ];

  describe('getUsers', () => {
    test('should return users array', async () => {
      const mockResponse = { data: mockUsers };
      axios.get.mockResolvedValue(mockResponse);

      const result = await UserService.getUsers();

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:9000/api/users',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result.data).toEqual(mockUsers);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 401 } };
      axios.get.mockRejectedValue(mockError);

      await expect(UserService.getUsers()).rejects.toBeDefined();
    });
  });
});
