import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type Severity = 'HIGH' | 'MODERATE' | 'LOW';
type Filter = 'All' | Severity;
type IconName = keyof typeof Ionicons.glyphMap;

type Report = {
  id: string;
  category: string;
  type: string;
  severity: Severity;
  level: string;
  location: string;
  timestamp: string;
  icon: IconName;
};

const filters: Filter[] = ['All', 'HIGH', 'MODERATE', 'LOW'];
const reports: Report[] = [
  { id: 'construction', category: 'Construction', type: 'Jackhammer', severity: 'HIGH', level: '84 dB', location: 'Construction Zone, Trichy', timestamp: '16 Sep 2026 • 10:20 PM', icon: 'construct-outline' },
  { id: 'traffic', category: 'Heavy Traffic', type: 'Heavy Traffic', severity: 'MODERATE', level: '72 dB', location: 'Main Road, Trichy', timestamp: '16 Sep 2026 • 6:15 PM', icon: 'car-outline' },
  { id: 'siren', category: 'Siren', type: 'Siren', severity: 'LOW', level: '65 dB', location: 'Central Area, Trichy', timestamp: '16 Sep 2026 • 4:40 PM', icon: 'alert-circle-outline' },
];

const severityColors: Record<Severity, string> = { HIGH: colors.high, MODERATE: colors.moderate, LOW: colors.low };

export function ReportsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');
  const visibleReports = selectedFilter === 'All' ? reports : reports.filter((report) => report.severity === selectedFilter);

  function showReport(report: Report) {
    Alert.alert(report.category, `${report.type}\n${report.severity}\n${report.level} estimated\n${report.location}\n${report.timestamp}`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 20 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>ECHOMAP <Text style={styles.accent}>AI</Text></Text><Text style={styles.title}>My Reports</Text></View>
        <View style={styles.headerIcon}><Ionicons name="document-text-outline" size={21} color={colors.primary} /></View>
      </View>
      <Text style={styles.subtitle}>Your urban soundscape history</Text>

      <View style={styles.summaryCard}>
        <SummaryStat value="12" label="Total Reports" color={colors.primary} />
        <View style={styles.divider} /><SummaryStat value="3" label="High" color={colors.high} />
        <View style={styles.divider} /><SummaryStat value="6" label="Moderate" color={colors.moderate} />
        <View style={styles.divider} /><SummaryStat value="3" label="Low" color={colors.low} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map((filter) => <Pressable key={filter} onPress={() => setSelectedFilter(filter)} style={[styles.filterChip, selectedFilter === filter && styles.activeFilterChip]}><Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter === 'All' ? filter : filter[0] + filter.slice(1).toLowerCase()}</Text></Pressable>)}
      </ScrollView>

      <View style={styles.listHeader}><Text style={styles.sectionTitle}>Recent Reports</Text><Text style={styles.countLabel}>{visibleReports.length} SHOWN</Text></View>
      {visibleReports.map((report) => <ReportCard key={report.id} report={report} onPress={() => showReport(report)} />)}
    </ScrollView>
  );
}

function SummaryStat({ value, label, color }: { value: string; label: string; color: string }) {
  return <View style={styles.summaryStat}><Text style={[styles.summaryValue, { color }]}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function ReportCard({ report, onPress }: { report: Report; onPress: () => void }) {
  const severityColor = severityColors[report.severity];
  return (
    <Pressable onPress={onPress} style={styles.reportCard}>
      <View style={[styles.reportIcon, { backgroundColor: `${severityColor}20` }]}><Ionicons name={report.icon} size={25} color={severityColor} /></View>
      <View style={styles.reportCopy}>
        <Text style={styles.reportCategory}>{report.category}</Text>
        <Text style={styles.reportType}>{report.type}</Text>
        <View style={styles.reportMeta}><Text style={[styles.severityText, { color: severityColor }]}>{report.severity}</Text><Text style={styles.levelText}>{report.level} estimated</Text></View>
        <Text style={styles.locationText}>{report.location}</Text>
        <Text style={styles.timestamp}>{report.timestamp}</Text>
      </View>
      <Ionicons name="chevron-forward" size={19} color={colors.secondaryText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 23 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, eyebrow: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 }, accent: { color: colors.primary }, title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 }, subtitle: { color: colors.secondaryText, fontSize: 14, marginTop: 7 }, headerIcon: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 13, borderWidth: 1, height: 43, justifyContent: 'center', width: 43 },
  summaryCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 24, minHeight: 98, paddingHorizontal: 5 }, summaryStat: { alignItems: 'center', flex: 1 }, summaryValue: { fontSize: 23, fontWeight: '900' }, summaryLabel: { color: colors.secondaryText, fontSize: 9, marginTop: 5, textAlign: 'center' }, divider: { backgroundColor: colors.border, height: 35, width: 1 },
  filterRow: { gap: 8, paddingBottom: 25, paddingTop: 19 }, filterChip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 9 }, activeFilterChip: { backgroundColor: colors.primary, borderColor: colors.primary }, filterText: { color: colors.secondaryText, fontSize: 12, fontWeight: '700' }, activeFilterText: { color: colors.background }, listHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }, sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700' }, countLabel: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  reportCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', marginBottom: 11, padding: 14 }, reportIcon: { alignItems: 'center', borderRadius: 13, height: 50, justifyContent: 'center', width: 50 }, reportCopy: { flex: 1, marginLeft: 12 }, reportCategory: { color: colors.secondaryText, fontSize: 10, fontWeight: '700', letterSpacing: 0.3 }, reportType: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 3 }, reportMeta: { alignItems: 'center', flexDirection: 'row', marginTop: 6 }, severityText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6 }, levelText: { color: colors.secondaryText, fontSize: 11, marginLeft: 9 }, locationText: { color: colors.text, fontSize: 11, marginTop: 8 }, timestamp: { color: colors.secondaryText, fontSize: 10, marginTop: 4 },
});