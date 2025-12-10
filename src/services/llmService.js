import api from './api';

/**
 * Frontend service that calls backend API for LLM report generation
 */
class LLMService {
  /**
   * Generate a comprehensive report from cleaned social media data
   */
  async generateReport(combinedData, username) {
    try {
      const response = await api.post('/api/generate-report', {
        combinedData,
        username,
      });

      return response.data.report;
    } catch (error) {
      console.error('Error generating report:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key configuration on the server.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error(error.response?.data?.error || error.message || 'Failed to generate report');
      }
    }
  }
}

export default new LLMService();
