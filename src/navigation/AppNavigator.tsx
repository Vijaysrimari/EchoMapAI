import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';

import { AnalysisScreen } from '../screens/AnalysisScreen';
import { RecordScreen } from '../screens/RecordScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { RootTabParamList, TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  Record: undefined;
  Analysis: undefined;
  Result: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Record" component={RecordScreen} />
      <Stack.Screen name="Analysis" component={AnalysisScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}