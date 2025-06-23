/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { UserContext } from '@/contexts/UserContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useContext } from 'react';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const { appearancePreference } = useContext(UserContext);
    const systemColorScheme = useColorScheme() ?? 'light';
    const theme = appearancePreference === 'system' ? systemColorScheme : appearancePreference;
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}