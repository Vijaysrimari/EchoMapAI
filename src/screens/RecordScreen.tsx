import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type RecordScreenProps = NativeStackScreenProps<RootStackParamList, 'Record'>;

const waveformHeights = [24, 42, 31, 56, 38, 68, 43, 29, 50, 35, 60, 30, 45, 24];

export function RecordScreen({ navigation }: RecordScreenProps) {
  const [isListening, setIsListening] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const waveProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isListening) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isListening]);

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ).start();
      Animated.loop(
        Animated.timing(waveProgress, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true }),
      ).start();
    } else {
      pulse.stopAnimation();
      waveProgress.stopAnimation();
      pulse.setValue(1);
      waveProgress.setValue(0);
    }
  }, [isListening, pulse, waveProgress]);

  const formattedTime = `00:${String(elapsedSeconds).padStart(2, '0')}`;

  function toggleRecording() {
    if (isListening) {
      setIsListening(false);
      navigation.navigate('Analysis');
      return;
    }

    setElapsedSeconds(0);
    setIsListening(true);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerEyebrow}>ECHOMAP <Text style={styles.headerAccent}>AI</Text></Text>
          <Text style={styles.headerTitle}>Record Sound</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.subtitle}>Capture a short audio sample for AI analysis</Text>

      <View style={styles.recorderArea}>
        <Animated.View style={[styles.outerRing, isListening && styles.activeOuterRing, { transform: [{ scale: pulse }] }]}>
          <View style={[styles.middleRing, isListening && styles.activeMiddleRing]}>
            <Pressable accessibilityLabel={isListening ? 'Stop recording' : 'Start recording'} onPress={toggleRecording} style={styles.microphoneButton}>
              <Ionicons name={isListening ? 'stop' : 'mic'} size={42} color={isListening ? colors.high : colors.background} />
            </Pressable>
          </View>
        </Animated.View>
        <Text style={styles.recordingState}>{isListening ? 'Listening...' : 'Ready to listen'}</Text>
        <Text style={styles.recordingHint}>{isListening ? formattedTime : 'Tap the button to start'}</Text>
        {isListening && (
          <View style={styles.waveform}>
            {waveformHeights.map((height, index) => (
              <Animated.View
                key={`wave-bar-${index}`}
                style={[
                  styles.waveBar,
                  { height, opacity: waveProgress.interpolate({ inputRange: [0, 0.5, 1], outputRange: index % 2 ? [0.45, 1, 0.45] : [1, 0.45, 1] }) },
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <Pressable onPress={toggleRecording} style={[styles.actionButton, isListening && styles.stopButton]}>
        <Ionicons name={isListening ? 'stop-circle-outline' : 'mic-outline'} size={20} color={isListening ? colors.high : colors.background} />
        <Text style={[styles.actionLabel, isListening && styles.stopLabel]}>{isListening ? 'Stop Recording' : 'Start Recording'}</Text>
      </Pressable>

      <View style={styles.locationCard}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.locationTitle}>Location</Text>
          <Text style={styles.locationSubtitle}>Location will be attached automatically</Text>
        </View>
      </View>
      <Text style={styles.mockNote}>Simulation mode · No audio is recorded</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 13,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 14,
  },
  headerEyebrow: {
    color: colors.secondaryText,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  headerAccent: {
    color: colors.primary,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  headerSpacer: {
    width: 44,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 24,
    maxWidth: 280,
  },
  recorderArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 340,
  },
  outerRing: {
    alignItems: 'center',
    backgroundColor: '#0c2b45',
    borderColor: '#1b5f82',
    borderRadius: 126,
    borderWidth: 1,
    height: 252,
    justifyContent: 'center',
    width: 252,
  },
  activeOuterRing: {
    backgroundColor: '#102c40',
    borderColor: '#e85d70',
  },
  middleRing: {
    alignItems: 'center',
    backgroundColor: '#123d5b',
    borderColor: '#287ca6',
    borderRadius: 99,
    borderWidth: 1,
    height: 198,
    justifyContent: 'center',
    width: 198,
  },
  activeMiddleRing: {
    backgroundColor: '#3b2932',
    borderColor: '#d85c70',
  },
  microphoneButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 68,
    elevation: 5,
    height: 136,
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    width: 136,
  },
  recordingState: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 25,
  },
  recordingHint: {
    color: colors.secondaryText,
    fontSize: 14,
    marginTop: 7,
  },
  waveform: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    height: 70,
    marginTop: 12,
  },
  waveBar: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: 4,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 22,
  },
  stopButton: {
    backgroundColor: '#402832',
    borderColor: '#74404d',
    borderWidth: 1,
  },
  actionLabel: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 9,
  },
  stopLabel: {
    color: colors.high,
  },
  locationCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 16,
    padding: 14,
  },
  locationIcon: {
    alignItems: 'center',
    backgroundColor: '#123651',
    borderRadius: 11,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  locationTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  locationSubtitle: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 4,
  },
  mockNote: {
    color: '#58738a',
    fontSize: 10,
    marginBottom: 14,
    marginTop: 14,
    textAlign: 'center',
  },
});