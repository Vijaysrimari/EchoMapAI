import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type Severity = 'high' | 'moderate' | 'low';
type Filter = 'All' | 'Traffic' | 'Construction' | 'Siren' | 'Crowd';
type IconName = keyof typeof Ionicons.glyphMap;

type SoundEvent = {
  id: string;
  type: string;
  category: Exclude<Filter, 'All'>;
  severity: Severity;
  level: string;
  time: string;
  location: string;
  icon: IconName;
  x: number;
  y: number;
};

const filters: Filter[] = ['All', 'Traffic', 'Construction', 'Siren', 'Crowd'];
const soundEvents: SoundEvent[] = [
  { id: 'jackhammer', type: 'Jackhammer', category: 'Construction', severity: 'high', level: '84 dB', time: '2 min ago', location: 'Construction Zone', icon: 'construct-outline', x: 29, y: 31 },
  { id: 'traffic', type: 'Heavy Traffic', category: 'Traffic', severity: 'moderate', level: '72 dB', time: '8 min ago', location: 'Cantonment Road', icon: 'car-outline', x: 68, y: 23 },
  { id: 'horn', type: 'Car Horn', category: 'Traffic', severity: 'low', level: '58 dB', time: '12 min ago', location: 'Thillai Nagar', icon: 'car-sport-outline', x: 79, y: 61 },
  { id: 'siren', type: 'Siren', category: 'Siren', severity: 'high', level: '88 dB', time: '18 min ago', location: 'Central Bus Stand', icon: 'alert-circle-outline', x: 49, y: 69 },
  { id: 'crowd', type: 'Crowd', category: 'Crowd', severity: 'moderate', level: '66 dB', time: '24 min ago', location: 'Rockfort Market', icon: 'people-outline', x: 22, y: 73 },
  { id: 'drilling', type: 'Drilling', category: 'Construction', severity: 'moderate', level: '76 dB', time: '31 min ago', location: 'Woraiyur', icon: 'build-outline', x: 59, y: 45 },
];

const severityColors: Record<Severity, string> = { high: colors.high, moderate: colors.moderate, low: colors.low };

export function SoundMapScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedFilter, setSelectedFilter] = useState<Filter>('All');
  const [selectedEvent, setSelectedEvent] = useState<SoundEvent>(soundEvents[0]);
  const visibleEvents = selectedFilter === 'All' ? soundEvents : soundEvents.filter((event) => event.category === selectedFilter);

  function selectFilter(filter: Filter) {
    setSelectedFilter(filter);
    const matchingEvent = filter === 'All' ? soundEvents[0] : soundEvents.find((event) => event.category === filter);
    if (matchingEvent) setSelectedEvent(matchingEvent);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 20 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>ECHOMAP <Text style={styles.accent}>AI</Text></Text><Text style={styles.title}>Sound Map</Text></View>
        <Pressable style={styles.layerButton} accessibilityLabel="Map layers"><Ionicons name="layers-outline" size={21} color={colors.text} /></Pressable>
      </View>
      <Text style={styles.subtitle}>Live acoustic activity around Trichy</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map((filter) => <Pressable key={filter} onPress={() => selectFilter(filter)} style={[styles.filterChip, selectedFilter === filter && styles.activeFilterChip]}><Text style={[styles.filterText, selectedFilter === filter && styles.activeFilterText]}>{filter}</Text></Pressable>)}
      </ScrollView>

      <View style={styles.mapFrame}>
        <View style={styles.mapSurface}>
          <View style={[styles.road, styles.roadOne]} /><View style={[styles.road, styles.roadTwo]} /><View style={[styles.road, styles.roadThree]} /><View style={[styles.road, styles.roadFour]} /><View style={[styles.road, styles.roadFive]} /><View style={[styles.road, styles.roadSix]} /><View style={styles.river} />
          <Text style={[styles.mapLabel, styles.labelCenter]}>TRICHY</Text><Text style={[styles.mapLabel, styles.labelNorth]}>WORAIYUR</Text><Text style={[styles.mapLabel, styles.labelEast]}>THILLAI NAGAR</Text><Text style={[styles.mapLabel, styles.labelSouth]}>ROCKFORT</Text>
          {visibleEvents.map((event) => <Pressable key={event.id} onPress={() => setSelectedEvent(event)} style={[styles.marker, { backgroundColor: severityColors[event.severity], left: `${event.x}%`, top: `${event.y}%` }, selectedEvent.id === event.id && styles.selectedMarker]} accessibilityLabel={`Select ${event.type}`}><Ionicons name={event.icon} size={15} color={colors.background} /></Pressable>)}
          <View style={styles.mapControls}><Pressable style={styles.mapControl}><Ionicons name="add" size={20} color={colors.text} /></Pressable><Pressable style={styles.mapControl}><Ionicons name="remove" size={20} color={colors.text} /></Pressable></View>
          <View style={styles.mapPin}><Ionicons name="locate" size={18} color={colors.primary} /></View>
        </View>
        <View style={styles.mapFooter}><Ionicons name="location" size={14} color={colors.primary} /><Text style={styles.mapFooterText}>Trichy, Tamil Nadu</Text><Text style={styles.eventCount}>{visibleEvents.length} EVENTS</Text></View>
      </View>

      <View style={styles.legendRow}><Text style={styles.legendTitle}>SEVERITY</Text><LegendDot color={colors.high} label="High" /><LegendDot color={colors.moderate} label="Moderate" /><LegendDot color={colors.low} label="Low" /></View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Selected Detection</Text><Ionicons name="radio" size={16} color={colors.primary} /></View>
      <View style={styles.eventCard}>
        <View style={[styles.eventIcon, { backgroundColor: `${severityColors[selectedEvent.severity]}22` }]}><Ionicons name={selectedEvent.icon} size={25} color={severityColors[selectedEvent.severity]} /></View>
        <View style={styles.eventCopy}><Text style={styles.eventType}>{selectedEvent.type}</Text><Text style={styles.eventMeta}>{selectedEvent.level} estimated <Text style={styles.dot}>•</Text> {selectedEvent.time}</Text><Text style={styles.eventLocation}>{selectedEvent.location}</Text></View>
        <View style={[styles.badge, { backgroundColor: `${severityColors[selectedEvent.severity]}20` }]}><Text style={[styles.badgeText, { color: severityColors[selectedEvent.severity] }]}>{selectedEvent.severity.toUpperCase()}</Text></View>
      </View>
    </ScrollView>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: color }]} /><Text style={styles.legendText}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 }, content: { paddingHorizontal: 20, paddingTop: 23 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, eyebrow: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 }, accent: { color: colors.primary }, title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 }, subtitle: { color: colors.secondaryText, fontSize: 14, marginTop: 7 }, layerButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 13, borderWidth: 1, height: 43, justifyContent: 'center', width: 43 },
  filterRow: { gap: 8, paddingBottom: 17, paddingTop: 20 }, filterChip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 9 }, activeFilterChip: { backgroundColor: colors.primary, borderColor: colors.primary }, filterText: { color: colors.secondaryText, fontSize: 12, fontWeight: '700' }, activeFilterText: { color: colors.background },
  mapFrame: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, overflow: 'hidden' }, mapSurface: { backgroundColor: '#10283a', height: 360, overflow: 'hidden', position: 'relative' }, road: { backgroundColor: '#1a3a4d', height: 2, position: 'absolute' }, roadOne: { left: '-15%', top: '35%', transform: [{ rotate: '-24deg' }], width: '135%' }, roadTwo: { left: '-15%', top: '61%', transform: [{ rotate: '17deg' }], width: '135%' }, roadThree: { left: '20%', top: '-15%', transform: [{ rotate: '74deg' }], width: '130%' }, roadFour: { left: '62%', top: '-15%', transform: [{ rotate: '102deg' }], width: '130%' }, roadFive: { left: '-10%', top: '76%', transform: [{ rotate: '-58deg' }], width: '125%' }, roadSix: { left: '-5%', top: '49%', transform: [{ rotate: '88deg' }], width: '120%' }, river: { backgroundColor: '#0b3448', height: 75, left: '-10%', opacity: 0.9, position: 'absolute', top: 109, transform: [{ rotate: '-11deg' }], width: '125%' },
  mapLabel: { color: '#507082', fontSize: 9, fontWeight: '800', letterSpacing: 1 }, labelCenter: { left: '43%', position: 'absolute', top: '50%' }, labelNorth: { left: '18%', position: 'absolute', top: '17%' }, labelEast: { position: 'absolute', right: '6%', top: '39%' }, labelSouth: { bottom: '13%', left: '43%', position: 'absolute' }, marker: { alignItems: 'center', borderColor: '#b8eaff', borderRadius: 17, borderWidth: 2, height: 34, justifyContent: 'center', marginLeft: -17, marginTop: -17, position: 'absolute', width: 34 }, selectedMarker: { borderColor: colors.text, borderWidth: 3, transform: [{ scale: 1.18 }] }, mapControls: { position: 'absolute', right: 12, top: 12 }, mapControl: { alignItems: 'center', backgroundColor: '#173447', borderColor: '#2a5369', borderWidth: 1, height: 34, justifyContent: 'center', width: 34 }, mapPin: { alignItems: 'center', backgroundColor: '#173447', borderRadius: 18, bottom: 12, height: 36, justifyContent: 'center', left: 12, position: 'absolute', width: 36 }, mapFooter: { alignItems: 'center', flexDirection: 'row', paddingHorizontal: 13, paddingVertical: 11 }, mapFooterText: { color: colors.secondaryText, fontSize: 11, marginLeft: 5 }, eventCount: { color: colors.primary, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginLeft: 'auto' },
  legendRow: { alignItems: 'center', flexDirection: 'row', gap: 13, paddingVertical: 18 }, legendTitle: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1, marginRight: 'auto' }, legendItem: { alignItems: 'center', flexDirection: 'row' }, legendDot: { borderRadius: 5, height: 9, marginRight: 5, width: 9 }, legendText: { color: colors.secondaryText, fontSize: 10 }, sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11 }, sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700' }, eventCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', padding: 14 }, eventIcon: { alignItems: 'center', borderRadius: 12, height: 47, justifyContent: 'center', width: 47 }, eventCopy: { flex: 1, marginLeft: 12 }, eventType: { color: colors.text, fontSize: 15, fontWeight: '800' }, eventMeta: { color: colors.secondaryText, fontSize: 11, marginTop: 5 }, eventLocation: { color: colors.secondaryText, fontSize: 11, marginTop: 4 }, dot: { color: colors.border }, badge: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 6 }, badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
});