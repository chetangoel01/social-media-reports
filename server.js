import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mdToPdf } from 'md-to-pdf';
import { writeFileSync, unlinkSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dbService from './database.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
// Read API tokens from environment variables
// Supports both VITE_ prefixed (for compatibility) and direct names
const APIFY_TOKEN = process.env.APIFY_TOKEN || process.env.VITE_APIFY_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

// Authentication configuration
// Default credentials - in production, use environment variables
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

// Simple token storage (in production, use a database or Redis)
const validTokens = new Set();
const APIFY_API_BASE = 'https://api.apify.com/v2';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Apify actor IDs for different platforms
const ACTOR_IDS = {
  instagram: 'dSCLg0C3YEZ83HzYX', // Instagram Profile Scraper
  linkedin: 'mrThmKLmkxJPehxCg', // LinkedIn Company Scraper
  facebook: 'KoJrdxJCTtpon81KY', // Facebook Posts Scraper
  twitter: 'ghSpYIW3L1RvT57NT', // Twitter/X Scraper
  tiktok: 'GdWCkxBtKWOsKjdch', // TikTok Scraper
};

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from Vite build (dist folder) if it exists
const distPath = join(__dirname, 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Serve static assets from root (for development)
app.use(express.static(__dirname));

// Helper function to generate a secure token
function generateToken() {
  return crypto.randomBytes(48).toString('hex');
}

// Authentication middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.substring(7);

  if (!validTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  next();
}

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    const token = generateToken();
    validTokens.add(token);

    // Log successful login
    console.log(`User "${username}" logged in successfully`);

    return res.json({
      token,
      user: {
        username,
      },
    });
  }

  return res.status(401).json({ error: 'Invalid username or password' });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    validTokens.delete(token);
  }

  res.json({ success: true });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);

  if (validTokens.has(token)) {
    return res.json({ valid: true });
  }

  return res.status(401).json({ error: 'Invalid token' });
});

// API Routes (before the catch-all route)

/**
 * Start an Apify actor run
 */
async function startActorRun(actorId, input) {
  const response = await axios.post(
    `${APIFY_API_BASE}/acts/${actorId}/runs`,
    { ...input },
    {
      headers: {
        'Authorization': `Bearer ${APIFY_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data;
}

/**
 * Wait for a run to finish
 */
async function waitForRun(runId) {
  const maxWaitTime = 300000; // 5 minutes
  const checkInterval = 5000; // 5 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTime) {
    const response = await axios.get(
      `${APIFY_API_BASE}/actor-runs/${runId}`,
      {
        headers: {
          'Authorization': `Bearer ${APIFY_TOKEN}`,
        },
      }
    );

    const status = response.data.data.status;
    
    if (status === 'SUCCEEDED') {
      return response.data.data;
    } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Actor run ${status.toLowerCase()}`);
    }

    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }

  throw new Error('Actor run timed out');
}

/**
 * Get dataset items
 */
async function getDatasetItems(datasetId) {
  const response = await axios.get(
    `${APIFY_API_BASE}/datasets/${datasetId}/items`,
    {
      headers: {
        'Authorization': `Bearer ${APIFY_TOKEN}`,
      },
      params: {
        limit: 1000,
      },
    }
  );
  
  // Apify returns JSON data - check the response structure
  const items = response.data.data || response.data || [];
  
  // Log response structure for debugging
  if (Array.isArray(items) && items.length > 0) {
    console.log(`Dataset ${datasetId}: Retrieved ${items.length} items (JSON array)`);
  } else if (typeof items === 'object') {
    console.log(`Dataset ${datasetId}: Retrieved object with keys:`, Object.keys(items));
  }
  
  return items;
}

/**
 * Run an Apify actor for a specific platform
 * @param {string} platform - Platform name (instagram, linkedin, facebook, twitter, tiktok)
 * @param {string} username - Username/handle to fetch
 * @param {Object} dateRange - Optional date range { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
 */
async function runActor(platform, username, dateRange = null) {
  if (!APIFY_TOKEN) {
    throw new Error('Apify token not configured');
  }

  const actorId = ACTOR_IDS[platform];
  if (!actorId) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  try {
    const cleanUsername = username.replace(/^@/, '');
    
    // Different platforms use different input formats
    let actorInput;
    if (platform === 'instagram') {
      actorInput = {
        usernames: [cleanUsername],
        includeAboutSection: false,
      };
    } else if (platform === 'linkedin') {
      // LinkedIn uses company_name (full URL), limit, sort
      // LinkedIn actor doesn't support native date filtering, so we fetch 20 posts and filter manually
      actorInput = {
        company_name: `https://www.linkedin.com/company/${cleanUsername}/posts/?feedView=all`,
        limit: 20,
        sort: 'recent',
      };
    } else if (platform === 'facebook') {
      // Facebook uses startUrls with date filtering
      // Use provided dateRange or default to 10 days ago
      let startDate, endDate;
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      } else {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        startDate = tenDaysAgo.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
      }

      console.log(`Facebook date range: ${startDate} to ${endDate}`);

      actorInput = {
        startUrls: [{ url: `https://www.facebook.com/${cleanUsername}`, method: 'GET' }],
        resultsLimit: 100,
        captionText: false,
        onlyPostsNewerThan: startDate,
      };
    } else if (platform === 'tiktok') {
      // TikTok uses profiles with date filtering
      // Use provided dateRange or default to 10 days ago
      let startDate, endDate;
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        startDate = dateRange.startDate;
        endDate = dateRange.endDate;
      } else {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        startDate = tenDaysAgo.toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
      }

      console.log(`TikTok date range: ${startDate} to ${endDate}`);

      actorInput = {
        hashtags: [],
        resultsPerPage: 100,
        profiles: [cleanUsername],
        profileScrapeSections: ["videos"],
        profileSorting: "latest",
        excludePinnedPosts: false,
        oldestPostDateUnified: startDate,
        newestPostDate: endDate,
      };
    } else if (platform === 'twitter') {
      // Twitter/X uses username and max_posts
      // Date filtering is done in post-processing via dataCleaner.js
      actorInput = {
        max_posts: 20,
        username: cleanUsername,
      };

      if (dateRange && dateRange.startDate && dateRange.endDate) {
        console.log(`Twitter date range (filtered in post-processing): ${dateRange.startDate} to ${dateRange.endDate}`);
      }
    } else {
      // Other platforms use the standard format
      actorInput = {
        startUrls: [{ url: `https://www.${platform}.com/${cleanUsername}` }],
        resultsPerPage: 50,
      };
    }
    
    const run = await startActorRun(actorId, actorInput);
    const finishedRun = await waitForRun(run.id);
    const datasetId = finishedRun.defaultDatasetId;
    const items = await getDatasetItems(datasetId);

    // Log the response structure for debugging
    console.log(`\n=== ${platform.toUpperCase()} Data Retrieved ===`);
    console.log(`Username: ${cleanUsername}`);
    console.log(`Items count: ${items.length}`);
    if (items.length > 0) {
      console.log(`First item keys:`, Object.keys(items[0]));
      console.log(`First item sample (first 500 chars):`, JSON.stringify(items[0]).substring(0, 500));
    }
    console.log(`===============================\n`);

    return {
      platform,
      username: cleanUsername,
      data: items,
      count: items.length,
      dateRange: dateRange || null,
    };
  } catch (error) {
    console.error(`Error running ${platform} actor:`, error);
    throw new Error(`Failed to fetch ${platform} data: ${error.response?.data?.error?.message || error.message}`);
  }
}

// API Routes

/**
 * Format date range for display in report
 */
function formatDateRangeForReport(dateRange) {
  if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
    return null;
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    start: formatDate(dateRange.startDate),
    end: formatDate(dateRange.endDate),
    raw: dateRange
  };
}

/**
 * Calculate engagement for a post
 */
function calculatePostEngagement(post) {
  return (post.likes || post.reactions || 0) +
         (post.comments || 0) +
         (post.shares || post.retweets || 0) +
         (post.replies || 0);
}

/**
 * Build prompt for LLM report generation
 */
function buildLLMPrompt(combinedData, username) {
  const dateRangeInfo = formatDateRangeForReport(combinedData.dateRange);

  // Build platform data sections
  const platformSummaries = combinedData.platforms.map(platform => {
    const data = combinedData.platformData[platform];
    if (!data) return null;

    // Calculate average engagement
    const totalEngagement = data.posts?.reduce((sum, p) => sum + calculatePostEngagement(p), 0) || 0;
    const avgEngagement = data.posts?.length > 0 ? (totalEngagement / data.posts.length).toFixed(1) : 0;

    // Find top post
    let topPost = null;
    if (data.posts && data.posts.length > 0) {
      topPost = data.posts.reduce((best, current) => {
        const bestEng = calculatePostEngagement(best);
        const currentEng = calculatePostEngagement(current);
        return currentEng > bestEng ? current : best;
      }, data.posts[0]);
    }

    const topPostText = topPost ? (topPost.text || topPost.caption || topPost.description || '').substring(0, 50) : 'N/A';
    const topPostEngagement = topPost ? calculatePostEngagement(topPost) : 0;

    let summary = `\n### ${platform}\n`;
    summary += `- Posts: ${data.totalPosts}\n`;
    summary += `- Average Engagement: ${avgEngagement}\n`;
    summary += `- Top Post: "${topPostText}${topPostText.length >= 50 ? '...' : ''}" (${topPostEngagement} engagement)\n`;

    if (data.totalLikes) summary += `- Total Likes: ${data.totalLikes}\n`;
    if (data.totalComments) summary += `- Total Comments: ${data.totalComments}\n`;
    if (data.totalReactions) summary += `- Total Reactions: ${data.totalReactions}\n`;
    if (data.totalRetweets) summary += `- Total Retweets: ${data.totalRetweets}\n`;
    if (data.totalShares) summary += `- Total Shares: ${data.totalShares}\n`;
    if (data.totalViews) summary += `- Total Views: ${data.totalViews}\n`;

    // List top 5 posts with details
    if (data.posts && data.posts.length > 0) {
      const topPosts = [...data.posts]
        .sort((a, b) => calculatePostEngagement(b) - calculatePostEngagement(a))
        .slice(0, 5);

      summary += `\n#### Top Posts:\n`;
      topPosts.forEach((post, idx) => {
        const text = post.text || post.caption || post.description || '';
        const preview = text.substring(0, 80) + (text.length > 80 ? '...' : '');
        const likes = post.likes || post.reactions || 0;
        const comments = post.comments || 0;
        const shares = post.shares || post.retweets || 0;
        summary += `${idx + 1}. "${preview}"\n`;
        summary += `   - Likes/Reactions: ${likes}, Comments: ${comments}, Shares/Retweets: ${shares}\n`;
        if (post.views) summary += `   - Views: ${post.views}\n`;
        if (post.type) summary += `   - Type: ${post.type}\n`;
        if (post.hashtags && post.hashtags.length > 0) summary += `   - Hashtags: ${post.hashtags.slice(0, 5).join(', ')}\n`;
      });
    }

    return summary;
  }).filter(Boolean).join('\n');

  // Build date range section for prompt
  let dateRangeSection = '';
  if (dateRangeInfo) {
    dateRangeSection = `
## Report Period: ${dateRangeInfo.raw.startDate} to ${dateRangeInfo.raw.endDate}
Week: ${dateRangeInfo.start} (Saturday) to ${dateRangeInfo.end} (Friday)
`;
  }

  // Collect ALL posts across platforms for top 5 ranking
  const allPosts = [];
  combinedData.platforms.forEach(platform => {
    const data = combinedData.platformData[platform];
    if (data && data.posts) {
      data.posts.forEach(post => {
        allPosts.push({
          ...post,
          platform: platform,
          totalEngagement: calculatePostEngagement(post)
        });
      });
    }
  });

  // Sort all posts by engagement and get top 5
  const globalTop5 = allPosts
    .sort((a, b) => b.totalEngagement - a.totalEngagement)
    .slice(0, 5);

  let top5Section = '\n## TOP 5 POSTS ACROSS ALL PLATFORMS:\n';
  globalTop5.forEach((post, idx) => {
    const text = post.text || post.caption || post.description || '';
    const preview = text.substring(0, 80) + (text.length > 80 ? '...' : '');
    top5Section += `${idx + 1}. [${post.platform}] "${preview}"\n`;
    top5Section += `   - Total Engagement: ${post.totalEngagement} (Likes: ${post.likes || post.reactions || 0}, Comments: ${post.comments || 0})\n`;
  });

  return `Generate a weekly social media performance report for "${username}" based on the following data:
${dateRangeSection}
## PLATFORM DATA:
${platformSummaries}
${top5Section}

## Overall Statistics:
- Total Posts Across All Platforms: ${combinedData.totalPosts}
- Total Engagement: ${combinedData.totalEngagement}
- Platforms Analyzed: ${combinedData.platforms.join(', ')}

Use the exact format specified in the system prompt. Fill in all tables with the data provided above.`;
}

/**
 * Generate report using LLM API
 */
app.post('/api/generate-report', requireAuth, async (req, res) => {
  try {
    const { combinedData, username } = req.body;

    if (!combinedData || !username) {
      return res.status(400).json({ error: 'combinedData and username are required' });
    }

    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured on server' });
    }

    const prompt = buildLLMPrompt(combinedData, username);

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a social media data analyst. Generate a **weekly social media performance report** using ONLY the data provided.

CRITICAL RULES:
- Use ONLY numbers and facts from the provided data
- Never invent, estimate, or hallucinate metrics
- If data is missing, state "Data not available"
- Keep tone analytic + professional
- Use percentages, averages, and comparisons when possible
- Provide specific insights based on engagement patterns and content performance

OUTPUT FORMAT (FOLLOW EXACTLY):

# **Period: [DATE RANGE]**

## **POSTING ACTIVITY SUMMARY**

| Platform | Posts | Avg Engagement | Top Post | Status |
|----------|-------|----------------|----------|--------|
| Instagram | X | Y | "Post title..." (Z engagement) | on target/strong/reduce volume/pause |
| LinkedIn | X | Y | "Post title..." (Z engagement) | on target/strong/reduce volume/pause |
| Facebook | X | Y | "Post title..." (Z engagement) | on target/strong/reduce volume/pause |
| X (Twitter) | X | Y | "Post title..." (Z engagement) | on target/strong/reduce volume/pause |
| TikTok | X | Y | "Post title..." (Z engagement) | on target/strong/reduce volume/pause |

**Content Mix:** [breakdown of content types if available]
**Weekly Overview:** [1-2 sentence summary of overall posting activity and engagement trends]

---

## **TOP 5 POSTS OF THE WEEK**

| # | Platform | Content | Engagement | Why It Worked |
|---|----------|---------|------------|---------------|
| 1 | Platform | "Content summary..." | X likes, Y comments | Short insight (carousel? emotional story? tagged orgs? real-time?) |
| 2 | ... | ... | ... | ... |

> **Platform Winner:** [Platform] (X of top 5 posts, Y% above platform average)

---

## **KEY INSIGHTS & LEARNINGS**

| Insight | Data | Application |
|---------|------|-------------|
| Pattern observed | Supporting metric (e.g., "multi-image posts averaged 32.0 vs single-image 18.2") | Actionable recommendation |
| ... | ... | ... |

**Trending Topics/Themes:** [List 2-3 recurring themes, hashtags, or topics from top-performing posts]

**Cross-Platform Comparison:** [1-2 sentence analysis comparing engagement rates and content performance between platforms]

---

## **RECOMMENDED ACTIONS**

Based on this week's data:
1. **[Action 1]:** [Specific recommendation based on what performed well]
2. **[Action 2]:** [Specific recommendation to improve underperforming areas]
3. **[Action 3]:** [Content strategy suggestion based on successful patterns]

---

FORMATTING REQUIREMENTS:
- Match the table formatting exactly as shown above
- Keep language clean and concise
- Keep "Why It Worked" short and insight-driven
- Status should be: "on target", "strong", "reduce volume", or "pause" based on performance
- Ensure recommendations are specific and actionable, tied directly to the data`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const report = response.data.choices[0].message.content;
    res.json({ report });
  } catch (error) {
    console.error('Error generating report with LLM:', error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ error: error.message || 'Failed to generate report' });
    }
  }
});

/**
 * Fetch social media data from Apify
 */
app.post('/api/fetch-social-data', requireAuth, async (req, res) => {
  try {
    const { platforms, username, dateRange } = req.body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'Platforms array is required' });
    }

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (!APIFY_TOKEN) {
      return res.status(500).json({ error: 'Apify token not configured on server' });
    }

    // Log request with date range if provided
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      console.log(`\n=== Fetching data for ${username} on platforms: ${platforms.join(', ')} ===`);
      console.log(`Date range: ${dateRange.startDate} to ${dateRange.endDate}\n`);
    } else {
      console.log(`\n=== Fetching data for ${username} on platforms: ${platforms.join(', ')} ===\n`);
    }

    // Fetch data from all platforms in parallel, passing dateRange
    const promises = platforms.map(platform =>
      runActor(platform, username, dateRange).catch(error => {
        console.error(`Error fetching ${platform} data:`, error.message);
        return {
          platform,
          username,
          error: error.message,
          data: [],
          dateRange: dateRange || null,
        };
      })
    );

    const results = await Promise.all(promises);

    // Log summary of results
    console.log(`\n=== Fetch Summary ===`);
    results.forEach(result => {
      if (result.error) {
        console.log(`${result.platform}: ERROR - ${result.error}`);
      } else {
        console.log(`${result.platform}: SUCCESS - ${result.count} items`);
      }
    });
    console.log(`====================\n`);

    res.json(results);
  } catch (error) {
    console.error('Error in fetch-social-data:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch social media data' });
  }
});

/**
 * Debug endpoint to inspect raw Apify data structure
 * GET /api/debug/apify-data?platform=instagram&username=test
 */
app.get('/api/debug/apify-data', requireAuth, async (req, res) => {
  try {
    const { platform, username } = req.query;

    if (!platform || !username) {
      return res.status(400).json({ error: 'platform and username query parameters are required' });
    }

    if (!APIFY_TOKEN) {
      return res.status(500).json({ error: 'Apify token not configured on server' });
    }

    const result = await runActor(platform, username);
    
    // Return detailed information about the JSON structure
    res.json({
      platform: result.platform,
      username: result.username,
      itemCount: result.count,
      isArray: Array.isArray(result.data),
      dataType: typeof result.data,
      sampleItem: result.data.length > 0 ? result.data[0] : null,
      sampleItemKeys: result.data.length > 0 ? Object.keys(result.data[0]) : [],
      fullData: result.data, // Include full data for inspection
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch data' });
  }
});

/**
 * Get all reports
 */
app.get('/api/reports', requireAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const reports = await dbService.getAllReports(limit);
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

/**
 * Get a specific report by ID
 */
app.get('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const report = await dbService.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

/**
 * Save a report
 */
app.post('/api/reports', requireAuth, async (req, res) => {
  try {
    const { username, platforms, report, rawData, dateRange } = req.body;

    if (!username || !platforms || !report || !rawData) {
      return res.status(400).json({
        error: 'Missing required fields',
        received: { username: !!username, platforms: !!platforms, report: !!report, rawData: !!rawData }
      });
    }

    const savedReport = await dbService.saveReport(username, platforms, report, rawData, dateRange);
    res.json(savedReport);
  } catch (error) {
    console.error('Error saving report:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to save report',
      details: error.message
    });
  }
});

/**
 * Delete a report
 */
app.delete('/api/reports/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await dbService.deleteReport(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

/**
 * Convert markdown to PDF
 */
app.post('/api/convert-to-pdf', requireAuth, async (req, res) => {
  let tempCssPath = null;
  
  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    // Create temporary CSS file
    const cssContent = `
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #0a0a0a;
      }
      h1 {
        font-size: 24pt;
        font-weight: 800;
        margin-top: 20pt;
        margin-bottom: 10pt;
        color: #0a0a0a;
        border-bottom: 3px solid #6366f1;
        padding-bottom: 8pt;
      }
      h2 {
        font-size: 18pt;
        font-weight: 700;
        margin-top: 16pt;
        margin-bottom: 8pt;
        color: #0a0a0a;
      }
      h3 {
        font-size: 14pt;
        font-weight: 600;
        margin-top: 12pt;
        margin-bottom: 6pt;
        color: #6366f1;
      }
      p {
        margin: 8pt 0;
        color: #525252;
      }
      strong {
        color: #0a0a0a;
        font-weight: 700;
      }
      ul, ol {
        margin: 8pt 0;
        padding-left: 20pt;
      }
      li {
        margin: 4pt 0;
        color: #525252;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16pt 0;
        font-size: 10pt;
        page-break-inside: avoid;
      }
      th {
        background-color: #6366f1;
        color: #ffffff;
        padding: 8pt;
        text-align: left;
        font-weight: 600;
        border: 1px solid #4f46e5;
      }
      td {
        padding: 8pt;
        border: 1px solid #e5e5e5;
        text-align: left;
      }
      tr:nth-child(even) {
        background-color: #fafafa;
      }
      code {
        background-color: #f5f5f5;
        padding: 2pt 4pt;
        border-radius: 3pt;
        font-family: 'Courier New', monospace;
        font-size: 9pt;
      }
      pre {
        background-color: #1a1a1a;
        color: #e5e7eb;
        padding: 12pt;
        border-radius: 6pt;
        overflow-x: auto;
        font-size: 9pt;
      }
      blockquote {
        border-left: 4px solid #6366f1;
        padding-left: 12pt;
        margin-left: 0;
        color: #525252;
        font-style: italic;
        background-color: #fafafa;
        padding: 12pt;
      }
    `;

    tempCssPath = join(tmpdir(), `pdf-styles-${Date.now()}.css`);
    writeFileSync(tempCssPath, cssContent);

    // Configure PDF options
    const pdfOptions = {
      pdf_options: {
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        printBackground: true,
      },
      stylesheet: tempCssPath,
    };

    const pdf = await mdToPdf({ content: markdown }, pdfOptions);

    if (!pdf) {
      console.error('PDF generation returned null/undefined');
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }

    // Log what we got from md-to-pdf
    console.log('md-to-pdf returned:', {
      hasFilename: !!pdf.filename,
      filename: pdf.filename,
      hasContent: !!pdf.content,
      contentType: typeof pdf.content,
      isBuffer: Buffer.isBuffer(pdf.content),
      isUint8Array: pdf.content instanceof Uint8Array,
      contentLength: pdf.content?.length,
      constructor: pdf.content?.constructor?.name,
      keys: Object.keys(pdf)
    });

    // md-to-pdf returns an object with filename (path to temp file) or content (Buffer/Uint8Array)
    let pdfBuffer;
    
    if (pdf.filename) {
      // md-to-pdf writes to a file and returns the filename
      console.log('Reading PDF from file:', pdf.filename);
      pdfBuffer = readFileSync(pdf.filename);
      // Clean up the temp file
      try {
        unlinkSync(pdf.filename);
        console.log('Cleaned up temp PDF file');
      } catch (e) {
        console.warn('Could not delete temp PDF file:', e.message);
      }
    } else if (Buffer.isBuffer(pdf.content)) {
      console.log('PDF content is already a Buffer');
      pdfBuffer = pdf.content;
    } else if (pdf.content instanceof Uint8Array) {
      // Convert Uint8Array to Buffer
      console.log('PDF content is Uint8Array, converting to Buffer');
      pdfBuffer = Buffer.from(pdf.content);
    } else if (pdf.content && typeof pdf.content === 'object' && pdf.content.length) {
      // It might be an array-like object, try to convert it
      console.log('PDF content is array-like object, converting to Buffer');
      pdfBuffer = Buffer.from(pdf.content);
    } else if (pdf.content) {
      console.error('PDF content exists but format is unknown. Type:', typeof pdf.content, 'Constructor:', pdf.content?.constructor?.name);
      // Try to convert anyway
      try {
        pdfBuffer = Buffer.from(pdf.content);
        console.log('Successfully converted to Buffer');
      } catch (e) {
        console.error('Failed to convert PDF content to Buffer:', e.message);
        return res.status(500).json({ error: `Cannot convert PDF content to Buffer: ${e.message}` });
      }
    } else {
      console.error('No PDF content or filename returned:', pdf);
      return res.status(500).json({ error: 'No PDF content or filename returned from md-to-pdf' });
    }

    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      console.error('PDF buffer is invalid:', typeof pdfBuffer);
      return res.status(500).json({ error: 'Invalid PDF buffer' });
    }

    // Verify PDF starts with PDF magic bytes
    if (pdfBuffer.length < 4 || pdfBuffer.toString('ascii', 0, 4) !== '%PDF') {
      console.error('Generated content does not appear to be a valid PDF. First bytes:', pdfBuffer.slice(0, 10));
      return res.status(500).json({ error: 'Invalid PDF generated - not a valid PDF file' });
    }

    console.log(`PDF generated successfully: ${pdfBuffer.length} bytes`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(pdfBuffer, 'binary');
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF' });
  } finally {
    // Clean up temporary CSS file
    if (tempCssPath) {
      try {
        unlinkSync(tempCssPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
});

// Serve index.html for all non-API routes (for client-side routing)
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Try to serve from dist folder first (production build)
  const distIndexPath = join(distPath, 'index.html');
  if (existsSync(distIndexPath)) {
    return res.sendFile(distIndexPath);
  }
  
  // Fallback to root index.html (development)
  const rootIndexPath = join(__dirname, 'index.html');
  if (existsSync(rootIndexPath)) {
    return res.sendFile(rootIndexPath);
  }
  
  // If no index.html found, return a helpful message
  res.status(404).send(`
    <html>
      <head><title>Server Running</title></head>
      <body>
        <h1>Server is running on port ${PORT}</h1>
        <p>API endpoints are available at:</p>
        <ul>
          <li>POST /api/fetch-social-data</li>
          <li>POST /api/generate-report</li>
          <li>GET /api/reports</li>
          <li>POST /api/reports</li>
          <li>GET /api/reports/:id</li>
          <li>DELETE /api/reports/:id</li>
          <li>POST /api/convert-to-pdf</li>
        </ul>
        <p>To serve the frontend, run: <code>npm run dev</code> (for development) or <code>npm run build</code> (for production)</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'PostgreSQL (connected)' : 'PostgreSQL (no DATABASE_URL)'}`);
  console.log(`APIFY_TOKEN: ${APIFY_TOKEN ? '✓ Configured' : '✗ Missing'}`);
  console.log(`OPENAI_API_KEY: ${OPENAI_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log(`Authentication: ✓ Enabled (username: ${AUTH_USERNAME})`);
});
