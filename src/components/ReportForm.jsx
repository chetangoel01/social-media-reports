import React, { useState, useMemo } from 'react';
import './ReportForm.css';

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'IG' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'LI' },
  { id: 'facebook', name: 'Facebook', icon: 'FB' },
  { id: 'twitter', name: 'Twitter', icon: 'TW' },
  { id: 'tiktok', name: 'TikTok', icon: 'TT', disabled: true },
];

/**
 * Get the most recent Saturday (start of week) and following Friday (end of week)
 * Week runs Saturday to Friday
 */
function getDefaultWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate days since last Saturday
  // If today is Saturday (6), daysSinceSaturday = 0
  // If today is Sunday (0), daysSinceSaturday = 1
  // If today is Friday (5), daysSinceSaturday = 6
  const daysSinceSaturday = (dayOfWeek + 1) % 7;

  const saturday = new Date(today);
  saturday.setDate(today.getDate() - daysSinceSaturday);
  saturday.setHours(0, 0, 0, 0);

  const friday = new Date(saturday);
  friday.setDate(saturday.getDate() + 6);
  friday.setHours(23, 59, 59, 999);

  return { saturday, friday };
}

/**
 * Format date as YYYY-MM-DD for input[type="date"]
 */
function formatDateForInput(date) {
  return date.toISOString().split('T')[0];
}

function ReportForm({ onSubmit, isLoading }) {
  const [username, setUsername] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    PLATFORMS.reduce((acc, platform) => {
      acc[platform.id] = platform.disabled ? false : true;
      return acc;
    }, {})
  );

  // Initialize with current week (Saturday to Friday)
  const defaultDates = useMemo(() => getDefaultWeekDates(), []);
  const [weekStartDate, setWeekStartDate] = useState(formatDateForInput(defaultDates.saturday));
  const [weekEndDate, setWeekEndDate] = useState(formatDateForInput(defaultDates.friday));

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId],
    }));
  };

  /**
   * Handle week start date change
   */
  const handleWeekStartChange = (dateStr) => {
    setWeekStartDate(dateStr);
  };

  /**
   * Handle week end date change
   */
  const handleWeekEndChange = (dateStr) => {
    setWeekEndDate(dateStr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const platforms = Object.keys(selectedPlatforms).filter(
      key => selectedPlatforms[key]
    );

    if (platforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    // Validate date range
    if (!weekStartDate || !weekEndDate) {
      alert('Please select a week date range');
      return;
    }

    onSubmit({
      username: username.trim(),
      platforms,
      dateRange: {
        startDate: weekStartDate,
        endDate: weekEndDate,
      }
    });
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Account Username / Handle</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username (e.g., @username or username)"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label>Select Platforms</label>
        <div className="platform-grid">
          {PLATFORMS.map(platform => (
            <label
              key={platform.id}
              className={`platform-checkbox ${platform.disabled ? 'platform-disabled' : ''}`}
              title={platform.disabled ? 'Coming soon' : ''}
            >
              <input
                type="checkbox"
                checked={selectedPlatforms[platform.id]}
                onChange={() => handlePlatformToggle(platform.id)}
                disabled={isLoading || platform.disabled}
              />
              <span className="platform-label">
                <span className="platform-icon">{platform.icon}</span>
                {platform.name}
                {platform.disabled && <span className="coming-soon-badge">Soon</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Date Range</label>
        <div className="date-range-inputs">
          <div className="date-input-group">
            <label htmlFor="weekStart">Start Date</label>
            <input
              id="weekStart"
              type="date"
              value={weekStartDate}
              onChange={(e) => handleWeekStartChange(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="weekEnd">End Date</label>
            <input
              id="weekEnd"
              type="date"
              value={weekEndDate}
              onChange={(e) => handleWeekEndChange(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading || !username.trim()}
      >
        {isLoading ? 'Generating Report...' : 'Generate Report'}
      </button>
    </form>
  );
}

export default ReportForm;

