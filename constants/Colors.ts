/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#ff8787';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    grayText: '#333',
    background: '#fff',
    grayBackground: '#F5F5F5',
    grayBorder: '#EBEBEB',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    grayText: '#9BA1A6',
    background: '#151718',
    grayBackground: '#313131',
    grayBorder: '#292929',    
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
