export const getAnalyticsSummary = async (req, res) => {
  const range = req.query.range || '30days';

  const revenueData = {
    today: { total: 180000, target: 170000, delta: '+5.9%' },
    '7days': { total: 320000, target: 280000, delta: '+14.3%' },
    '30days': { total: 1248000, target: 1050000, delta: '+18.4%' },
    '3months': { total: 3820000, target: 3300000, delta: '+15.8%' },
    '1year': { total: 8450000, target: 7500000, delta: '+22.6%' }
  }[range] || { total: 1248000, target: 1050000, delta: '+18.4%' };

  const leaderboard = [
    { rank: 1, name: 'Viraj', fullName: 'Viraj Somani', revenue: 820000, display: '₹8.2L', dealsWon: 18, winRate: 82 },
    { rank: 2, name: 'Rahul', fullName: 'Rahul Mehta', revenue: 670000, display: '₹6.7L', dealsWon: 14, winRate: 74 },
    { rank: 3, name: 'Priya', fullName: 'Priya Sharma', revenue: 590000, display: '₹5.9L', dealsWon: 12, winRate: 70 },
    { rank: 4, name: 'Alex', fullName: 'Alex Rivera', revenue: 480000, display: '₹4.8L', dealsWon: 9, winRate: 65 },
    { rank: 5, name: 'Maya', fullName: 'Maya Patel', revenue: 420000, display: '₹4.2L', dealsWon: 8, winRate: 52 }
  ];

  const funnel = [
    { stage: 'Leads', count: 1248, rate: '100%', color: '#3b82f6' },
    { stage: 'Qualified', count: 640, rate: '51.2%', color: '#06b6d4' },
    { stage: 'Proposal', count: 285, rate: '22.8%', color: '#f59e0b' },
    { stage: 'Won', count: 86, rate: '6.9%', color: '#10b981' }
  ];

  const leadSources = [
    { source: 'Website', leads: 436, percent: 34.9, color: '#3b82f6' },
    { source: 'LinkedIn', leads: 312, percent: 25.0, color: '#06b6d4' },
    { source: 'Referral', leads: 224, percent: 18.0, color: '#10b981' },
    { source: 'Google Ads', leads: 148, percent: 11.9, color: '#f59e0b' },
    { source: 'Email', leads: 82, percent: 6.6, color: '#8b5cf6' },
    { source: 'Other', leads: 46, percent: 3.6, color: '#64748b' }
  ];

  const pipelineDistribution = [
    { name: 'New Lead', count: 24, value: 580000, percentage: 14, color: '#3b82f6' },
    { name: 'Qualified', count: 22, value: 1120000, percentage: 27, color: '#06b6d4' },
    { name: 'Proposal', count: 18, value: 1450000, percentage: 35, color: '#f59e0b' },
    { name: 'Negotiation', count: 12, value: 860000, percentage: 21, color: '#8b5cf6' },
    { name: 'Won', count: 10, value: 1248000, percentage: 30, color: '#10b981' }
  ];

  res.status(200).json({
    success: true,
    data: {
      range,
      revenue: revenueData,
      leaderboard,
      funnel,
      leadSources,
      pipelineDistribution
    }
  });
};

