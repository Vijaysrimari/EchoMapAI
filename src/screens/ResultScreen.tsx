import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation }: ResultScreenProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="sparkles" size={21} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.eyebrow}>ECHOMAP <Text style={styles.accent}>AI</Text></Text>
          <Text style={styles.title}>AI Analysis Result</Text>
        </View>
      </View>

      <View style={styles.detectionCard}>
        <View style={styles.detectionIcon}>
          <Ionicons name="construct-outline" size={34} color={colors.high} />
        </View>
        <View style={styles.detectionCopy}>
          <Text style={styles.detectionLabel}>DETECTED ACOUSTIC EVENT</Text>
          <Text style={styles.detectionName}>JACKHAMMER</Text>
        </View>
        <View style={styles.statusIcon}>
          <Ionicons name="checkmark" size={16} color={colors.low} />
        </View>
      </View>

      <View style={styles.confidenceSection}>
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>AI Confidence</Text>
          <Text style={styles.confidenceValue}>94%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <Text style={styles.helperText}>High confidence prediction</Text>
      </View>

      <View style={styles.metricsCard}>
        <View style={styles.metricRow}>
          <View style={styles.metricIcon}><Ionicons name="volume-high-outline" size={20} color={colors.primary} /></View>
          <View style={styles.metricCopy}>
            <Text style={styles.metricLabel}>Estimated Sound Level</Text>
            <Text style={styles.metricValue}>84 dB</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.metricRow}>
          <View style={[styles.metricIcon, styles.severityIcon]}><Ionicons name="warning-outline" size={20} color={colors.high} /></View>
          <View style={styles.metricCopy}>
            <Text style={styles.metricLabel}>Severity</Text>
            <View style={styles.severityBadge}><View style={styles.severityDot} /><Text style={styles.severityText}>HIGH</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          <Text style={styles.detailText}>Construction Zone, Trichy</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color={colors.primary} />
          <Text style={styles.detailText}>16 Sep 2026 <Text style={styles.detailDivider}>•</Text> 10:20 PM</Text>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Detection Summary</Text>
        <Text style={styles.summaryText}>EchoMap AI detected a construction-related acoustic event from the recorded audio.</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Sound Map' })}>
          <Ionicons name="map-outline" size={19} color={colors.background} />
          <Text style={styles.primaryButtonText}>View on Sound Map</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Ionicons name="bookmark-outline" size={19} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Save Report</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 22, paddingBottom: 36 },
  header: { alignItems: 'center', flexDirection: 'row', marginBottom: 26 },
  headerIcon: {
    alignItems: 'center', backgroundColor: '#103452', borderColor: '#1d6086', borderRadius: 13,
    borderWidth: 1, height: 44, justifyContent: 'center', marginRight: 12, width: 44,
  },
  eyebrow: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  accent: { color: colors.primary },
  title: { color: colors.text, fontSize: 23, fontWeight: '800', marginTop: 4 },
  detectionCard: {
    alignItems: 'center', backgroundColor: colors.surface, borderColor: '#28516d', borderRadius: 19,
    borderWidth: 1, flexDirection: 'row', padding: 18,
  },
  detectionIcon: {
    alignItems: 'center', backgroundColor: '#392c2c', borderRadius: 16, height: 62, justifyContent: 'center', width: 62,
  },
  detectionCopy: { flex: 1, marginLeft: 15 },
  detectionLabel: { color: colors.secondaryText, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  detectionName: { color: colors.text, fontSize: 23, fontWeight: '900', letterSpacing: 0.5, marginTop: 7 },
  statusIcon: { alignItems: 'center', backgroundColor: '#183b3d', borderRadius: 12, height: 28, justifyContent: 'center', width: 28 },
  confidenceSection: { marginTop: 27 },
  sectionHeadingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  confidenceValue: { color: colors.primary, fontSize: 25, fontWeight: '900' },
  progressTrack: { backgroundColor: '#17314a', borderRadius: 5, height: 9, marginTop: 13, overflow: 'hidden' },
  progressFill: { backgroundColor: colors.primary, borderRadius: 5, height: '100%', width: '94%' },
  helperText: { color: colors.secondaryText, fontSize: 11, marginTop: 7 },
  metricsCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, marginTop: 24, paddingHorizontal: 16,
  },
  metricRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 15 },
  metricIcon: { alignItems: 'center', backgroundColor: '#123651', borderRadius: 11, height: 42, justifyContent: 'center', width: 42 },
  severityIcon: { backgroundColor: '#392c2c' },
  metricCopy: { marginLeft: 13 },
  metricLabel: { color: colors.secondaryText, fontSize: 12 },
  metricValue: { color: colors.text, fontSize: 22, fontWeight: '800', marginTop: 3 },
  divider: { backgroundColor: colors.border, height: 1 },
  severityBadge: { alignItems: 'center', backgroundColor: '#38272d', borderRadius: 7, flexDirection: 'row', marginTop: 5, paddingHorizontal: 9, paddingVertical: 5 },
  severityDot: { backgroundColor: colors.high, borderRadius: 4, height: 7, marginRight: 6, width: 7 },
  severityText: { color: colors.high, fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },
  detailsCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, marginTop: 14, padding: 16 },
  detailRow: { alignItems: 'center', flexDirection: 'row', minHeight: 31 },
  detailRowLast: { marginTop: 8 },
  detailText: { color: colors.text, fontSize: 13, marginLeft: 12 },
  detailDivider: { color: colors.secondaryText },
  summarySection: { marginTop: 26 },
  summaryText: { color: colors.secondaryText, fontSize: 13, lineHeight: 21, marginTop: 9 },
  actions: { gap: 10, marginTop: 25 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', minHeight: 54 },
  primaryButtonText: { color: colors.background, fontSize: 14, fontWeight: '800', marginLeft: 8 },
  secondaryButton: { alignItems: 'center', borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 54 },
  secondaryButtonText: { color: colors.primary, fontSize: 14, fontWeight: '800', marginLeft: 8 },
});