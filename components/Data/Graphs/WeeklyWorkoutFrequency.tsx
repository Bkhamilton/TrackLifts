import { useThemeColor } from '@/hooks/useThemeColor';
import { useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

interface WorkoutFrequencyChartProps {
    data: { workout_date: string; session_count: number }[];
}

export default function WorkoutFrequencyChart({ data } : WorkoutFrequencyChartProps) {
    const SpaceMono = require('../../../assets/fonts/SpaceMono-Regular.ttf');

    const font = useFont(SpaceMono, 16);

    const text = useThemeColor({}, 'text');

    return (
        <View style={{ height: 200, padding: 4 }}>
            <CartesianChart
                data={data}
                xKey={'workout_date'} 
                yKeys={["session_count"]}
                domainPadding={{ left: 20, right: 20, top: 20 }}
                axisOptions={{
                    font,
                    lineColor: text,
                    labelColor: text,
                    formatXLabel: (value) => {
                        // Convert YYYY-MM-DD to day of week
                        const date = new Date(value);
                        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        const day = days[date.getDay()];
                        if (day === "Thu") return "Th";
                        if (day === "Sun") return "Su";
                        return day.charAt(0);
                    },
                    formatYLabel: (value) => {
                        // Only display the value if it doesn't end in 0.5
                        if (value % 1 === 0) {
                        return value.toString();
                        }
                        return "";
                    }
                }} 
            >
                {({ points, chartBounds }) => (
                    <Bar
                        color="#ff8787"
                        points={points.session_count} 
                        chartBounds={chartBounds}  
                        roundedCorners={{
                            topLeft: 5,
                            topRight: 5,
                        }}
                    />
                )}
            </CartesianChart>
        </View>
    );
}