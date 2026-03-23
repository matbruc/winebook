import axios from 'axios';
import ReportsService from '../ReportsService';
import authHeader from '../auth-header';

vi.mock('axios');
vi.mock('../auth-header');

describe('ReportsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authHeader.mockReturnValue({ Authorization: 'Bearer mock-token' });
  });

  const mockWinesPerProducer = [{ _id: '1', count: 5 }];
  const mockWinesPerRegion = [{ _id: '2', count: 10 }];
  const mockWinesPerSubregion = [{ _id: '3', count: 15 }];
  const mockTopWines = [{ name: 'Wine A', rating: 95 }];

  describe('getWineReport', () => {
    test('should return complete report when all requests succeed', async () => {
      axios.get.mockImplementation((url) => {
        if (url.includes('winesPerProducer')) {
          return Promise.resolve({ data: mockWinesPerProducer });
        } else if (url.includes('winesPerRegion')) {
          return Promise.resolve({ data: mockWinesPerRegion });
        } else if (url.includes('winesPerSubregion')) {
          return Promise.resolve({ data: mockWinesPerSubregion });
        } else if (url.includes('topWines')) {
          return Promise.resolve({ data: mockTopWines });
        }
        return Promise.resolve({ data: [] });
      });

      const { report, errors } = await ReportsService.getWineReport();

      expect(axios.get).toHaveBeenCalledTimes(4);
      expect(errors).toEqual([]);
      expect(report).toEqual({
        winesPerProducer: mockWinesPerProducer,
        winesPerRegion: mockWinesPerRegion,
        winesPerSubregion: mockWinesPerSubregion,
        topWines: mockTopWines
      });
    });

    test('should handle errors gracefully and return partial report', async () => {
      const mockError = { message: 'Network error' };

      axios.get.mockImplementation((url) => {
        if (url.includes('winesPerProducer')) {
          return Promise.resolve({ data: mockWinesPerProducer });
        }
        return Promise.reject(mockError);
      });

      const { report, errors } = await ReportsService.getWineReport();

      expect(errors).toHaveLength(3);
      expect(report.winesPerProducer).toEqual(mockWinesPerProducer);
      expect(report.winesPerRegion).toBeUndefined();
      expect(report.winesPerSubregion).toBeUndefined();
      expect(report.topWines).toBeUndefined();
    });

    test('should handle all requests failing', async () => {
      const mockError = { message: 'Network error' };
      axios.get.mockRejectedValue(mockError);

      const { report, errors } = await ReportsService.getWineReport();

      expect(axios.get).toHaveBeenCalledTimes(4);
      expect(errors).toHaveLength(4);
      expect(report).toEqual({});
    });

    test('should call authHeader for each request', async () => {
      axios.get.mockResolvedValue({ data: [] });

      await ReportsService.getWineReport();

      expect(axios.get).toHaveBeenCalledTimes(4);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/reports/winesPerProducer'),
        expect.objectContaining({ headers: { Authorization: 'Bearer mock-token' } })
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/reports/winesPerRegion'),
        expect.objectContaining({ headers: { Authorization: 'Bearer mock-token' } })
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/reports/winesPerSubregion'),
        expect.objectContaining({ headers: { Authorization: 'Bearer mock-token' } })
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/reports/topWines'),
        expect.objectContaining({ headers: { Authorization: 'Bearer mock-token' } })
      );
    });
  });
});
