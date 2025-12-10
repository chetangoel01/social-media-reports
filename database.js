import pg from 'pg';

const { Pool } = pg;

// Use DATABASE_URL for Render PostgreSQL, fallback to individual params for local dev
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Initialize database schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Create reports table
    await client.query(`
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
      )
    `);

    // Create indexes (PostgreSQL uses IF NOT EXISTS for indexes)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_username ON reports(username)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_updated_at ON reports(updated_at DESC)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Initialize on import
initializeDatabase().catch(console.error);

class DatabaseService {
  /**
   * Save or update a report
   * @param {string} username - The username/handle
   * @param {Array} platforms - Array of platform names
   * @param {string} reportMarkdown - The generated markdown report
   * @param {Array} rawPlatformData - Raw JSON data from Apify (array of platform results)
   * @param {Object} dateRange - Optional date range { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
   */
  async saveReport(username, platforms, reportMarkdown, rawPlatformData, dateRange = null) {
    const client = await pool.connect();
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
      const existingResult = await client.query(
        `SELECT * FROM reports WHERE username = $1 AND platforms = $2 ORDER BY updated_at DESC LIMIT 1`,
        [username, platformsStr]
      );
      const existing = existingResult.rows[0];

      if (existing) {
        // Update existing report
        await client.query(
          `UPDATE reports SET report_markdown = $1, raw_data = $2, combined_data = $3, date_range_start = $4, date_range_end = $5, updated_at = $6 WHERE id = $7`,
          [reportMarkdown, rawDataStr, '', dateRangeStart, dateRangeEnd, now, existing.id]
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
        await client.query(
          `INSERT INTO reports (id, username, platforms, report_markdown, raw_data, combined_data, date_range_start, date_range_end, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [id, username, platformsStr, reportMarkdown, rawDataStr, '', dateRangeStart, dateRangeEnd, now, now]
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
    } finally {
      client.release();
    }
  }

  /**
   * Get all reports (with limit)
   */
  async getAllReports(limit = 100) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM reports ORDER BY updated_at DESC LIMIT $1`,
        [limit]
      );
      return result.rows.map(row => ({
        id: row.id,
        username: row.username,
        platforms: JSON.parse(row.platforms),
        report: row.report_markdown,
        rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
        dateRange: row.date_range_start && row.date_range_end
          ? { startDate: row.date_range_start, endDate: row.date_range_end }
          : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Database getAllReports error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM reports WHERE id = $1`,
        [id]
      );
      const row = result.rows[0];
      if (!row) return null;

      return {
        id: row.id,
        username: row.username,
        platforms: JSON.parse(row.platforms),
        report: row.report_markdown,
        rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
        dateRange: row.date_range_start && row.date_range_end
          ? { startDate: row.date_range_start, endDate: row.date_range_end }
          : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Database getReportById error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get reports by username
   */
  async getReportsByUsername(username) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM reports WHERE username = $1 ORDER BY updated_at DESC`,
        [username]
      );
      return result.rows.map(row => ({
        id: row.id,
        username: row.username,
        platforms: JSON.parse(row.platforms),
        report: row.report_markdown,
        rawData: row.raw_data ? JSON.parse(row.raw_data) : (row.combined_data ? JSON.parse(row.combined_data) : []),
        dateRange: row.date_range_start && row.date_range_end
          ? { startDate: row.date_range_start, endDate: row.date_range_end }
          : null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (error) {
      console.error('Database getReportsByUsername error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete a report
   */
  async deleteReport(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM reports WHERE id = $1`,
        [id]
      );
      return result.rowCount > 0;
    } catch (error) {
      console.error('Database deleteReport error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new DatabaseService();
