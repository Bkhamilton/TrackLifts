import anatomy from '@/assets/images/Muscles/anatomy/anatomy.json';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

type BodyDiagramProps = {
    view: 'front' | 'back';
    muscleData: { id: string; value: number }[];
    selectedMuscle: string | null;
    getColor: (value: number) => string;
};

/** Paired anatomical regions stay aligned in a shared 200 × 430 coordinate space. */
export default function BodyDiagram({ view, muscleData, selectedMuscle, getColor }: BodyDiagramProps) {
    const dark = useColorScheme() === 'dark';
    const data = anatomy.views[view];
    const outline = dark ? '#9aaab4' : '#74828b';
    const detail = dark ? '#d0dce2' : '#52636e';
    const groups = Object.entries(data.groups) as [string, string[]][];

    const label = `${view === 'front' ? 'Front' : 'Back'} recent muscle load diagram${selectedMuscle ? `, ${selectedMuscle} selected` : ''}. Use the muscle group buttons for details.`;

    return (
        <Svg
            width="100%"
            height={400}
            viewBox={anatomy.viewBox}
            preserveAspectRatio="xMidYMid meet"
            {...(Platform.OS === 'web'
                ? { role: 'img' as const, 'aria-label': label }
                : { accessible: true, accessibilityRole: 'image' as const, accessibilityLabel: label })}
        >
            {['', 'translate(200 0) scale(-1 1)'].map((transform, side) => (
                <G key={side} transform={transform || undefined}>
                    <Path d={`${anatomy.outline} Z`} fill={dark ? '#303e47' : '#e8ecee'} />
                    <Path d={anatomy.outline} fill="none" stroke={outline} strokeWidth={1.1} />
                    {groups.map(([group, paths]) => (
                        <G key={group}
                            fill={getColor(muscleData.find(m => m.id === group)?.value ?? NaN)}
                            stroke={selectedMuscle === group ? '#4a86e8' : outline}
                            strokeWidth={selectedMuscle === group ? 2 : 0.8}
                            strokeLinejoin="round"
                        >
                            {paths.map((d, index) => <Path key={index} d={d} />)}
                        </G>
                    ))}
                    <Path d={data.details} fill="none" stroke={detail} strokeWidth={0.7}
                        strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
                </G>
            ))}
            <Path d={data.centerDetails} fill="none" stroke={detail} strokeWidth={0.7}
                strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
        </Svg>
    );
}
