import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PlatformEngagementChart, PlatformDistributionChart, EngagementMetricsTable } from './ReportCharts';
import { exportReportToPDF, generateFullMarkdown } from '../utils/pdfExport';
import './ReportDisplay.css';

function ReportDisplay({ report, username, platforms, combinedData, updatedAt, onExportPDF }) {
  const reportRef = useRef(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [fullMarkdown, setFullMarkdown] = useState('');

  if (!report) return null;

  // Generate full markdown when component mounts or data changes
  React.useEffect(() => {
    if (report && combinedData) {
      const markdown = generateFullMarkdown(report, combinedData);
      setFullMarkdown(markdown);
    }
  }, [report, combinedData]);

  const handleExportPDF = async () => {
    try {
      await exportReportToPDF(report, username, platforms, updatedAt, combinedData);
      if (onExportPDF) onExportPDF();
    } catch (error) {
      alert(error.message || 'Failed to export PDF');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="report-display pdf-export-container" ref={reportRef}>
      <div className="report-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2>Social Media Report</h2>
            <div style={{ marginTop: '8px', fontSize: '14px', color: '#525252' }}>
              <strong>Last Updated:</strong> {formatDate(updatedAt)}
            </div>
          </div>
          <button 
            onClick={handleExportPDF}
            className="export-pdf-button"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            📄 Export to PDF
          </button>
        </div>
        <div className="report-meta">
          <span className="meta-item">
            <strong>Account:</strong> {username}
          </span>
          <span className="meta-item">
            <strong>Platforms:</strong> {platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
          </span>
        </div>
      </div>
      
      {combinedData && (
        <>
          <EngagementMetricsTable combinedData={combinedData} />
          <PlatformEngagementChart combinedData={combinedData} />
          <PlatformDistributionChart combinedData={combinedData} />
        </>
      )}
      
      <div className="report-content">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #e5e5e5' }}>
        <button
          onClick={() => setShowMarkdown(!showMarkdown)}
          style={{
            padding: '12px 24px',
            background: showMarkdown ? '#6366f1' : '#f5f5f5',
            color: showMarkdown ? '#ffffff' : '#0a0a0a',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          {showMarkdown ? '▼ Hide' : '▶ Show'} Markdown Source (for PDF export)
        </button>

        {showMarkdown && (
          <div style={{
            background: '#1a1a1a',
            color: '#e5e7eb',
            padding: '24px',
            borderRadius: '12px',
            fontFamily: 'Monaco, "Courier New", monospace',
            fontSize: '12px',
            lineHeight: '1.6',
            overflowX: 'auto',
            maxHeight: '600px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {fullMarkdown || 'Generating markdown...'}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDisplay;

