import { useThemeColor } from '@/hooks/useThemeColor';
import { Circle, useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import type { SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState } from 'victory-native';

export default function ExerciseAnalysisGraph({ data } : { data: any[] }) {

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
        if (value % 10 === 0) {
            return value.toString();
        }
        return "";
    };

    const { state, isActive } = useChartPressState({ x: 0, y: { weight: 0, reps: 0 } });

    function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
        return <Circle cx={x} cy={y} r={8} color={text} />;
    }

    return (
        <View style={{ height: 200, padding: 4 }}>
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
                chartPressState={state}
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
                        {isActive && (
                            <ToolTip x={state.x.position} y={state.y.weight.position} />
                        )}                    
                    </>
                )}
            </CartesianChart>
        </View>
    );
}