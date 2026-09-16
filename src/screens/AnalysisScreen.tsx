import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type AnalysisScreenProps = NativeStackScreenProps<RootStackParamList, 'Analysis'>;

export function AnalysisScreen({ navigation }: AnalysisScreenProps) {
  const [activeStep, setActiveStep] = useState(1);
  const pulse = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]));
    const progressAnimation = Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });

    const stepTwoTimer = setTimeout(() => setActiveStep(2), 1000);
    const stepThreeTimer = setTimeout(() => setActiveStep(3), 2000);

    pulseAnimation.start();
    progressAnimation.start(({ finished }) => {
      if (finished) navigation.replace('Result');
    });

    return () => {
      pulseAnimation.stop();
      progressAnimation.stop();
      clearTimeout(stepTwoTimer);
      clearTimeout(stepThreeTimer);
    };
  }, [navigation, progress, pulse]);

  return (
    <View style={styles.screen}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}><Ionicons name="pulse" size={20} color={colors.primary} /></View>
        <Text style={styles.brandName}>EchoMap <Text style={styles.brandAccent}>AI</Text></Text>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.soundOrb, { transform: [{ scale: pulse }] }]}>
          <View style={styles.orbInner}>
            <View style={styles.waveform}>
              {[22, 42, 30, 56, 36, 48, 26, 62, 38, 50, 29, 44, 24].map((height, index) => (
                <View key={`analysis-wave-bar-${index}`} style={[styles.waveBar, { height }]} />
              ))}
            </View>
          </View>
        </Animated.View>
        <Text style={styles.title}>Analyzing Sound...</Text>
        <Text style={styles.subtitle}>EchoMap AI is identifying the acoustic event</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['8%', '100%'] }) }]} />
        </View>
        <Text style={styles.progressLabel}>PROCESSING AUDIO SIGNAL</Text>
        <View style={styles.stepsCard}>
          <ProcessingStep icon="checkmark-circle" label="Audio Captured" state="complete" />
          <ProcessingStep icon={activeStep === 2 ? 'sync-circle-outline' : activeStep > 2 ? 'checkmark-circle' : 'ellipse-outline'} label="Generating Mel Spectrogram" state={activeStep === 2 ? 'active' : activeStep > 2 ? 'complete' : 'pending'} />
          <ProcessingStep icon={activeStep === 3 ? 'sync-circle-outline' : 'ellipse-outline'} label="Running CNN Classification" state={activeStep === 3 ? 'active' : 'pending'} />
        </View>
      </View>
      <Text style={styles.footer}>SIMULATED ANALYSIS · RESULTS IN A MOMENT</Text>
    </View>
  );
}

type ProcessingStepProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  state: 'complete' | 'active' | 'pending';
};

function ProcessingStep({ icon, label, state }: ProcessingStepProps) {
  const color = state === 'complete' ? colors.low : state === 'active' ? colors.primary : colors.secondaryText;
  return (
    <View style={styles.step}>
      <Ionicons name={icon} size={21} color={color} />
      <Text style={[styles.stepLabel, state === 'active' && styles.activeStepLabel, state === 'pending' && styles.pendingStepLabel]}>{label}</Text>
      {state === 'active' && <View style={styles.activeIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  brandRow: { alignItems: 'center', flexDirection: 'row' },
  brandMark: {
    alignItems: 'center', backgroundColor: '#103452', borderColor: '#1d6086', borderRadius: 11,
    borderWidth: 1, height: 36, justifyContent: 'center', width: 36,
  },
  brandName: { color: colors.text, fontSize: 16, fontWeight: '800', marginLeft: 10 },
  brandAccent: { color: colors.primary },
  content: { alignItems: 'center', flex: 1, justifyContent: 'center', width: '100%' },
  soundOrb: {
    alignItems: 'center', backgroundColor: '#0c2b45', borderColor: '#1f729b', borderRadius: 112,
    borderWidth: 1, height: 224, justifyContent: 'center', width: 224,
  },
  orbInner: {
    alignItems: 'center', backgroundColor: '#123d5b', borderRadius: 82, height: 164, justifyContent: 'center', width: 164,
  },
  waveform: { alignItems: 'center', flexDirection: 'row', gap: 4, height: 68 },
  waveBar: { backgroundColor: colors.primary, borderRadius: 3, width: 4 },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '800',
    marginTop: 30,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 9,
    textAlign: 'center',
  },
  progressTrack: {
    backgroundColor: '#17314a', borderRadius: 4, height: 6, marginTop: 28, overflow: 'hidden', width: '100%',
  },
  progressFill: { backgroundColor: colors.primary, borderRadius: 4, height: '100%' },
  progressLabel: {
    color: colors.secondaryText, fontSize: 9, fontWeight: '700', letterSpacing: 1.2, marginTop: 10,
  },
  stepsCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 17, borderWidth: 1,
    marginTop: 28, paddingHorizontal: 16, paddingVertical: 7, width: '100%',
  },
  step: { alignItems: 'center', flexDirection: 'row', minHeight: 48 },
  stepLabel: { color: colors.text, fontSize: 14, marginLeft: 12 },
  activeStepLabel: { color: colors.primary, fontWeight: '700' },
  pendingStepLabel: { color: colors.secondaryText },
  activeIndicator: { backgroundColor: colors.primary, borderRadius: 3, height: 6, marginLeft: 'auto', width: 6 },
  footer: {
    color: '#58738a', fontSize: 9, letterSpacing: 1.1, marginBottom: 15, textAlign: 'center',
  },
});