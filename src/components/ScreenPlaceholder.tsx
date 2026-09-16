import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type ScreenPlaceholderProps = {
  title: string;
};

export function ScreenPlaceholder({ title }: ScreenPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.placeholder}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  placeholder: {
    marginTop: 8,
    color: colors.secondaryText,
    fontSize: 16,
  },
});