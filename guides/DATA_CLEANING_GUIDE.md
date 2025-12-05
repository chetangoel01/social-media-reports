# Data Cleaning Guide

## Overview

Each platform's Apify actor returns JSON in a **unique structure**. This guide explains how to determine the best cleaning approach for each platform.

## How to Determine Cleaning Logic

### Step 1: Inspect Raw JSON Structure

Use the debug endpoint to see the actual JSON structure:

```bash
curl "http://localhost:3001/api/debug/apify-data?platform=instagram&username=humansofny"
```

This returns:
- `sampleItem`: First item from the dataset
- `sampleItemKeys`: All available keys in the first item
- `fullData`: Complete dataset for inspection

### Step 2: Identify Data Patterns

Look for:
1. **Array vs Object**: Is the data an array of posts, or an object with nested arrays?
2. **Field Names**: What are the actual field names? (e.g., `likesCount` vs `likes` vs `favorite_count`)
3. **Nested Structures**: Are posts nested inside a profile object? (e.g., `profile.latestPosts`)
4. **Metric Locations**: Where are engagement metrics stored?

### Step 3: Map to Normalized Structure

Create a cleaning function that:
- Handles multiple possible field names (with fallbacks)
- Extracts posts/content from nested structures
- Normalizes metrics to consistent names
- Handles missing/null values gracefully

## Platform-Specific Structures

### Instagram
**Structure**: Array with profile object containing `latestPosts`
```json
[{
  "id": "242598499",
  "username": "humansofny",
  "followersCount": 12834650,
  "latestPosts": [
    {
      "id": "3741054891297971261",
      "likesCount": 104716,
      "commentsCount": 922,
      "caption": "...",
      "timestamp": "2025-10-11T13:27:07.000Z"
    }
  ]
}]
```

**Cleaning Strategy**:
- Extract `latestPosts` array from profile object
- Use `likesCount`, `commentsCount` for metrics
- Extract profile-level data (followers, verified status)

### LinkedIn
**Structure**: Array of post objects
```json
[{
  "id": "...",
  "text": "...",
  "reactionsCount": 100,
  "commentsCount": 50,
  "sharesCount": 25
}]
```

**Cleaning Strategy**:
- Direct array mapping
- Use `reactionsCount`, `commentsCount`, `sharesCount`

### Facebook
**Structure**: Array of post objects
```json
[{
  "id": "...",
  "text": "...",
  "reactionsCount": 100,
  "commentsCount": 50,
  "sharesCount": 25
}]
```

**Cleaning Strategy**:
- Similar to LinkedIn
- Use `reactionsCount`, `commentsCount`, `sharesCount`

### Twitter
**Structure**: Array of tweet objects
```json
[{
  "id": "...",
  "text": "...",
  "likes": 100,
  "retweets": 50,
  "replies": 25
}]
```

**Cleaning Strategy**:
- Direct array mapping
- Use `likes`, `retweets`, `replies`

### TikTok
**Structure**: Array of video objects
```json
[{
  "id": "...",
  "description": "...",
  "likes": 100,
  "comments": 50,
  "shares": 25,
  "views": 1000
}]
```

**Cleaning Strategy**:
- Direct array mapping
- Use `likes`, `comments`, `shares`, `views`

## Best Practices

1. **Use Fallbacks**: Always provide multiple field name options
   ```javascript
   likes: item.likesCount || item.likes || item.favorite_count || 0
   ```

2. **Handle Nested Structures**: Check for nested arrays/objects
   ```javascript
   if (profile.latestPosts && Array.isArray(profile.latestPosts)) {
     posts = profile.latestPosts.map(...)
   }
   ```

3. **Store Raw Data**: Store original JSON, clean on-demand
   - Allows re-processing with updated logic
   - Preserves original data structure
   - Reduces storage duplication

4. **Test with Real Data**: Always test cleaning functions with actual API responses

5. **Log Structure**: Use console.log to inspect actual JSON when debugging

## Updating Cleaning Logic

When a platform's JSON structure changes:

1. Use debug endpoint to inspect new structure
2. Update cleaning function with new field mappings
3. Add fallbacks for backward compatibility
4. Test with both old and new data formats
5. No need to re-fetch data - stored raw JSON can be re-processed

