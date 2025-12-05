# Social Media Report Generator

A full-stack application that automatically collects social media data from multiple platforms and generates AI-powered weekly performance reports. Built with React, Express, and powered by Apify scrapers and OpenAI GPT-4.

## Features

- **Multi-Platform Support**: Collect data from Instagram, LinkedIn, Facebook, Twitter/X, and TikTok
- **Automated Data Collection**: Uses Apify actors to scrape social media data
- **AI-Powered Reports**: Generates comprehensive weekly performance reports using OpenAI GPT-4
- **Data Persistence**: SQLite database for storing historical reports
- **PDF Export**: Export reports as professionally formatted PDF documents
- **Modern UI**: Clean, responsive React interface with data visualizations
- **Date Range Filtering**: Analyze specific time periods for targeted insights

## Tech Stack

### Frontend
- React 18
- Vite (build tool)
- Recharts (data visualization)
- React Markdown (report rendering)

### Backend
- Node.js + Express
- SQLite3 (better-sqlite3)
- Axios (HTTP client)
- md-to-pdf (PDF generation)

### External Services
- Apify API (social media scraping)
- OpenAI API (GPT-4 for report generation)

## Prerequisites

- Node.js 18+ and npm
- Apify API token ([Get one here](https://console.apify.com/account/integrations))
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

### Standard Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social_media_report
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Apify Configuration
   APIFY_TOKEN=your_apify_token_here

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Server Configuration
   PORT=3001

   # Frontend Configuration (optional - for direct API calls)
   VITE_API_URL=http://localhost:3001
   VITE_PDF_API_URL=http://localhost:3001
   ```

4. **Start the application**

   In one terminal, start the backend server:
   ```bash
   npm run server
   ```

   In another terminal, start the development server:
   ```bash
   npm run dev
   ```

5. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

### Docker Installation

The easiest way to get started is using Docker:

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social_media_report
   ```

2. **Configure environment variables**

   Create a `.env` file with your API credentials (same as above)

3. **Run with Docker Compose**
   ```bash
   docker-compose up
   ```

4. **Access the application**

   Open your browser and navigate to `http://localhost:3001`

The Docker setup includes:
- Multi-stage build for optimized image size
- Production-ready Vite build
- SQLite database with persistent volume
- Automatic restart on failure

## Usage

1. **Enter Account Information**
   - Enter the username/handle of the social media account you want to analyze
   - Select one or more platforms to collect data from
   - Optionally specify a date range for analysis

2. **Generate Report**
   - Click "Generate Report"
   - Wait for data collection (typically 1-5 minutes depending on platforms selected)
   - The AI will analyze the data and generate a comprehensive report

3. **View Results**
   - Review the generated report with engagement metrics, top posts, and recommendations
   - View data visualizations showing posting activity and engagement trends
   - Export the report as a PDF for sharing or archival

4. **Manage Reports**
   - All reports are automatically saved to the database
   - View previously generated reports
   - Delete old reports as needed

## Report Structure

Generated reports include:

- **Posting Activity Summary**: Overview of posting frequency and engagement by platform
- **Top 5 Posts of the Week**: Best-performing content across all platforms
- **Key Insights & Learnings**: Data-driven observations about content performance
- **Recommended Actions**: Specific, actionable recommendations based on the data

## Apify Actors

The application uses the following Apify actors by default:

| Platform | Actor ID | Description |
|----------|----------|-------------|
| Instagram | `dSCLg0C3YEZ83HzYX` | Instagram Profile Scraper |
| LinkedIn | `mrThmKLmkxJPehxCg` | LinkedIn Company Scraper |
| Facebook | `KoJrdxJCTtpon81KY` | Facebook Posts Scraper |
| Twitter/X | `ghSpYIW3L1RvT57NT` | Twitter/X Scraper |
| TikTok | `GdWCkxBtKWOsKjdch` | TikTok Scraper |

You can customize these actor IDs in `server.js` (lines 25-31) based on your Apify account setup.

## Project Structure

```
social_media_report/
├── src/
│   ├── components/        # React components
│   │   ├── ReportForm.jsx        # Data collection form
│   │   ├── ReportDisplay.jsx     # Report viewer
│   │   ├── ReportCharts.jsx      # Data visualizations
│   │   └── LoadingSpinner.jsx    # Loading states
│   ├── services/          # API and business logic
│   │   ├── apifyService.js       # Apify integration (frontend)
│   │   ├── llmService.js         # OpenAI integration
│   │   ├── reportStorage.js      # Local storage management
│   │   └── mockService.js        # Mock data for testing
│   ├── utils/             # Utility functions
│   │   ├── dataCleaner.js        # Data normalization
│   │   └── pdfExport.js          # PDF generation
│   ├── App.jsx            # Main app component
│   └── main.jsx           # App entry point
├── server.js              # Express backend server
├── database.js            # SQLite database service
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── Dockerfile             # Docker container definition
└── docker-compose.yml     # Docker Compose configuration
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/fetch-social-data` | Fetch data from Apify actors |
| POST | `/api/generate-report` | Generate AI report from data |
| POST | `/api/convert-to-pdf` | Convert markdown to PDF |
| GET | `/api/reports` | Get all saved reports |
| GET | `/api/reports/:id` | Get specific report |
| POST | `/api/reports` | Save a new report |
| DELETE | `/api/reports/:id` | Delete a report |
| GET | `/api/debug/apify-data` | Debug endpoint for raw data |

## Configuration

### Customizing Apify Actors

To use different Apify actors, update the `ACTOR_IDS` object in `server.js`:

```javascript
const ACTOR_IDS = {
  instagram: 'your-actor-id',
  linkedin: 'your-actor-id',
  // ... other platforms
};
```

### Customizing Report Generation

To modify the report format or analysis, edit the prompt in `server.js` (lines 430-497).

### Using a Different LLM Provider

To use a different LLM provider (e.g., Anthropic, Gemini):

1. Update the API endpoint URL in `server.js` (line 22)
2. Modify the request format in the `/api/generate-report` endpoint (lines 409-527)
3. Update the authentication headers as needed

## Development

### Available Scripts

- `npm run dev` - Start Vite development server (frontend)
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run server` - Start Express backend server

### Building for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the server (serves both API and built frontend):
   ```bash
   npm run server
   ```

The built application will be available at `http://localhost:3001`

## Troubleshooting

### "Apify client not initialized"
- Ensure `APIFY_TOKEN` is set in your `.env` file
- Verify the token is valid at [Apify Console](https://console.apify.com/account/integrations)

### "OpenAI API key not configured"
- Ensure `OPENAI_API_KEY` is set in your `.env` file
- Verify the key is valid at [OpenAI Platform](https://platform.openai.com/api-keys)
- Check that your OpenAI account has sufficient credits

### "Actor not found" or Actor Errors
- Verify the actor IDs in `server.js` match actors available in your Apify account
- Some actors may require paid Apify plans
- Check the [Apify Store](https://apify.com/store) for alternative actors

### Rate Limit Errors
- OpenAI: Upgrade your plan or implement exponential backoff
- Apify: Check your usage limits in the Apify Console
- Consider adding retry logic for production use

### No Data Returned
- Some social media accounts may have privacy settings that prevent scraping
- Verify the username/handle is correct
- Check the actor logs in Apify Console for detailed error messages

### Docker Issues
- Ensure ports 3001 is not already in use
- Check Docker logs: `docker-compose logs -f`
- Rebuild containers: `docker-compose up --build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Apify](https://apify.com/) for providing social media scraping infrastructure
- [OpenAI](https://openai.com/) for GPT-4 API
- [Vite](https://vitejs.dev/) for blazing fast build tooling
- [Recharts](https://recharts.org/) for beautiful data visualizations

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Note**: This tool is for educational and analytical purposes. Ensure you comply with the terms of service of all platforms you scrape data from, and respect rate limits and data privacy regulations.
