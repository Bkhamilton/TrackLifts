import { useThemeColor } from '@/hooks/useThemeColor';
import { Circle, useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from "react-native-reanimated";
import { Bar, CartesianChart, useChartPressState } from 'victory-native';

interface MonthlyFrequencyChartProps {
    data: { workout_date: string; session_count: number }[];
}

export default function MonthlyWorkoutFrequency({ data }: MonthlyFrequencyChartProps) {
    // Hardcoded weekly workout data

    const SpaceMono = require('../../../assets/fonts/SpaceMono-Regular.ttf');

    const font = useFont(SpaceMono, 12);

    const text = useThemeColor({}, 'text');

    const formatXLabel = (value: string) => {
        // Format Date to MM/DD, display one day per week
        const date = new Date(value);
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        // Show label only for the first day of each week
        if (day % 7 !== 7) {
            return `${month}/${day}`;
        }
        return "";
    };

    const formatYLabel = (value: number) => {
        // Only display the value if it doesn't end in 0.5
        if (value % 1 === 0) {
            return value.toString();
        }
        return "";
    };

    const { state, isActive } = useChartPressState<{ x: string; y: { session_count: number } }>({ x: "", y: { session_count: 0 } });

    function ToolTip({ x, y }: { x: SharedValue<number>; y: any }) {
        return <Circle cx={x} cy={y.session_count.position} r={4} color={text}/>;
    }

    return (
        <View style={{ height: 200, padding: 4 }}>
            <CartesianChart
                data={data}
                xKey={'workout_date'} 
                yKeys={["session_count"]}
                domainPadding={{ left: 5, right: 5, top: 20 }}
                axisOptions={{
                    font,
                    lineColor: text,
                    labelColor: text,
                    formatXLabel,
                    formatYLabel,
                }} 
                chartPressState={state}
            >
                {({ points, chartBounds }) => (
                    <>
                        <Bar
                            color="#ff8787"
                            points={points.session_count} 
                            chartBounds={chartBounds}  
                            roundedCorners={{
                                topLeft: 5,
                                topRight: 5,
                            }}
                        />
                        {
                            isActive && (
                                <ToolTip x={state.x.position} y={state.y} />
                            )
                        }                   
                    </>
                )}
            </CartesianChart>
        </View>
    );
}