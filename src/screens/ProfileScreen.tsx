import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '../theme';

type IconName = keyof typeof Ionicons.glyphMap;
type SettingKey = 'Notifications' | 'Location Services' | 'Privacy';

export function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [activeSetting, setActiveSetting] = useState<SettingKey | null>(null);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ECHOMAP <Text style={styles.accent}>AI</Text></Text>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.headerIcon}><Ionicons name="person-outline" size={21} color={colors.primary} /></View>
      </View>
      <Text style={styles.subtitle}>Your EchoMap contribution</Text>

      <View style={styles.profileCard}>
        <View style={styles.profileIcon}><Ionicons name="headset-outline" size={31} color={colors.primary} /></View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileTitle}>Citizen Contributor</Text>
          <Text style={styles.profileDescription}>Helping build a smarter urban soundscape</Text>
        </View>
        <View style={styles.verifiedIcon}><Ionicons name="checkmark" size={15} color={colors.low} /></View>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Contribution Statistics</Text><Ionicons name="stats-chart-outline" size={17} color={colors.primary} /></View>
      <View style={styles.statsCard}>
        <Stat value="12" label="Reports Submitted" color={colors.primary} />
        <View style={styles.divider} />
        <Stat value="3" label="High-Severity Events" color={colors.high} />
        <View style={styles.divider} />
        <Stat value="5" label="Areas Contributed" color={colors.low} />
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Settings</Text><Ionicons name="options-outline" size={17} color={colors.primary} /></View>
      <View style={styles.settingsCard}>
        <SettingRow icon="notifications-outline" label="Notifications" onPress={() => setActiveSetting('Notifications')} />
        <View style={styles.rowDivider} />
        <SettingRow icon="location-outline" label="Location Services" onPress={() => setActiveSetting('Location Services')} />
        <View style={styles.rowDivider} />
        <SettingRow icon="lock-closed-outline" label="Privacy" onPress={() => setActiveSetting('Privacy')} />
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>About</Text><Ionicons name="information-circle-outline" size={17} color={colors.primary} /></View>
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>About EchoMap AI</Text>
        <Text style={styles.aboutText}>AI-assisted urban soundscape mapping platform for understanding and visualizing city sound activity.</Text>
        <View style={styles.versionRow}><Text style={styles.versionLabel}>Version</Text><Text style={styles.versionValue}>1.0.0</Text></View>
      </View>

      <Modal visible={activeSetting !== null} transparent animationType="slide" onRequestClose={() => setActiveSetting(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activeSetting}</Text>
              <Pressable accessibilityLabel="Close settings" onPress={() => setActiveSetting(null)} style={styles.closeButton}>
                <Ionicons name="close" size={21} color={colors.text} />
              </Pressable>
            </View>
            {activeSetting === 'Notifications' && (
              <SettingToggle label="Sound Detection Alerts" description="Receive alerts about detected sound activity." value={soundAlerts} onValueChange={setSoundAlerts} />
            )}
            {activeSetting === 'Location Services' && (
              <>
                <Text style={styles.modalDescription}>Location access is used to associate sound reports with geographic areas.</Text>
                <SettingToggle label="Location Access" value={locationAccess} onValueChange={setLocationAccess} />
              </>
            )}
            {activeSetting === 'Privacy' && (
              <>
                <Text style={styles.modalDescription}>Your recorded sound data is used to generate urban soundscape reports.</Text>
                <SettingToggle label="Data Sharing" value={dataSharing} onValueChange={setDataSharing} />
                <Text style={styles.privacyNote}>You control whether anonymous report data may be shared for community insights.</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return <View style={styles.stat}><Text style={[styles.statValue, { color }]}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function SettingRow({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.settingRow}>
      <View style={styles.settingIcon}><Ionicons name={icon} size={20} color={colors.primary} /></View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={19} color={colors.secondaryText} />
    </Pressable>
  );
}

function SettingToggle({ label, description, value, onValueChange }: { label: string; description?: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleBlock}>
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: '#257ba2' }} thumbColor={value ? colors.primary : colors.secondaryText} />
      </View>
      {description && <Text style={styles.modalDescription}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 23 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: colors.secondaryText, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  accent: { color: colors.primary },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  subtitle: { color: colors.secondaryText, fontSize: 14, marginTop: 7 },
  headerIcon: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 13, borderWidth: 1, height: 43, justifyContent: 'center', width: 43 },
  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: '#28516d', borderRadius: 19, borderWidth: 1, flexDirection: 'row', marginTop: 25, padding: 17 },
  profileIcon: { alignItems: 'center', backgroundColor: '#123d5b', borderRadius: 17, height: 62, justifyContent: 'center', width: 62 },
  profileCopy: { flex: 1, marginLeft: 14 },
  profileTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  profileDescription: { color: colors.secondaryText, fontSize: 12, lineHeight: 18, marginTop: 5 },
  verifiedIcon: { alignItems: 'center', backgroundColor: '#183b3d', borderRadius: 12, height: 27, justifyContent: 'center', width: 27 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11, marginTop: 28 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  statsCard: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-around', minHeight: 105, paddingHorizontal: 6 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 24, fontWeight: '900' },
  statLabel: { color: colors.secondaryText, fontSize: 9, lineHeight: 13, marginTop: 5, textAlign: 'center' },
  divider: { backgroundColor: colors.border, height: 38, width: 1 },
  settingsCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, paddingHorizontal: 15 },
  settingRow: { alignItems: 'center', flexDirection: 'row', minHeight: 59 },
  settingIcon: { alignItems: 'center', backgroundColor: '#123651', borderRadius: 10, height: 37, justifyContent: 'center', width: 37 },
  settingLabel: { color: colors.text, flex: 1, fontSize: 14, fontWeight: '600', marginLeft: 12 },
  rowDivider: { backgroundColor: colors.border, height: 1 },
  aboutCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1, padding: 16 },
  aboutTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  aboutText: { color: colors.secondaryText, fontSize: 13, lineHeight: 21, marginTop: 9 },
  versionRow: { borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 17, paddingTop: 13 },
  versionLabel: { color: colors.secondaryText, fontSize: 12 },
  versionValue: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  modalBackdrop: { backgroundColor: 'rgba(2, 9, 18, 0.72)', flex: 1, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.surface, borderColor: colors.border, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 22, paddingBottom: 30 },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  closeButton: { alignItems: 'center', backgroundColor: '#173447', borderRadius: 12, height: 38, justifyContent: 'center', width: 38 },
  modalDescription: { color: colors.secondaryText, fontSize: 13, lineHeight: 20 },
  toggleBlock: { marginTop: 3 },
  toggleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 48 },
  toggleLabel: { color: colors.text, flex: 1, fontSize: 15, fontWeight: '700' },
  privacyNote: { color: '#58738a', fontSize: 11, lineHeight: 17, marginTop: 22 },
});