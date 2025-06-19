import { useFont } from '@shopify/react-native-skia';
import React from 'react';
import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

export default function WorkoutFrequencyChart() {
  // Hardcoded weekly workout data
  const data = [
    { day: 'Mon', workouts: 2 },
    { day: 'Tue', workouts: 1 },
    { day: 'Wed', workouts: 3 },
    { day: 'Thu', workouts: 0 },
    { day: 'Fri', workouts: 2 },
    { day: 'Sat', workouts: 1 },
    { day: 'Sun', workouts: 0 },
  ];

  const SpaceMono = require('../../assets/fonts/SpaceMono-Regular.ttf');

  const font = useFont(SpaceMono, 16);

  return (
    <View style={{ height: 200, padding: 4 }}>
      <CartesianChart
        data={data}
        xKey={'day'} 
        yKeys={["workouts"]}
        domainPadding={{ left: 20, right: 20, top: 20 }}
        axisOptions={{
          font,
          formatXLabel: (value) => {
            // Display first letter of the day unless it's "Th"
            if (value === "Thu") {
              return "Th";
            }
            if (value === "Sun") {
              return "Su";
            }
            return value.toString().charAt(0).toUpperCase();
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