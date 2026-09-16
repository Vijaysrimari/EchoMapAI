import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type IconName = keyof typeof Ionicons.glyphMap;

type FeatureCardProps = {
  icon: IconName;
  title: string;
  description: string;
  large?: boolean;
  onPress?: () => void;
};

type StatProps = {
  value: string;
  label: string;
  tone: string;
};

function FeatureCard({ icon, title, description, large = false, onPress }: FeatureCardProps) {
  return (
    <Pressable onPress={onPress} style={[styles.featureCard, large && styles.recordingCard]}>
      <View style={[styles.featureIcon, large && styles.recordingIcon]}>
        <Ionicons name={icon} size={large ? 28 : 21} color={large ? colors.background : colors.primary} />
      </View>
      <View style={styles.featureCopy}>
        <Text style={[styles.featureTitle, large && styles.recordingTitle]}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={large ? '#9edfff' : colors.secondaryText} />
    </Pressable>
  );
}

function Stat({ value, label, tone }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: tone }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.logoMark}>
          <Ionicons name="pulse" size={24} color={colors.primary} />
        </View>
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>EchoMap <Text style={styles.brandAccent}>AI</Text></Text>
          <Text style={styles.brandCaption}>URBAN SOUND INTELLIGENCE</Text>
        </View>
        <View style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={21} color={colors.text} />
          <View style={styles.notificationDot} />
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>Good Evening</Text>
        <Text style={styles.subtitle}>Explore your urban soundscape</Text>
      </View>

      <View style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.eyebrow}>CURRENT LOCATION</Text>
          <Text style={styles.locationName}>Trichy</Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={colors.secondaryText} style={styles.trailingIcon} />
      </View>

      <FeatureCard
        icon="mic"
        title="Record a Sound"
        description="Help map the sounds around your city"
        large
        onPress={() => navigation.navigate('Record')}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore EchoMap</Text>
        <Ionicons name="sparkles-outline" size={17} color={colors.primary} />
      </View>
      <View style={styles.featureRow}>
        <FeatureCard icon="map" title="Sound Map" description="Explore nearby sound activity" />
        <FeatureCard icon="bar-chart" title="My Reports" description="View your previous recordings" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <Text style={styles.todayLabel}>TODAY</Text>
      </View>
      <View style={styles.activityCard}>
        <Stat value="12" label="Sound Reports" tone={colors.primary} />
        <View style={styles.statDivider} />
        <Stat value="3" label="High Severity" tone={colors.high} />
        <View style={styles.statDivider} />
        <Stat value="6" label="Moderate" tone={colors.moderate} />
        <View style={styles.statDivider} />
        <Stat value="3" label="Low" tone={colors.low} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Detection</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.secondaryText} />
      </View>
      <View style={styles.detectionCard}>
        <View style={styles.detectionIcon}>
          <Ionicons name="construct-outline" size={23} color={colors.high} />
        </View>
        <View style={styles.detectionCopy}>
          <Text style={styles.detectionTitle}>Construction</Text>
          <Text style={styles.detectionMeta}>84 dB estimated <Text style={styles.metaDot}>  ·  </Text> 2 min ago</Text>
        </View>
        <View style={styles.severityBadge}>
          <View style={styles.severityDot} />
          <Text style={styles.severityText}>HIGH</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: '#103452',
    borderColor: '#1d6086',
    borderRadius: 15,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  brandCopy: {
    flex: 1,
    marginLeft: 11,
  },
  brandName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  brandAccent: {
    color: colors.primary,
  },
  brandCaption: {
    color: colors.secondaryText,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 3,
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  notificationDot: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    position: 'absolute',
    right: 8,
    top: 7,
    width: 8,
  },
  greetingBlock: {
    marginBottom: 22,
    marginTop: 28,
  },
  greeting: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 15,
    marginTop: 7,
  },
  locationCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
  },
  locationIcon: {
    alignItems: 'center',
    backgroundColor: '#123651',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  eyebrow: {
    color: colors.secondaryText,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  locationName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  trailingIcon: {
    marginLeft: 'auto',
  },
  featureCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 112,
    padding: 14,
  },
  recordingCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    marginBottom: 28,
    minHeight: 118,
    padding: 18,
  },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: '#123651',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 11,
    width: 42,
  },
  recordingIcon: {
    backgroundColor: '#b8eaff',
    borderRadius: 16,
    height: 54,
    width: 54,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  recordingTitle: {
    color: colors.background,
    fontSize: 17,
  },
  featureDescription: {
    color: colors.secondaryText,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  todayLabel: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  activityCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 28,
    minHeight: 94,
    paddingHorizontal: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.secondaryText,
    fontSize: 9,
    marginTop: 5,
    textAlign: 'center',
  },
  statDivider: {
    backgroundColor: colors.border,
    height: 32,
    width: 1,
  },
  detectionCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 15,
  },
  detectionIcon: {
    alignItems: 'center',
    backgroundColor: '#392c2c',
    borderRadius: 12,
    height: 45,
    justifyContent: 'center',
    marginRight: 12,
    width: 45,
  },
  detectionCopy: {
    flex: 1,
  },
  detectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  detectionMeta: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 5,
  },
  metaDot: {
    color: colors.border,
  },
  severityBadge: {
    alignItems: 'center',
    backgroundColor: '#38272d',
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  severityDot: {
    backgroundColor: colors.high,
    borderRadius: 3,
    height: 6,
    marginRight: 5,
    width: 6,
  },
  severityText: {
    color: colors.high,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});