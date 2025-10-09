import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  const theme = useTheme();
  const tint = theme.dark ? 'dark' : 'light';

  return (
    <BlurView
      // Adapts to the app's theme preference (light/dark/system)
      tint={tint}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
