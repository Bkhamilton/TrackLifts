import { useThemeColor } from '@/hooks/useThemeColor';
import { useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

export default function FavoriteExerciseAnalysisGraph({ data } : { data: any[] }) {

    let displayData = data.map((item, idx) => {
        if (idx === 0) {
            return {
                ...item,
                weight: item.weight == null ? 0 : item.weight,
                reps: item.reps == null ? 0 : item.reps,
            };
        }
        return item;
    });
    if (displayData.length === 1) {
        const date = new Date(displayData[0].workout_date);
        // Add a day before as baseline
        const baselineDate = new Date(date);
        baselineDate.setDate(date.getDate() - 1);
        displayData = [
            {
                ...displayData[0],
                workout_date: baselineDate.toISOString().slice(0, 10),
                weight: 0,
                reps: 0,
            },
            ...displayData,
        ];
    }    

    const SpaceMono = require('../../../assets/fonts/SpaceMono-Regular.ttf');

    const font = useFont(SpaceMono, 10);

    const text = useThemeColor({}, 'text');

    const formatXLabel = (value: string) => {
        // Format Date to MM/DD, display one day per week
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            // Invalid date
            return "-/-";
        }           
        const day = date.getDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        // Show label only for the first day of each week
        if (day % 7 !== 0 ) {
            return `${month}/${day}`;
        }
        return "";
    };

    const formatYLabel = (value: number) => {
        // Only display the value if it doesn't end in 0.5
        if (value % 10 === 0) {
            return value.toString();
        }
        return "";
    };

    return (
        <View style={{ height: 120, padding: 4 }}>
            <CartesianChart
                data={displayData}
                xKey={'workout_date'} 
                yKeys={["weight", "reps"]}
                domainPadding={{ left: 5, right: 5, top: 20 }}
                axisOptions={{
                    font,
                    lineColor: text,
                    labelColor: text,
                    formatXLabel,
                    formatYLabel,
                }} 
            >
                {({ points }) => (
                    <>
                        <Line
                            color="#ff8787"
                            strokeWidth={2}
                            animate={{ type: "timing", duration: 400 }} 
                            points={points.weight}
                            connectMissingData={true}          
                        />             
                    </>
                )}
            </CartesianChart>
        </View>
    );
}