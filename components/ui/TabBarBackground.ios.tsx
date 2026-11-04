import { useBottomTabBarHeight } from 'expo-router/tabs';
import { useTheme } from 'expo-router';
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
