# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Social Media Report Generator - A full-stack web application that aggregates social media data across multiple platforms (Instagram, LinkedIn, Facebook, Twitter/X, TikTok) using Apify actors and generates AI-powered analytics reports via OpenAI's GPT-4 API.

## Tech Stack

- **Frontend:** React 18.2, Vite 5, Recharts
- **Backend:** Express.js 4.18, Node.js
- **Database:** SQLite3 (better-sqlite3)
- **External APIs:** Apify (web scraping), OpenAI (report generation)
- **PDF Export:** md-to-pdf

## Build and Run Commands

```bash
# Install dependencies
npm install

# Start backend server (port 3001)
npm run server

# Start frontend dev server (port 5173) - run in separate terminal
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

Both servers must run concurrently for full functionality.

## Environment Variables

Required in `.env`:
```
APIFY_TOKEN=your_apify_api_token
OPENAI_API_KEY=your_openai_api_key
```

## Architecture

### Data Flow
```
User Form (with Saturday-Friday date range) → Backend Apify Actors (with date filtering) →
Frontend Data Cleaning (with date range filtering) → Backend OpenAI API →
SQLite Storage (with date range) → Frontend Display with Charts
```

### Key Files

- `server.js` - Express backend with endpoints for Apify orchestration, OpenAI calls, database CRUD, PDF conversion
- `database.js` - SQLite database service (stores reports in `/data/reports.db`)
- `src/App.jsx` - Main orchestrator component managing the fetch→clean→combine→generate→save pipeline
- `src/utils/dataCleaner.js` - Platform-specific JSON parsing and normalization (each platform returns different structures)
- `src/services/` - Frontend API calls (apifyService, llmService, reportStorage)

### API Endpoints

- `POST /api/fetch-social-data` - Runs Apify actors for selected platforms
- `POST /api/generate-report` - Calls OpenAI with combined data
- `GET/POST/DELETE /api/reports` - Database CRUD operations
- `POST /api/convert-to-pdf` - Markdown to PDF conversion
- `GET /api/debug/apify-data?platform=X&username=Y` - Debug raw Apify JSON

### Apify Actor IDs (in server.js)

- Instagram: `dSCLg0C3YEZ83HzYX`
- LinkedIn: `mrThmKLmkxJPehxCg`
- Facebook: `KoJrdxJCTtpon81KY`
- Twitter: `61RPP7dywgiy0JPD0`
- TikTok: `GdWCkxBtKWOsKjdch`

## Development Notes

### Testing Without API Keys
Set `USE_MOCK_DATA = true` in `src/App.jsx` to use mock data for UI development.

### Debugging Platform Data
Use the debug endpoint to inspect raw Apify JSON structure:
```bash
curl "http://localhost:3001/api/debug/apify-data?platform=instagram&username=humansofny"
```

### Platform-Specific Quirks
Each Apify actor returns different JSON structures. The `dataCleaner.js` normalizes them to a standard format. Field names vary significantly (e.g., `likesCount` vs `likes` vs `favorite_count`). Check `DATA_CLEANING_GUIDE.md` for details.

### Database Schema
Single `reports` table with columns: `id`, `username`, `platforms` (JSON), `report_markdown`, `raw_data` (JSON), `combined_data`, `date_range_start`, `date_range_end`, `created_at`, `updated_at`. Raw JSON is stored to allow re-processing with updated cleaning logic.

### Weekly Date Range (Saturday-Friday)
The system supports weekly data extraction with Saturday-Friday date ranges:
- **Frontend (ReportForm.jsx):** Date picker auto-adjusts any selected date to the nearest Saturday and sets end date to following Friday
- **Backend (server.js):** Passes `dateRange` to Apify actors for Facebook and TikTok (native support), other platforms filter in post-processing
- **Data Cleaning (dataCleaner.js):** `filterPostsByDateRange()` filters posts for platforms without native date support (Instagram, LinkedIn, Twitter)
- **Database:** Stores `date_range_start` and `date_range_end` with each report
- **LLM Prompt:** Includes date range context so generated reports mention the analysis period

### Performance Settings (in server.js)
- Apify polling interval: 5 seconds
- Apify timeout: 5 minutes
- OpenAI model: gpt-4
- Results limit: 1000 items per platform
