import api from './api';

/**
 * Service for storing and retrieving reports from backend database
 */
class ReportStorage {
  /**
   * Save a report to the database
   * @param {string} username - The username/handle
   * @param {Array} platforms - Array of platform names
   * @param {string} reportData - The generated markdown report
   * @param {Array} rawPlatformData - Raw JSON data from Apify (array of platform results)
   * @param {Object} dateRange - Optional date range { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
   */
  async saveReport(username, platforms, reportData, rawPlatformData, dateRange = null) {
    try {
      const response = await api.post('/api/reports', {
        username,
        platforms,
        report: reportData,
        rawData: rawPlatformData,
        dateRange: dateRange,
      });

      return response.data;
    } catch (error) {
      console.error('Error saving report:', error);
      // Fallback to localStorage if backend fails
      return this.fallbackToLocalStorage(username, platforms, reportData, rawPlatformData, dateRange);
    }
  }

  /**
   * Fallback to localStorage if backend is unavailable
   */
  fallbackToLocalStorage(username, platforms, reportData, rawPlatformData, dateRange = null) {
    const STORAGE_KEY = 'social_media_reports';
    const MAX_STORED_REPORTS = 10;

    try {
      const reports = this.getAllReportsFromLocalStorage();

      const newReport = {
        id: Date.now().toString(),
        username,
        platforms,
        report: reportData,
        rawData: rawPlatformData,
        dateRange: dateRange,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingIndex = reports.findIndex(
        r => r.username === username &&
             JSON.stringify(r.platforms.sort()) === JSON.stringify(platforms.sort())
      );

      if (existingIndex !== -1) {
        reports[existingIndex] = {
          ...reports[existingIndex],
          report: reportData,
          rawData: rawPlatformData,
          dateRange: dateRange,
          updatedAt: new Date().toISOString(),
        };
      } else {
        reports.unshift(newReport);
        if (reports.length > MAX_STORED_REPORTS) {
          reports.pop();
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      return newReport;
    } catch (error) {
      console.error('Error in localStorage fallback:', error);
      return null;
    }
  }

  /**
   * Get all stored reports
   */
  async getAllReports() {
    try {
      const response = await api.get('/api/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports from backend:', error);
      // Fallback to localStorage
      return this.getAllReportsFromLocalStorage();
    }
  }

  /**
   * Get reports from localStorage (fallback)
   */
  getAllReportsFromLocalStorage() {
    const STORAGE_KEY = 'social_media_reports';
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading reports from localStorage:', error);
      return [];
    }
  }

  /**
   * Get a specific report by ID
   */
  async getReportById(id) {
    try {
      const response = await api.get(`/api/reports/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      // Fallback to localStorage
      const reports = this.getAllReportsFromLocalStorage();
      const report = reports.find(r => r.id === id);
      if (report) {
        // Ensure rawData is available (for backward compatibility)
        return {
          ...report,
          rawData: report.rawData || report.combinedData,
        };
      }
      return null;
    }
  }

  /**
   * Delete a report
   */
  async deleteReport(id) {
    try {
      await api.delete(`/api/reports/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      // Fallback to localStorage
      return this.deleteReportFromLocalStorage(id);
    }
  }

  /**
   * Delete from localStorage (fallback)
   */
  deleteReportFromLocalStorage(id) {
    const STORAGE_KEY = 'social_media_reports';
    try {
      const reports = this.getAllReportsFromLocalStorage();
      const filtered = reports.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting report from localStorage:', error);
      return false;
    }
  }
}

export default new ReportStorage();
