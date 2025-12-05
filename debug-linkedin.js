/**
 * Debug script to trace LinkedIn data filtering
 * Run with: node debug-linkedin.js
 */

// Sample LinkedIn data structure (paste your actual data here or it will use mock)
const SAMPLE_LINKEDIN_DATA = [
  // This will be replaced with actual data from the API
];

/**
 * Parse timestamp - same logic as dataCleaner.js
 */
function parseTimestamp(timestamp) {
  if (!timestamp) return null;

  if (timestamp instanceof Date) return timestamp;

  if (typeof timestamp === 'number') {
    if (timestamp < 10000000000) {
      return new Date(timestamp * 1000);
    }
    return new Date(timestamp);
  }

  if (typeof timestamp === 'string') {
    // Handle "YYYY-MM-DD HH:MM:SS" format
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
      const isoString = timestamp.replace(' ', 'T');
      const parsed = new Date(isoString);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

/**
 * Debug function to analyze LinkedIn posts
 */
function debugLinkedInData(data, dateRange) {
  console.log('\n' + '='.repeat(80));
  console.log('LINKEDIN DATA DEBUG');
  console.log('='.repeat(80));

  console.log('\n📅 DATE RANGE:');
  console.log(`   Start: ${dateRange.startDate}`);
  console.log(`   End:   ${dateRange.endDate}`);

  const startDate = new Date(dateRange.startDate + 'T00:00:00');
  const endDate = new Date(dateRange.endDate + 'T23:59:59.999');
  console.log(`   Parsed Start: ${startDate.toISOString()}`);
  console.log(`   Parsed End:   ${endDate.toISOString()}`);

  console.log('\n📊 RAW DATA:');
  console.log(`   Total items received: ${data.length}`);

  console.log('\n📝 POST ANALYSIS:');
  console.log('-'.repeat(80));

  let includedCount = 0;
  let excludedCount = 0;

  data.forEach((item, index) => {
    console.log(`\n[Post ${index + 1}]`);

    // Show raw timestamp fields
    console.log('   Raw timestamp fields:');
    console.log(`      posted_at.timestamp: ${item.posted_at?.timestamp} (type: ${typeof item.posted_at?.timestamp})`);
    console.log(`      posted_at.date: ${item.posted_at?.date} (type: ${typeof item.posted_at?.date})`);
    console.log(`      posted_at.relative: ${item.posted_at?.relative}`);

    // What we extract
    const extractedTimestamp = item.posted_at?.timestamp || item.posted_at?.date || item.timestamp || item.createdAt;
    console.log(`   Extracted timestamp: ${extractedTimestamp} (type: ${typeof extractedTimestamp})`);

    // Parse it
    const parsedDate = parseTimestamp(extractedTimestamp);
    console.log(`   Parsed date: ${parsedDate ? parsedDate.toISOString() : 'NULL/INVALID'}`);

    // Check if in range
    let inRange = false;
    let reason = '';
    if (!parsedDate) {
      inRange = true; // Conservative: include if no valid date
      reason = 'NO VALID DATE - INCLUDED BY DEFAULT';
    } else if (parsedDate >= startDate && parsedDate <= endDate) {
      inRange = true;
      reason = 'IN RANGE';
    } else if (parsedDate < startDate) {
      reason = `BEFORE RANGE (${parsedDate.toISOString()} < ${startDate.toISOString()})`;
    } else {
      reason = `AFTER RANGE (${parsedDate.toISOString()} > ${endDate.toISOString()})`;
    }

    console.log(`   ✅ In range: ${inRange} - ${reason}`);

    // Post preview
    const text = item.text || '';
    console.log(`   Text preview: "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);

    if (inRange) includedCount++;
    else excludedCount++;
  });

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`   Total posts: ${data.length}`);
  console.log(`   Included (in range): ${includedCount}`);
  console.log(`   Excluded (out of range): ${excludedCount}`);
  console.log('='.repeat(80) + '\n');

  return { includedCount, excludedCount };
}

// If running directly with node
if (typeof process !== 'undefined' && process.argv) {
  // You can paste data here or modify to read from file
  const testData = SAMPLE_LINKEDIN_DATA.length > 0 ? SAMPLE_LINKEDIN_DATA : [
    {
      posted_at: { timestamp: 1764952408517, date: "2025-12-05 17:33:28", relative: "2h" },
      text: "Test post 1"
    },
    {
      posted_at: { timestamp: 1764866008517, date: "2025-12-04 17:33:28", relative: "1d" },
      text: "Test post 2"
    }
  ];

  const testDateRange = {
    startDate: "2025-11-29",  // Adjust these to your actual date range
    endDate: "2025-12-05"
  };

  console.log('\n⚠️  Using sample/test data. To debug real data:');
  console.log('   1. Run the app and check browser console for LinkedIn raw data');
  console.log('   2. Or use: curl "http://localhost:3001/api/debug/apify-data?platform=linkedin&username=YOUR_USERNAME"');
  console.log('   3. Paste the data into SAMPLE_LINKEDIN_DATA in this file\n');

  debugLinkedInData(testData, testDateRange);
}

export { debugLinkedInData, parseTimestamp };
