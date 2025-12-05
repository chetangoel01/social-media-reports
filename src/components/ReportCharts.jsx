import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#c7d2fe'];

export function PlatformEngagementChart({ combinedData }) {
  const data = combinedData.platforms.map(platform => {
    const platformData = combinedData.platformData[platform];
    if (!platformData) return null;

    // Calculate engagement consistently: likes/reactions + comments + shares/retweets (exclude views)
    const engagement = (platformData.totalLikes || 0) +
                       (platformData.totalComments || 0) +
                       (platformData.totalReactions || 0) +
                       (platformData.totalRetweets || 0) +
                       (platformData.totalShares || 0);

    return {
      name: platform,
      posts: platformData.totalPosts || 0,
      engagement: engagement,
    };
  }).filter(Boolean);

  return (
    <div className="chart-container" style={{ margin: '32px 0', padding: '24px', background: '#fafafa', borderRadius: '12px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 700 }}>Platform Engagement Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis dataKey="name" stroke="#525252" />
          <YAxis stroke="#525252" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px' 
            }} 
          />
          <Legend />
          <Bar dataKey="posts" fill="#6366f1" name="Total Posts" />
          <Bar dataKey="engagement" fill="#818cf8" name="Total Engagement" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PlatformDistributionChart({ combinedData }) {
  const data = combinedData.platforms.map(platform => {
    const platformData = combinedData.platformData[platform];
    if (!platformData) return null;

    // Calculate engagement consistently: likes/reactions + comments + shares/retweets (exclude views)
    const engagement = (platformData.totalLikes || 0) +
                      (platformData.totalComments || 0) +
                      (platformData.totalReactions || 0) +
                      (platformData.totalRetweets || 0) +
                      (platformData.totalShares || 0);

    return {
      name: platform,
      value: engagement,
    };
  }).filter(Boolean);

  return (
    <div className="chart-container" style={{ margin: '32px 0', padding: '24px', background: '#fafafa', borderRadius: '12px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 700 }}>Engagement Distribution by Platform</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EngagementMetricsTable({ combinedData }) {
  const tableData = combinedData.platforms.map(platform => {
    const platformData = combinedData.platformData[platform];
    if (!platformData) return null;

    return {
      platform,
      posts: platformData.totalPosts || 0,
      likes: platformData.totalLikes || platformData.totalReactions || 0,
      comments: platformData.totalComments || 0,
      shares: platformData.totalShares || platformData.totalRetweets || 0,
      views: platformData.totalViews || 0,
      avgEngagement: platformData.totalPosts > 0
        ? Math.round(((platformData.totalLikes || platformData.totalReactions || 0) + (platformData.totalComments || 0) + (platformData.totalShares || platformData.totalRetweets || 0)) / platformData.totalPosts)
        : 0,
    };
  }).filter(Boolean);

  return (
    <div style={{ margin: '32px 0', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 700 }}>Detailed Platform Metrics</h3>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        background: '#ffffff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <thead>
          <tr style={{ background: '#6366f1', color: '#ffffff' }}>
            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Platform</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Posts</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Likes/Reactions</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Comments</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Shares/Retweets</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Views</th>
            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 600 }}>Avg Engagement</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr 
              key={row.platform}
              style={{ 
                borderBottom: '1px solid #e5e5e5',
                background: index % 2 === 0 ? '#ffffff' : '#fafafa'
              }}
            >
              <td style={{ padding: '16px', fontWeight: 600, textTransform: 'capitalize' }}>
                {row.platform}
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {row.posts.toLocaleString()}
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {row.likes.toLocaleString()}
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {row.comments.toLocaleString()}
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {row.shares.toLocaleString()}
              </td>
              <td style={{ padding: '16px', textAlign: 'right' }}>
                {row.views > 0 ? row.views.toLocaleString() : 'N/A'}
              </td>
              <td style={{ padding: '16px', textAlign: 'right', fontWeight: 600, color: '#6366f1' }}>
                {row.avgEngagement.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

