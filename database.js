import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Create data directory if it doesn't exist
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'reports.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create reports table
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    platforms TEXT NOT NULL,
    report_markdown TEXT NOT NULL,
    raw_data TEXT,
    combined_data TEXT,
    date_range_start TEXT,
    date_range_end TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_username ON reports(username);
  CREATE INDEX IF NOT EXISTS idx_updated_at ON reports(updated_at DESC);
`);

// Migration: Add raw_data column if it doesn't exist (for existing databases)
try {
  db.exec(`ALTER TABLE reports ADD COLUMN raw_data TEXT`);
} catch (e) {
  // Column already exists, ignore
}

// Migration: Migrate combined_data to raw_data for old records
try {
  db.exec(`
    UPDATE reports
    SET raw_data = combined_data
    WHERE raw_data IS NULL AND combined_data IS NOT NULL
  `);
} catch (e) {
  // Migration failed, continue
}

// Migration: Add date_range columns if they don't exist (for existing databases)
try {
  db.exec(`ALTER TABLE reports ADD COLUMN date_range_start TEXT`);
} catch (e) {
  // Column already exists, ignore
}
try {
  db.exec(`ALTER TABLE reports ADD COLUMN date_range_end TEXT`);
} catch (e) {
  // Column already exists, ignore
}

// Prepared statements for better performance
const stmts = {
  insert: db.prepare(`
    INSERT INTO reports (id, username, platforms, report_markdown, raw_data, combined_data, date_range_start, date_range_end, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  update: db.prepare(`
    UPDATE reports
    SET report_markdown = ?, raw_data = ?, combined_data = ?, date_range_start = ?, date_range_end = ?, updated_at = ?
    WHERE id = ?
  `),
  getById: db.prepare('SELECT * FROM reports WHERE id = ?'),
  getByUsername: db.prepare('SELECT * FROM reports WHERE username = ? ORDER BY updated_at DESC'),
  getAll: db.prepare('SELECT * FROM reports ORDER BY updated_at DESC LIMIT ?'),
  delete: db.prepare('DELETE FROM reports WHERE id = ?'),
  findByUsernameAndPlatforms: db.prepare(`
    SELECT * FROM reports
    WHERE username = ? AND platforms = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `),
};

class DatabaseService {
  /**
   * Save or update a report
   * @param {string} username - The username/handle
   * @param {Array} platforms - Array of platform names
   * @param {string} reportMarkdown - The generated markdown report
   * @param {Array} rawPlatformData - Raw JSON data from Apify (array of platform results)
   * @param {Object} dateRange - Optional date range { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
   */
  saveReport(username, platforms, reportMarkdown, rawPlatformData, dateRange = null) {
    try {
      const platformsStr = JSON.stringify(platforms.sort());
      const now = new Date().toISOString();

      // Validate inputs
      if (!username || !platforms || !reportMarkdown || !rawPlatformData) {
        throw new Error('Missing required parameters for saveReport');
      }

      // Stringify raw data
      const rawDataStr = JSON.stringify(rawPlatformData);

      // Extract date range values
      const dateRangeStart = dateRange?.startDate || null;
      const dateRangeEnd = dateRange?.endDate || null;

      // Check if report exists
      const existing = stmts.findByUsernameAndPlatforms.get(username, platformsStr);

      if (existing) {
        // Update existing report
        stmts.update.run(
          reportMarkdown,
          rawDataStr,
          '', // combined_data - kept for backward compatibility
          dateRangeStart,
          dateRangeEnd,
          now,
          existing.id
        );
        return {
          ...existing,
          updated_at: now,
          report_markdown: reportMarkdown,
          raw_data: rawPlatformData,
          dateRange: dateRange,
        };
      } else {
        // Create new report
        const id = Date.now().toString();
        stmts.insert.run(
          id,
          username,
          platformsStr,
          reportMarkdown,
          rawDataStr,
          '', // combined_data - kept for backward compatibility
          dateRangeStart,
          dateRangeEnd,
          now,
          now
        );
        return {
          id,
          username,
          platforms: JSON.parse(platformsStr),
          report_markdown: reportMarkdown,
          raw_data: rawPlatformData,
          dateRange: dateRange,
          created_at: now,
          updated_at: now,
        };
      }
    } catch (error) {
      console.error('Database saveReport error:', error);
      throw error;
    }
  }

  /**
   * Get all reports (with limit)
   */
  getAllReports(limit = 100) {
    const rows = stmts.getAll.all(limit);
    return rows.map(row => ({
      id: row.id,
      username: row.username,
      platforms: JSON.parse(row.platforms),
      report: row.report_markdown,
      // Support both raw_data (new) and combined_data (old) for backward compatibility
      rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
      dateRange: row.date_range_start && row.date_range_end
        ? { startDate: row.date_range_start, endDate: row.date_range_end }
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Get report by ID
   */
  getReportById(id) {
    const row = stmts.getById.get(id);
    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      platforms: JSON.parse(row.platforms),
      report: row.report_markdown,
      // Support both raw_data (new) and combined_data (old) for backward compatibility
      rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
      dateRange: row.date_range_start && row.date_range_end
        ? { startDate: row.date_range_start, endDate: row.date_range_end }
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Get reports by username
   */
  getReportsByUsername(username) {
    const rows = stmts.getByUsername.all(username);
    return rows.map(row => ({
      id: row.id,
      username: row.username,
      platforms: JSON.parse(row.platforms),
      report: row.report_markdown,
      // Support both raw_data (new) and combined_data (old) for backward compatibility
      rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
      dateRange: row.date_range_start && row.date_range_end
        ? { startDate: row.date_range_start, endDate: row.date_range_end }
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Delete a report
   */
  deleteReport(id) {
    const result = stmts.delete.run(id);
    return result.changes > 0;
  }
}

export default new DatabaseService();

