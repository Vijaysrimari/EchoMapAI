export type AnalyticsRange = 'Last 7 Days' | 'Last 30 Days' | 'Last 3 Months'

export const trendData = [
  { label: 'Mon', reports: 120 },
  { label: 'Tue', reports: 145 },
  { label: 'Wed', reports: 132 },
  { label: 'Thu', reports: 178 },
  { label: 'Fri', reports: 165 },
  { label: 'Sat', reports: 210 },
  { label: 'Sun', reports: 198 },
]

export const hourlyData = [
  { label: '6 AM', reports: 35 },
  { label: '8 AM', reports: 92 },
  { label: '10 AM', reports: 110 },
  { label: '12 PM', reports: 78 },
  { label: '2 PM', reports: 96 },
  { label: '4 PM', reports: 125 },
  { label: '6 PM', reports: 180 },
  { label: '8 PM', reports: 165 },
  { label: '10 PM', reports: 88 },
]

export const soundTypeData = [
  { name: 'Heavy Traffic', value: 32, color: '#1677FF' },
  { name: 'Jackhammer', value: 18, color: '#14B8A6' },
  { name: 'Car Horn', value: 16, color: '#8B5CF6' },
  { name: 'Siren', value: 12, color: '#F59E0B' },
  { name: 'Drilling', value: 10, color: '#DC2626' },
  { name: 'Crowd', value: 8, color: '#0EA5E9' },
  { name: 'Other', value: 4, color: '#94A3B8' },
]

export const severityData = [
  { name: 'High', reports: 186, color: '#DC2626' },
  { name: 'Moderate', reports: 524, color: '#F59E0B' },
  { name: 'Low', reports: 538, color: '#16A34A' },
]
