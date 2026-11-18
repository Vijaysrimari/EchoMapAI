export type HotspotSeverity = 'High' | 'Moderate' | 'Low'
export type HotspotStatus = 'Active' | 'Monitoring'

export interface HotspotRecord {
  id: string
  area: string
  reports: number
  highSeverity: number
  dominantSound: string
  averageLevel: string
  severity: HotspotSeverity
  status: HotspotStatus
  lastReported: string
  soundTypes: string[]
  x: number
  y: number
}

export const hotspotRecords: HotspotRecord[] = [
  { id: 'central', area: 'Central District', reports: 86, highSeverity: 28, dominantSound: 'Heavy Traffic', averageLevel: '78 dB', severity: 'High', status: 'Active', lastReported: '10 minutes ago', soundTypes: ['Heavy Traffic', 'Car Horn', 'Siren'], x: 45, y: 40 },
  { id: 'construction', area: 'Construction Zone', reports: 64, highSeverity: 31, dominantSound: 'Jackhammer', averageLevel: '84 dB', severity: 'High', status: 'Active', lastReported: '18 minutes ago', soundTypes: ['Jackhammer', 'Drilling', 'Heavy Machinery'], x: 24, y: 27 },
  { id: 'industrial', area: 'Industrial Area', reports: 52, highSeverity: 22, dominantSound: 'Drilling', averageLevel: '81 dB', severity: 'High', status: 'Active', lastReported: '26 minutes ago', soundTypes: ['Drilling', 'Heavy Machinery', 'Traffic'], x: 76, y: 72 },
  { id: 'hospital', area: 'Hospital Road', reports: 38, highSeverity: 8, dominantSound: 'Siren', averageLevel: '73 dB', severity: 'Moderate', status: 'Monitoring', lastReported: '34 minutes ago', soundTypes: ['Siren', 'Car Horn', 'Traffic'], x: 74, y: 25 },
  { id: 'market', area: 'Market Area', reports: 31, highSeverity: 4, dominantSound: 'Crowd', averageLevel: '68 dB', severity: 'Low', status: 'Monitoring', lastReported: '42 minutes ago', soundTypes: ['Crowd', 'Car Horn', 'Traffic'], x: 24, y: 72 },
]
