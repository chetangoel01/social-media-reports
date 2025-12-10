import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import ReportForm from './components/ReportForm';
import LoadingSpinner from './components/LoadingSpinner';
import ReportDisplay from './components/ReportDisplay';
import apifyService from './services/apifyService';
import llmService from './services/llmService';
import mockService from './services/mockService';
import reportStorage from './services/reportStorage';
import { cleanPlatformData, combinePlatformData, cleanStoredReportData } from './utils/dataCleaner';
import './App.css';

// Set to true to use mock data, false to use real APIs
const USE_MOCK_DATA = false;

function App() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [reportMeta, setReportMeta] = useState(null);
  const [combinedData, setCombinedData] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [storedReports, setStoredReports] = useState([]);
  const [showStoredReports, setShowStoredReports] = useState(false);

  // Load stored reports when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadReports = async () => {
      const reports = await reportStorage.getAllReports();
      setStoredReports(reports);
    };
    loadReports();
  }, [isAuthenticated]);

  const handleGenerateReport = async ({ username, platforms, dateRange }) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setReportMeta({ username, platforms, dateRange });

    try {
      if (USE_MOCK_DATA) {
        // Use mock data for UI testing
        setLoadingMessage(`Fetching data from ${platforms.length} platform(s)...`);
        const platformDataArray = await mockService.fetchMultiplePlatforms(platforms, username);

        setLoadingMessage('Cleaning and processing data...');
        const cleanedDataArray = platformDataArray.map(data => {
          if (data.error) {
            return { platform: data.platform, error: data.error };
          }
          return cleanPlatformData(data, dateRange);
        });

        const combinedData = combinePlatformData(cleanedDataArray);

        setLoadingMessage('Generating AI-powered report...');
        const generatedReport = await mockService.generateReport(combinedData, username);

        // Save report to storage
        const saved = await reportStorage.saveReport(username, platforms, generatedReport, combinedData, dateRange);
        if (saved) {
          const reports = await reportStorage.getAllReports();
          setStoredReports(reports);
        }

        setReport(generatedReport);
        setCombinedData(combinedData);
        setUpdatedAt(new Date().toISOString());
      } else {
        // Use real APIs
        // Step 1: Fetch data from Apify with date range
        setLoadingMessage(`Fetching data from ${platforms.length} platform(s)...`);
        const platformDataArray = await apifyService.fetchMultiplePlatforms(platforms, username, dateRange);

        // Step 2: Clean the data (dateRange is now included in platformDataArray items)
        setLoadingMessage('Cleaning and processing data...');
        const cleanedDataArray = platformDataArray.map(data => {
          if (data.error) {
            return { platform: data.platform, error: data.error };
          }
          return cleanPlatformData(data, dateRange);
        });

        // Step 3: Combine data
        const combinedData = combinePlatformData(cleanedDataArray);

        // Step 4: Generate report with LLM
        setLoadingMessage('Generating AI-powered report...');
        const generatedReport = await llmService.generateReport(combinedData, username);

        // Save report to storage - store RAW data, not cleaned data
        const saved = await reportStorage.saveReport(username, platforms, generatedReport, platformDataArray, dateRange);
        if (saved) {
          const reports = await reportStorage.getAllReports();
          setStoredReports(reports);
        }

        setReport(generatedReport);
        setCombinedData(combinedData);
        setUpdatedAt(new Date().toISOString());
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'An error occurred while generating the report');
    } finally {
      setIsLoading(false);
      setLoadingMessage('Loading...');
    }
  };

  // Show loading spinner while checking auth
  if (authLoading) {
    return (
      <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Social Media Report Generator</h1>
            <p>Analyze your social media presence across multiple platforms</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Signed in as <strong style={{ color: '#1e293b' }}>{user?.username}</strong>
            </span>
            <button
              onClick={logout}
              style={{
                padding: '10px 20px',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Generate New Report</h2>
          <button
            onClick={() => setShowStoredReports(!showStoredReports)}
            style={{
              padding: '10px 20px',
              background: showStoredReports ? '#6366f1' : '#f5f5f5',
              color: showStoredReports ? '#ffffff' : '#0a0a0a',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {showStoredReports ? 'Hide' : 'View'} Stored Reports ({storedReports.length})
          </button>
        </div>

        {showStoredReports && storedReports.length > 0 && (
          <div style={{ 
            marginBottom: '32px', 
            padding: '24px', 
            background: '#ffffff', 
            borderRadius: '16px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Stored Reports</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {storedReports.map((storedReport) => (
                <div
                  key={storedReport.id}
                  style={{
                    padding: '16px',
                    background: '#fafafa',
                    borderRadius: '12px',
                    border: '1px solid #e5e5e5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = '#e5e5e5';
                  }}
                    onClick={async () => {
                      // Load full report data if needed
                      const fullReport = storedReport.report 
                        ? storedReport 
                        : await reportStorage.getReportById(storedReport.id);
                      
                      if (fullReport) {
                        setReport(fullReport.report || fullReport.report_markdown);
                        
                        // Clean raw data on-demand for display
                        const rawData = fullReport.rawData || fullReport.combinedData || fullReport.combined_data;
                        const combinedData = rawData ? cleanStoredReportData(rawData) : null;
                        setCombinedData(combinedData);
                        
                        setReportMeta({
                          username: fullReport.username,
                          platforms: fullReport.platforms,
                        });
                        setUpdatedAt(fullReport.updatedAt || fullReport.updated_at);
                        setShowStoredReports(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      {storedReport.username} - {storedReport.platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#525252' }}>
                      Updated: {new Date(storedReport.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm('Delete this report?')) {
                        await reportStorage.deleteReport(storedReport.id);
                        const reports = await reportStorage.getAllReports();
                        setStoredReports(reports);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReportForm onSubmit={handleGenerateReport} isLoading={isLoading} />

        {isLoading && (
          <LoadingSpinner message={loadingMessage} />
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {report && reportMeta && (
          <ReportDisplay 
            report={report} 
            username={reportMeta.username}
            platforms={reportMeta.platforms}
            combinedData={combinedData}
            updatedAt={updatedAt}
            onExportPDF={() => {
              // Could show a success message here
              console.log('PDF exported successfully');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;

