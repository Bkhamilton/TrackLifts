import { useThemeColor } from '@/hooks/useThemeColor';
import { useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

export default function WorkoutFrequencyChartMonth() {
    // Hardcoded weekly workout data
    const daysInMonth = 30;
    const data = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(2024, 5, i + 1); // Month is 0-indexed: 5 = June
        return {
            date: date.toISOString().slice(0, 10), // "YYYY-MM-DD"
            workouts: Math.floor(Math.random() * 4), // Random 0-3 workouts per day
        };
    });

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

  return (
    <View style={{ height: 200, padding: 4 }}>
        <CartesianChart
            data={data}
            xKey={'date'} 
            yKeys={["workouts"]}
            domainPadding={{ left: 5, right: 5, top: 20 }}
            axisOptions={{
                font,
                lineColor: text,
                labelColor: text,
                formatXLabel,
                formatYLabel,
            }} 
        >
            {({ points, chartBounds }) => (
                <Bar
                    color="#ff8787"
                    points={points.workouts} 
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