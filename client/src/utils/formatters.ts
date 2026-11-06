// Currency Formatter (INR ₹)
export function formatCurrency(amount: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(amount) >= 10_000_000) {
      return `₹${(amount / 10_000_000).toFixed(2)}Cr`;
    }
    if (Math.abs(amount) >= 100_000) {
      return `₹${(amount / 100_000).toFixed(2)}L`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `₹${(amount / 1_000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Compact Number Formatter
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Relative & Clean Date Formatter
export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

// Export array of objects to CSV
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(header => {
      const val = item[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Color generator for avatars
const AVATAR_COLORS = [
  { bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { bg: 'bg-violet-100 text-violet-700 border-violet-200' },
  { bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  { bg: 'bg-rose-100 text-rose-700 border-rose-200' },
  { bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index].bg;
}

