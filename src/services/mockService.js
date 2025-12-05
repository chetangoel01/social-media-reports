/**
 * Mock service for testing UI without API calls
 */

// Mock data generator
function generateMockPlatformData(platform, username) {
  const baseData = {
    instagram: {
      platform: 'instagram',
      username,
      posts: Array.from({ length: 15 }, (_, i) => ({
        id: `ig_${i + 1}`,
        type: i % 3 === 0 ? 'video' : 'photo',
        caption: `Check out this amazing ${i % 2 === 0 ? 'sunset' : 'cityscape'}! #photography #${platform} #travel`,
        likes: Math.floor(Math.random() * 5000) + 100,
        comments: Math.floor(Math.random() * 200) + 10,
        timestamp: Date.now() - (i * 86400000),
        url: `https://instagram.com/p/example${i}`,
        hashtags: ['#photography', '#travel', '#instagood'],
        mentions: ['@friend1', '@friend2'],
      })),
    },
    linkedin: {
      platform: 'linkedin',
      username,
      posts: Array.from({ length: 12 }, (_, i) => ({
        id: `li_${i + 1}`,
        text: `Excited to share our latest insights on ${i % 2 === 0 ? 'digital transformation' : 'leadership'}! Here's what we learned...`,
        reactions: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 100) + 5,
        shares: Math.floor(Math.random() * 50) + 2,
        timestamp: Date.now() - (i * 172800000),
        url: `https://linkedin.com/posts/example${i}`,
      })),
    },
    facebook: {
      platform: 'facebook',
      username,
      posts: Array.from({ length: 10 }, (_, i) => ({
        id: `fb_${i + 1}`,
        text: `Just finished an amazing ${i % 2 === 0 ? 'project' : 'event'}! Thanks to everyone who made it possible.`,
        reactions: Math.floor(Math.random() * 2000) + 100,
        comments: Math.floor(Math.random() * 150) + 10,
        shares: Math.floor(Math.random() * 100) + 5,
        timestamp: Date.now() - (i * 259200000),
        url: `https://facebook.com/posts/example${i}`,
      })),
    },
    twitter: {
      platform: 'twitter',
      username,
      posts: Array.from({ length: 20 }, (_, i) => ({
        id: `tw_${i + 1}`,
        text: `Just launched something exciting! 🚀 ${i % 3 === 0 ? 'Check it out!' : 'Stay tuned for more updates.'} #innovation #tech`,
        likes: Math.floor(Math.random() * 500) + 20,
        retweets: Math.floor(Math.random() * 200) + 5,
        replies: Math.floor(Math.random() * 50) + 2,
        timestamp: Date.now() - (i * 3600000),
        url: `https://twitter.com/${username}/status/${i + 1}`,
        hashtags: ['#innovation', '#tech'],
        mentions: ['@technews', '@startup'],
      })),
    },
    tiktok: {
      platform: 'tiktok',
      username,
      posts: Array.from({ length: 18 }, (_, i) => ({
        id: `tt_${i + 1}`,
        description: `POV: ${i % 2 === 0 ? 'You discover the perfect hack' : 'When everything goes right'} #fyp #viral #trending`,
        likes: Math.floor(Math.random() * 10000) + 500,
        comments: Math.floor(Math.random() * 500) + 20,
        shares: Math.floor(Math.random() * 200) + 10,
        views: Math.floor(Math.random() * 50000) + 1000,
        timestamp: Date.now() - (i * 43200000),
        url: `https://tiktok.com/@${username}/video/${i + 1}`,
        hashtags: ['#fyp', '#viral', '#trending'],
        music: i % 2 === 0 ? 'Original Sound' : 'Trending Audio',
      })),
    },
  };

  return baseData[platform] || baseData.instagram;
}

class MockService {
  /**
   * Simulate fetching data from multiple platforms
   */
  async fetchMultiplePlatforms(platforms, username) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return platforms.map(platform => {
      try {
        const data = generateMockPlatformData(platform, username);
        return {
          platform,
          username,
          data: data.posts,
          count: data.posts.length,
        };
      } catch (error) {
        return {
          platform,
          username,
          error: `Failed to fetch ${platform} data`,
          data: [],
        };
      }
    });
  }

  /**
   * Simulate generating a report with LLM
   */
  async generateReport(combinedData, username) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const platforms = combinedData.platforms.join(', ');
    const totalPosts = combinedData.totalPosts;
    const totalEngagement = combinedData.totalEngagement;

    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `# Executive Summary

**Report Generated:** ${reportDate}

This comprehensive social media analysis for **${username}** reveals a strong presence across ${combinedData.platforms.length} major platforms. The account demonstrates consistent engagement and content quality across all channels.

## Overall Performance

- **Total Posts**: ${totalPosts} posts analyzed
- **Total Engagement**: ${totalEngagement.toLocaleString()} interactions
- **Platforms Analyzed**: ${platforms}
- **Average Engagement Rate**: ${((totalEngagement / totalPosts / 100) * 100).toFixed(2)}%
- **Average Engagement per Post**: ${Math.round(totalEngagement / totalPosts).toLocaleString()}

---

## Platform-by-Platform Analysis

${combinedData.platforms.map(platform => {
  const data = combinedData.platformData[platform];
  if (!data) return '';
  
  return `### ${platform}

**Performance Metrics:**
- Total Posts: ${data.totalPosts}
${data.totalLikes ? `- Total Likes: ${data.totalLikes.toLocaleString()}` : ''}
${data.avgLikes ? `- Average Likes per Post: ${data.avgLikes.toLocaleString()}` : ''}
${data.totalComments ? `- Total Comments: ${data.totalComments.toLocaleString()}` : ''}
${data.avgComments ? `- Average Comments per Post: ${data.avgComments.toLocaleString()}` : ''}
${data.totalReactions ? `- Total Reactions: ${data.totalReactions.toLocaleString()}` : ''}
${data.totalRetweets ? `- Total Retweets: ${data.totalRetweets.toLocaleString()}` : ''}
${data.totalShares ? `- Total Shares: ${data.totalShares.toLocaleString()}` : ''}
${data.totalViews ? `- Total Views: ${data.totalViews.toLocaleString()}` : ''}

**Key Insights:**
- The account shows ${data.totalPosts > 10 ? 'strong' : 'moderate'} activity on ${platform}
- Engagement patterns indicate ${data.avgLikes > 100 || data.avgComments > 10 ? 'high' : 'moderate'} audience interaction
- Content strategy appears ${data.totalPosts > 15 ? 'consistent' : 'developing'} with regular posting

**Top Performing Content:**
${data.posts && data.posts.length > 0 ? data.posts.slice(0, 3).map((post, idx) => {
  const engagement = (post.likes || post.reactions || 0) + (post.comments || 0);
  const text = (post.text || post.caption || post.description || '').substring(0, 80);
  return `${idx + 1}. "${text}${text.length >= 80 ? '...' : ''}" - ${engagement.toLocaleString()} engagements`;
}).join('\n') : 'No posts available'}

`;
}).join('\n---\n\n')}

## Content Performance Insights

### Engagement Trends

The account demonstrates ${totalEngagement > 10000 ? 'exceptional' : totalEngagement > 5000 ? 'strong' : 'growing'} engagement across all platforms. Key observations:

1. **Peak Performance**: ${combinedData.platforms[0] || 'N/A'} shows the highest engagement rates
2. **Content Variety**: The account maintains a good mix of content types
3. **Audience Growth**: Consistent posting patterns suggest ${totalPosts > 50 ? 'established' : 'developing'} audience relationships

### Content Strategy Analysis

- **Posting Frequency**: ${totalPosts > 50 ? 'High' : totalPosts > 20 ? 'Moderate' : 'Developing'} - ${totalPosts > 50 ? 'Excellent consistency' : 'Room for increased activity'}
- **Engagement Quality**: ${totalEngagement / totalPosts > 100 ? 'High-quality interactions' : 'Growing engagement'}
- **Platform Optimization**: Content appears optimized for each platform's unique audience

---

## Recommendations for Improvement

### Immediate Actions

1. **Increase Posting Frequency**: Consider posting ${totalPosts < 30 ? 'more regularly' : 'at optimal times'} to maintain audience engagement
2. **Content Diversification**: ${totalPosts > 30 ? 'Continue exploring' : 'Experiment with'} different content formats
3. **Engagement Optimization**: Focus on ${totalEngagement / totalPosts < 50 ? 'improving' : 'maintaining'} engagement rates through strategic content planning

### Long-term Strategy

1. **Analytics Tracking**: Implement detailed analytics to track performance metrics
2. **Audience Insights**: Deep dive into audience demographics and preferences
3. **Content Calendar**: Develop a structured content calendar for consistent posting
4. **Cross-platform Promotion**: Leverage strong platforms to boost others

---

## Key Takeaways

✅ **Strengths:**
- Strong presence across multiple platforms
- Consistent content quality
- ${totalEngagement > 10000 ? 'Exceptional' : 'Good'} overall engagement

📈 **Opportunities:**
- ${totalPosts < 30 ? 'Increase posting frequency' : 'Optimize posting times'}
- ${totalEngagement / totalPosts < 50 ? 'Enhance engagement strategies' : 'Maintain current momentum'}
- Explore new content formats and trends

🎯 **Next Steps:**
1. Review top-performing content to identify successful patterns
2. Develop content strategy based on platform-specific insights
3. Set engagement and growth targets for the next quarter

---

*Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*
`;
  }
}

export default new MockService();

