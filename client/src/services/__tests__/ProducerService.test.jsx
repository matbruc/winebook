import axios from 'axios';
import ProducerService from '../ProducerService';
import authHeader from '../auth-header';

vi.mock('axios');
vi.mock('../auth-header');

describe('ProducerService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authHeader.mockReturnValue({ Authorization: 'Bearer mock-token' });
  });

  const mockProducer = {
    _id: '123',
    name: 'Test Producer',
    region: 'Tuscany',
    registered_on: '2020-01-01'
  };

  describe('getProducers', () => {
    test('should return producers array', async () => {
      const mockResponse = { data: [mockProducer] };
      axios.get.mockResolvedValue(mockResponse);

      const result = await ProducerService.getProducers();

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:9000/api/producers',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual([mockProducer]);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 401 } };
      axios.get.mockRejectedValue(mockError);

      await expect(ProducerService.getProducers()).rejects.toBeDefined();
    });
  });

  describe('getProducer', () => {
    test('should return single producer', async () => {
      const mockResponse = { data: mockProducer };
      axios.get.mockResolvedValue(mockResponse);

      const result = await ProducerService.getProducer('123');

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:9000/api/producers/123',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual(mockProducer);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.get.mockRejectedValue(mockError);

      await expect(ProducerService.getProducer('invalid')).rejects.toBeDefined();
    });
  });

  describe('createProducer', () => {
    test('should create producer and return it', async () => {
      const newProducer = { ...mockProducer, _id: 'new-id' };
      const mockResponse = { data: newProducer };
      axios.post.mockResolvedValue(mockResponse);

      const result = await ProducerService.createProducer(mockProducer);

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:9000/api/producers',
        mockProducer,
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result).toEqual(newProducer);
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 400 } };
      axios.post.mockRejectedValue(mockError);

      await expect(ProducerService.createProducer(mockProducer)).rejects.toBeDefined();
    });
  });

  describe('updateProducer', () => {
    test('should update producer', async () => {
      const mockResponse = { data: { ...mockProducer, name: 'Updated Producer' } };
      axios.patch.mockResolvedValue(mockResponse);

      const result = await ProducerService.updateProducer('123', { name: 'Updated Producer' });

      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:9000/api/producers/123',
        { name: 'Updated Producer' },
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result.data).toEqual({ ...mockProducer, name: 'Updated Producer' });
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.patch.mockRejectedValue(mockError);

      await expect(ProducerService.updateProducer('123', { name: 'Test' })).rejects.toBeDefined();
    });
  });

  describe('deleteProducer', () => {
    test('should delete producer', async () => {
      const mockResponse = { data: { acknowledged: true, deletedCount: 1 } };
      axios.delete.mockResolvedValue(mockResponse);

      const result = await ProducerService.deleteProducer('123');

      expect(axios.delete).toHaveBeenCalledWith(
        'http://localhost:9000/api/producers/123',
        { headers: { Authorization: 'Bearer mock-token' } }
      );
      expect(result.data).toEqual({ acknowledged: true, deletedCount: 1 });
    });

    test('should handle error and reject promise', async () => {
      const mockError = { response: { status: 404 } };
      axios.delete.mockRejectedValue(mockError);

      await expect(ProducerService.deleteProducer('123')).rejects.toBeDefined();
    });
  });
});
