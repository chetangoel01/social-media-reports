import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Frontend service that calls backend API for Apify operations
 */
class ApifyService {
  /**
   * Fetch data from multiple platforms via backend API
   * @param {string[]} platforms - Array of platform names
   * @param {string} username - Username/handle to fetch
   * @param {Object} dateRange - Optional date range { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
   */
  async fetchMultiplePlatforms(platforms, username, dateRange = null) {
    try {
      const requestBody = { platforms, username };

      // Add date range if provided
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        requestBody.dateRange = dateRange;
      }

      const response = await axios.post(
        `${API_BASE}/api/fetch-social-data`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching social media data:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch social media data');
    }
  }
}

export default new ApifyService();
