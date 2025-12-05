/**
 * Clean and normalize social media data from different platforms
 *
 * This module handles the unique JSON structures from each platform's Apify actor.
 * Each platform returns different field names and structures, so we need to:
 * 1. Inspect the actual JSON structure (use debug endpoint)
 * 2. Map platform-specific fields to a normalized structure
 * 3. Handle missing/null fields gracefully
 * 4. Filter by date range (Saturday-Friday week)
 */

/**
 * Parse a timestamp to Date object
 * Handles various formats: ISO string, Unix timestamp (seconds/ms), date string
 */
function parseTimestamp(timestamp) {
  if (!timestamp) return null;

  // Already a Date
  if (timestamp instanceof Date) return timestamp;

  // Unix timestamp (seconds or ms) - typically 10 or 13 digits
  if (typeof timestamp === 'number') {
    // If it's in seconds (10 digits), convert to ms
    if (timestamp < 10000000000) {
      return new Date(timestamp * 1000);
    }
    return new Date(timestamp);
  }

  // String formats
  if (typeof timestamp === 'string') {
    // Handle "YYYY-MM-DD HH:MM:SS" format (LinkedIn style) - convert to ISO
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
      const isoString = timestamp.replace(' ', 'T');
      const parsed = new Date(isoString);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    // Try standard parsing (ISO string or other parseable format)
    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

/**
 * Filter posts by date range
 * @param {Array} posts - Array of posts with timestamp field
 * @param {Object} dateRange - { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }
 * @returns {Array} Filtered posts within the date range
 */
function filterPostsByDateRange(posts, dateRange) {
  if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
    console.log('⚠️ No date range provided, returning all posts');
    return posts;
  }

  // Parse date range - set start to beginning of day and end to end of day
  const startDate = new Date(dateRange.startDate + 'T00:00:00');
  const endDate = new Date(dateRange.endDate + 'T23:59:59.999');

  console.log(`📅 Filter range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  const filtered = posts.filter((post, idx) => {
    const postDate = parseTimestamp(post.timestamp);

    if (!postDate) {
      console.log(`[${idx + 1}] ⚠️ NO VALID DATE - INCLUDED | raw: ${post.timestamp}`);
      return true;
    }

    const inRange = postDate >= startDate && postDate <= endDate;
    const status = inRange ? '✅ IN RANGE' : '❌ OUT OF RANGE';
    console.log(`[${idx + 1}] ${status} | ${postDate.toISOString()} | "${(post.text || '').substring(0, 40)}..."`);

    return inRange;
  });

  console.log(`\n📊 FILTER RESULT: ${posts.length} → ${filtered.length} posts`);
  return filtered;
}

/**
 * Remove duplicate posts based on text content
 * @param {Array} posts - Array of posts with text/caption/description field
 * @param {string} platform - Platform name for logging
 * @returns {Array} Deduplicated posts
 */
function removeDuplicatePosts(posts, platform) {
  const seenTexts = new Set();
  const uniquePosts = posts.filter(post => {
    // Extract text content from various field names
    const text = post.text || post.caption || post.description || '';

    // Create a normalized key using first 100 chars (longer than LinkedIn's 50 to be more precise)
    const textKey = text
      .substring(0, 100)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    // Skip posts with no text content
    if (!textKey) {
      return true;
    }

    if (seenTexts.has(textKey)) {
      console.log(`🔄 [${platform}] DUPLICATE REMOVED: "${text.substring(0, 50)}..."`);
      return false;
    }

    seenTexts.add(textKey);
    return true;
  });

  if (uniquePosts.length < posts.length) {
    console.log(`🧹 [${platform}] Deduplication: ${posts.length} → ${uniquePosts.length} posts`);
  }

  return uniquePosts;
}

/**
 * Auto-detect field mappings by inspecting the first item
 * This makes the cleaning more resilient to API changes
 */
function detectFieldMapping(item, platform) {
  const mapping = {};
  
  if (platform === 'instagram') {
    // Instagram structure: check for latestPosts array or direct posts
    if (item.latestPosts && Array.isArray(item.latestPosts)) {
      // Profile structure with latestPosts
      return { type: 'profile', postsPath: 'latestPosts' };
    } else if (Array.isArray(item)) {
      // Direct array of posts
      return { type: 'posts', postsPath: 'root' };
    }
  }
  
  // Add detection for other platforms as needed
  return { type: 'unknown', postsPath: null };
}

export function cleanPlatformData(platformData, dateRange = null) {
  if (!platformData || !platformData.data) {
    return null;
  }

  const { platform, username, data } = platformData;
  // Use dateRange from platformData if available, or fall back to parameter
  const effectiveDateRange = platformData.dateRange || dateRange;

  switch (platform) {
    case 'instagram':
      return cleanInstagramData(data, username, effectiveDateRange);
    case 'linkedin':
      return cleanLinkedInData(data, username, effectiveDateRange);
    case 'facebook':
      return cleanFacebookData(data, username, effectiveDateRange);
    case 'twitter':
      return cleanTwitterData(data, username, effectiveDateRange);
    case 'tiktok':
      return cleanTikTokData(data, username, effectiveDateRange);
    default:
      return null;
  }
}

function cleanInstagramData(data, username, dateRange = null) {
  // Instagram returns profile object with latestPosts array
  // Structure: [{ inputUrl, id, username, latestPosts: [...], ... }]
  let posts = [];

  if (Array.isArray(data) && data.length > 0) {
    const profile = data[0]; // First item is the profile

    // Extract posts from latestPosts array
    if (profile.latestPosts && Array.isArray(profile.latestPosts)) {
      posts = profile.latestPosts.map(item => ({
        id: item.id || item.shortCode,
        type: item.type || 'photo',
        caption: item.caption || '',
        likes: item.likesCount || 0,
        comments: item.commentsCount || 0,
        timestamp: item.timestamp,
        url: item.url || `https://www.instagram.com/p/${item.shortCode}/`,
        hashtags: extractHashtags(item.caption || ''),
        mentions: extractMentions(item.caption || ''),
      }));
    }

    // Filter posts by date range (Instagram actor doesn't support native date filtering)
    posts = filterPostsByDateRange(posts, dateRange);

    // Remove duplicates
    posts = removeDuplicatePosts(posts, 'Instagram');

    // Also extract profile-level metrics if available
    const profileMetrics = {
      followersCount: profile.followersCount || 0,
      followsCount: profile.followsCount || 0,
      postsCount: profile.postsCount || 0,
      verified: profile.verified || false,
    };

    return {
      platform: 'Instagram',
      username: profile.username || username,
      posts,
      totalPosts: posts.length,
      totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
      totalComments: posts.reduce((sum, p) => sum + (p.comments || 0), 0),
      avgLikes: posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + (p.likes || 0), 0) / posts.length) : 0,
      avgComments: posts.length > 0 ? Math.round(posts.reduce((sum, p) => sum + (p.comments || 0), 0) / posts.length) : 0,
      profileMetrics,
      dateRange,
    };
  }

  return {
    platform: 'Instagram',
    username,
    posts: [],
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    avgLikes: 0,
    avgComments: 0,
    dateRange,
  };
}

function cleanLinkedInData(data, username, dateRange = null) {
  // LinkedIn structure: array of posts
  // Each post has: activity_urn, text, posted_at, stats, post_url, etc.

  console.log('=== LINKEDIN DEBUG START ===');
  console.log('Raw data count:', data?.length);
  console.log('Date range:', dateRange);

  let posts = (Array.isArray(data) ? data : []).map((item, idx) => {
    const extractedTimestamp = item.posted_at?.timestamp || item.posted_at?.date || item.timestamp || item.createdAt;

    console.log(`[Post ${idx + 1}] posted_at:`, item.posted_at);
    console.log(`[Post ${idx + 1}] extracted timestamp:`, extractedTimestamp, 'type:', typeof extractedTimestamp);

    return {
      id: item.activity_urn || item.full_urn || item.id || item.urn,
      text: item.text || item.commentary?.text?.text || item.commentary || '',
      reactions: item.stats?.total_reactions || item.reactionsCount || 0,
      comments: item.stats?.comments || item.commentsCount || 0,
      shares: item.stats?.reposts || item.sharesCount || 0,
      // Prefer numeric timestamp (ms) over string date for reliable parsing
      timestamp: extractedTimestamp,
      url: item.post_url || item.url || item.permalink || item.shareUrl,
    };
  });

  console.log('Posts before filter:', posts.length);

  // Filter posts by date range (LinkedIn actor doesn't support native date filtering)
  posts = filterPostsByDateRange(posts, dateRange);

  // Remove duplicates (LinkedIn sometimes returns duplicates)
  posts = removeDuplicatePosts(posts, 'LinkedIn');

  console.log('Posts after filter:', posts.length);
  console.log('=== LINKEDIN DEBUG END ===');

  return {
    platform: 'LinkedIn',
    username,
    posts,
    totalPosts: posts.length,
    totalReactions: posts.reduce((sum, p) => sum + (p.reactions || 0), 0),
    totalComments: posts.reduce((sum, p) => sum + (p.comments || 0), 0),
    totalShares: posts.reduce((sum, p) => sum + (p.shares || 0), 0),
    dateRange,
  };
}

function cleanFacebookData(data, username, dateRange = null) {
  // Facebook structure: array of posts
  // Each post has: url, text, likes, shares, media, etc.
  // Note: Facebook actor supports native date filtering via onlyPostsNewerThan
  let posts = (Array.isArray(data) ? data : []).map(item => ({
    id: item.id || item.postId || item.post_id,
    text: item.text || item.message || item.description || '',
    likes: item.likes || item.reactionsCount || item.reactions?.total_count || 0,
    comments: item.commentsCount || item.comments?.total_count || item.comments || 0,
    shares: item.shares || item.sharesCount || 0,
    timestamp: item.timestamp || item.created_time || item.createdTime,
    url: item.url || item.permalink_url || item.permalink || item.link,
  }));

  // Apply date filtering for consistency (even though Apify actor may have filtered already)
  posts = filterPostsByDateRange(posts, dateRange);

  // Remove duplicates
  posts = removeDuplicatePosts(posts, 'Facebook');

  return {
    platform: 'Facebook',
    username,
    posts,
    totalPosts: posts.length,
    totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    totalComments: posts.reduce((sum, p) => sum + (p.comments || 0), 0),
    totalShares: posts.reduce((sum, p) => sum + (p.shares || 0), 0),
    dateRange,
  };
}

function cleanTwitterData(data, username, dateRange = null) {
  // Twitter structure: array of tweets
  // Each tweet has: id_str, full_text, favorite_count, retweet_count, reply_count, views_count, etc.

  console.log('=== TWITTER DEBUG START ===');
  console.log('Raw data count:', data?.length);
  if (data?.length > 0) {
    console.log('First item keys:', Object.keys(data[0]));
    console.log('First item sample:', JSON.stringify(data[0]).substring(0, 500));
  }

  // Check if actor returned demo/placeholder data
  if (data?.length > 0 && data[0].demo === true) {
    console.warn('⚠️ Twitter actor returned demo data - skipping platform');
    return {
      platform: 'Twitter',
      username,
      posts: [],
      totalPosts: 0,
      totalLikes: 0,
      totalRetweets: 0,
      totalReplies: 0,
      totalViews: 0,
      dateRange,
      error: 'Twitter scraper returned demo data - may be rate limited or require paid plan',
    };
  }

  let tweets = (Array.isArray(data) ? data : []).map((item, idx) => {
    const extractedTimestamp = item.created_at || item.timestamp || item.createdAt;
    if (idx < 3) {
      console.log(`[Tweet ${idx + 1}] created_at:`, item.created_at, '| timestamp:', item.timestamp, '| extracted:', extractedTimestamp);
    }

    // Parse views - new actor returns it as string
    let viewsCount = 0;
    if (item.views) {
      viewsCount = typeof item.views === 'string' ? parseInt(item.views) || 0 : item.views;
    } else if (item.views_count) {
      viewsCount = parseInt(item.views_count) || 0;
    }

    return {
      id: item.tweet_id || item.id_str || item.id || item.tweetId,
      text: item.text || item.full_text || item.content || '',
      likes: item.favorites || item.favorite_count || item.likes || item.like_count || 0,
      retweets: item.retweets || item.retweet_count || 0,
      replies: item.replies || item.reply_count || item.replies_count || 0,
      views: viewsCount,
      timestamp: extractedTimestamp,
      url: item.url || item.permalink || `https://x.com/${username}/status/${item.tweet_id || item.id_str || item.id}`,
      hashtags: item.entities?.hashtags?.map(h => `#${h.text || h.tag}`) || extractHashtags(item.text || item.full_text || ''),
      mentions: item.entities?.user_mentions?.map(m => `@${m.screen_name}`) || extractMentions(item.text || item.full_text || ''),
    };
  });

  console.log('=== TWITTER DEBUG END ===');

  // Filter tweets by date range (Twitter actor supports since_date, but we filter here for consistency)
  tweets = filterPostsByDateRange(tweets, dateRange);

  // Remove duplicates
  tweets = removeDuplicatePosts(tweets, 'Twitter');

  return {
    platform: 'Twitter',
    username,
    posts: tweets,
    totalPosts: tweets.length,
    totalLikes: tweets.reduce((sum, t) => sum + (t.likes || 0), 0),
    totalRetweets: tweets.reduce((sum, t) => sum + (t.retweets || 0), 0),
    totalReplies: tweets.reduce((sum, t) => sum + (t.replies || 0), 0),
    totalViews: tweets.reduce((sum, t) => sum + (t.views || 0), 0),
    dateRange,
  };
}

function cleanTikTokData(data, username, dateRange = null) {
  // TikTok structure: array of videos
  // Each video has: id, description, likes, comments, shares, views, etc.
  // Note: TikTok actor supports native date filtering, but we still apply it here for consistency
  let videos = (Array.isArray(data) ? data : []).map(item => ({
    id: item.id || item.aweme_id || item.video_id,
    description: item.description || item.desc || item.caption || '',
    likes: item.likes || item.digg_count || item.like_count || 0,
    comments: item.comments || item.comment_count || 0,
    shares: item.shares || item.share_count || 0,
    views: item.views || item.play_count || item.view_count || 0,
    timestamp: item.timestamp || item.create_time || item.created_at,
    url: item.url || item.webVideoUrl || item.video_url || item.share_url,
    hashtags: extractHashtags(item.description || item.desc || ''),
    music: item.music?.title || item.music_title || '',
  }));

  // Apply date filtering for consistency (even though Apify actor may have filtered already)
  videos = filterPostsByDateRange(videos, dateRange);

  // Remove duplicates
  videos = removeDuplicatePosts(videos, 'TikTok');

  return {
    platform: 'TikTok',
    username,
    posts: videos,
    totalPosts: videos.length,
    totalLikes: videos.reduce((sum, v) => sum + (v.likes || 0), 0),
    totalComments: videos.reduce((sum, v) => sum + (v.comments || 0), 0),
    totalShares: videos.reduce((sum, v) => sum + (v.shares || 0), 0),
    totalViews: videos.reduce((sum, v) => sum + (v.views || 0), 0),
    dateRange,
  };
}

function extractHashtags(text) {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
}

function extractMentions(text) {
  const mentionRegex = /@[\w]+/g;
  return text.match(mentionRegex) || [];
}

/**
 * Combine cleaned data from all platforms into a single structure
 */
export function combinePlatformData(cleanedDataArray) {
  const combined = {
    platforms: [],
    totalPosts: 0,
    totalEngagement: 0,
    platformData: {},
    dateRange: null,
  };

  cleanedDataArray.forEach(data => {
    if (data && !data.error) {
      combined.platforms.push(data.platform);
      combined.totalPosts += data.totalPosts || 0;
      combined.platformData[data.platform] = data;

      // Capture dateRange from first platform that has it
      if (!combined.dateRange && data.dateRange) {
        combined.dateRange = data.dateRange;
      }

      // Calculate total engagement (sum of all engagement metrics)
      if (data.totalLikes) combined.totalEngagement += data.totalLikes;
      if (data.totalComments) combined.totalEngagement += data.totalComments;
      if (data.totalReactions) combined.totalEngagement += data.totalReactions;
      if (data.totalRetweets) combined.totalEngagement += data.totalRetweets;
      if (data.totalShares) combined.totalEngagement += data.totalShares;
      if (data.totalViews) combined.totalEngagement += data.totalViews;
    }
  });

  return combined;
}

/**
 * Clean raw data on-demand (for stored reports)
 * This allows us to re-process with updated cleaning logic
 */
export function cleanStoredReportData(rawPlatformData) {
  const cleanedDataArray = rawPlatformData.map(data => {
    if (data.error) {
      return { platform: data.platform, error: data.error };
    }
    return cleanPlatformData(data);
  });
  
  return combinePlatformData(cleanedDataArray);
}
