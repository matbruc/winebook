import axios from 'axios';
import WinesService from '../WinesService';
import authHeader from '../auth-header';

vi.mock('axios');
vi.mock('../auth-header');

describe('WinesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authHeader.mockReturnValue({ Authorization: 'Bearer mock-token' });
  });

  const mockWine = {
    _id: '123',
    name: 'Test Wine',
    year: 2020,
    variety: 'Cabernet',
    region: 'Tuscany',
    subregion: 'Chianti',
    country: 'Italy',
    producer: 'Test Producer',
    review: 'Great wine',
    rating: 90
  };

  describe('getWines', () => {
    test('should return wines array', async () => {
      const mockResponse = { data: [mockWine] };
      axios.get.mockResolvedValue(mockResponse);

      const result = await WinesService.getWines();

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:9000/api/wines',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual([mockWine]);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 401 } };
      axios.get.mockRejectedValue(mockError);

      await expect(WinesService.getWines()).rejects.toBeDefined();
    });
  });

  describe('getWine', () => {
    test('should return single wine', async () => {
      const mockResponse = { data: mockWine };
      axios.get.mockResolvedValue(mockResponse);

      const result = await WinesService.getWine('123');

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:9000/api/wines/123',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual(mockWine);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.get.mockRejectedValue(mockError);

      await expect(WinesService.getWine('invalid')).rejects.toBeDefined();
    });
  });

  describe('createWine', () => {
    test('should create wine and return it', async () => {
      const newWine = { ...mockWine, _id: 'new-id' };
      const mockResponse = { data: newWine };
      axios.post.mockResolvedValue(mockResponse);

      const result = await WinesService.createWine(mockWine);

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/api/wines',
        mockWine,
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual(newWine);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 400 } };
      axios.post.mockRejectedValue(mockError);

      await expect(WinesService.createWine(mockWine)).rejects.toBeDefined();
    });
  });

  describe('updateWine', () => {
    test('should update wine', async () => {
      const mockResponse = { data: { ...mockWine, name: 'Updated Wine' } };
      axios.patch.mockResolvedValue(mockResponse);

      const result = await WinesService.updateWine('123', { name: 'Updated Wine' });

      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:9000/api/wines/123',
        { name: 'Updated Wine' },
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result.data).toEqual({ ...mockWine, name: 'Updated Wine' });
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.patch.mockRejectedValue(mockError);

      await expect(WinesService.updateWine('123', { name: 'Test' })).rejects.toBeDefined();
    });
  });

  describe('deleteWine', () => {
    test('should delete wine', async () => {
      const mockResponse = { data: { acknowledged: true, deletedCount: 1 } };
      axios.delete.mockResolvedValue(mockResponse);

      const result = await WinesService.deleteWine('123');

      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:9000/api/wines/123',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result.data).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.delete.mockRejectedValue(mockError);

      await expect(WinesService.deleteWine('123')).rejects.toBeDefined();
    });
  });
});
