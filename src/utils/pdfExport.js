/**
 * Generate full markdown with tables (exported for preview)
 */
export function generateFullMarkdown(reportMarkdown, combinedData) {
  let fullMarkdown = reportMarkdown;
  if (combinedData) {
    fullMarkdown += generateMarkdownTables(combinedData);
  }
  return fullMarkdown;
}

/**
 * Convert combined data to markdown tables
 */
function generateMarkdownTables(combinedData) {
  if (!combinedData || !combinedData.platforms) return '';

  let markdown = '\n## Platform Metrics Table\n\n';
  
  // Create table header
  markdown += '| Platform | Posts | Likes/Reactions | Comments | Shares/Retweets | Views | Avg Engagement |\n';
  markdown += '|----------|-------|-----------------|----------|-----------------|-------|-----------------|\n';

  // Add table rows
  combinedData.platforms.forEach(platform => {
    const platformData = combinedData.platformData[platform];
    if (!platformData) return;

    const posts = platformData.totalPosts || 0;
    const likes = platformData.totalLikes || platformData.totalReactions || 0;
    const comments = platformData.totalComments || 0;
    const shares = platformData.totalShares || platformData.totalRetweets || 0;
    const views = platformData.totalViews || 0;
    const avgEngagement = platformData.totalPosts > 0 
      ? Math.round(((platformData.totalLikes || 0) + (platformData.totalComments || 0) + (platformData.totalReactions || 0)) / platformData.totalPosts)
      : 0;

    markdown += `| ${platform.charAt(0).toUpperCase() + platform.slice(1)} | ${posts.toLocaleString()} | ${likes.toLocaleString()} | ${comments.toLocaleString()} | ${shares.toLocaleString()} | ${views > 0 ? views.toLocaleString() : 'N/A'} | ${avgEngagement.toLocaleString()} |\n`;
  });

  markdown += '\n';

  // Add engagement comparison
  markdown += '## Engagement Comparison\n\n';
  markdown += '| Platform | Total Engagement |\n';
  markdown += '|---------|------------------|\n';
  
  combinedData.platforms.forEach(platform => {
    const platformData = combinedData.platformData[platform];
    if (!platformData) return;

    const engagement = (platformData.totalLikes || 0) + 
                      (platformData.totalComments || 0) + 
                      (platformData.totalReactions || 0) +
                      (platformData.totalRetweets || 0) +
                      (platformData.totalShares || 0) +
                      (platformData.totalViews || 0);

    markdown += `| ${platform.charAt(0).toUpperCase() + platform.slice(1)} | ${engagement.toLocaleString()} |\n`;
  });

  return markdown;
}

/**
 * Export report to PDF from markdown using md-to-pdf via backend API
 */
export async function exportReportToPDF(reportMarkdown, username, platforms, updatedAt, combinedData) {
  try {
    // Show loading state
    const loadingElement = document.createElement('div');
    loadingElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 24px 48px;
      border-radius: 12px;
      z-index: 10000;
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;
    loadingElement.textContent = 'Generating PDF...';
    document.body.appendChild(loadingElement);

    // Add tables to markdown if we have combined data
    let fullMarkdown = reportMarkdown;
    if (combinedData) {
      fullMarkdown += generateMarkdownTables(combinedData);
    }

    // Add header info to markdown
    const headerInfo = `---
title: Social Media Report
author: ${username}
date: ${new Date(updatedAt).toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
platforms: ${platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
---

`;

    fullMarkdown = headerInfo + fullMarkdown;

    // Send to backend API for PDF conversion
    // In production, use relative URLs (same origin). In dev, use localhost.
    const API_URL = import.meta.env.VITE_PDF_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');
    const authToken = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const response = await fetch(`${API_URL}/api/convert-to-pdf`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ markdown: fullMarkdown }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to generate PDF' }));
      throw new Error(error.error || 'Failed to generate PDF');
    }

    // Get PDF blob - ensure it's treated as binary
    const blob = await response.blob();
    
    // Verify it's actually a PDF
    if (blob.size === 0) {
      throw new Error('Empty PDF received from server');
    }
    
    // Verify PDF magic bytes
    const arrayBuffer = await blob.slice(0, 4).arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const magicBytes = String.fromCharCode(...uint8Array);
    
    if (magicBytes !== '%PDF') {
      console.error('Invalid PDF magic bytes:', magicBytes);
      throw new Error('Invalid PDF format received from server');
    }

    // Generate filename
    const dateStr = new Date(updatedAt).toISOString().split('T')[0];
    const platformsStr = platforms.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('_');
    const filename = `Social_Media_Report_${username}_${platformsStr}_${dateStr}.pdf`;

    // Download PDF
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Remove loading element
    document.body.removeChild(loadingElement);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Remove loading element if still present
    const loadingElements = document.querySelectorAll('div[style*="position: fixed"]');
    loadingElements.forEach(el => {
      if (el.textContent.includes('Generating PDF')) {
        try {
          document.body.removeChild(el);
        } catch (e) {
          // Element might already be removed
        }
      }
    });
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}
