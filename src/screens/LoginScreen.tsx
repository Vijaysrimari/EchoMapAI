import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors } from '../theme';

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleLogin() {
    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setError('');
    onLogin();
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginCard}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <Ionicons name="pulse" size={30} color={colors.background} />
            </View>
            <View>
              <Text style={styles.brandName}>
                EchoMap <Text style={styles.brandAccent}>AI</Text>
              </Text>
              <Text style={styles.brandCaption}>URBAN SOUND INTELLIGENCE</Text>
            </View>
          </View>

          <View style={styles.heading}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue to your sound dashboard.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                placeholder="name@example.com"
                placeholderTextColor="#6f879a"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                accessibilityLabel="Email address"
              />
            </View>

            <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.secondaryText} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError('');
                }}
                placeholder="Enter your password"
                placeholderTextColor="#6f879a"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                accessibilityLabel="Password"
              />
              <Pressable
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((visible) => !visible)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.secondaryText}
                />
              </Pressable>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              onPress={handleLogin}
              style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
            >
              <Text style={styles.loginButtonText}>Sign in</Text>
              <Ionicons name="arrow-forward" size={19} color={colors.background} />
            </Pressable>
          </View>

          <Text style={styles.footerText}>
            Protected government and community monitoring portal
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 36,
  },
  loginCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 460,
    paddingHorizontal: 28,
    paddingVertical: 34,
    width: '100%',
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  brandIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    marginRight: 13,
    width: 54,
  },
  brandName: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  brandAccent: {
    color: colors.primary,
  },
  brandCaption: {
    color: colors.secondaryText,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 4,
  },
  heading: {
    marginTop: 38,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  form: {
    marginTop: 28,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  passwordLabel: {
    marginTop: 18,
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: '#091a2d',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    minHeight: 50,
    paddingHorizontal: 10,
  },
  eyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  error: {
    color: colors.high,
    fontSize: 12,
    marginTop: 12,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 54,
  },
  pressed: {
    opacity: 0.82,
  },
  loginButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  footerText: {
    color: '#6f879a',
    fontSize: 10,
    marginTop: 24,
    textAlign: 'center',
  },
});
