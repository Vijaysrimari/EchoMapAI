import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { useState } from 'react';

import { AnalysisScreen } from '../screens/AnalysisScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RecordScreen } from '../screens/RecordScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { RootTabParamList, TabNavigator } from './TabNavigator';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<RootTabParamList>;
  Record: undefined;
  Analysis: undefined;
  Result: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Record" component={RecordScreen} />
          <Stack.Screen name="Analysis" component={AnalysisScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </>
      ) : (
        <Stack.Screen name="Login">
          {() => <LoginScreen onLogin={() => setIsAuthenticated(true)} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}