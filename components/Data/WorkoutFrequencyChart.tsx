import { View } from 'react-native';
import { Bar, CartesianChart } from 'victory-native';

export default function WorkoutFrequencyChart() {
  // Hardcoded weekly workout data
  const data = [
    { day: 'None', workouts: 0 },
    { day: 'Mon', workouts: 2 },
    { day: 'Tue', workouts: 1 },
    { day: 'Wed', workouts: 3 },
    { day: 'Thu', workouts: 0 },
    { day: 'Fri', workouts: 2 },
    { day: 'Sat', workouts: 1 },
    { day: 'Sun', workouts: 0 },
  ];

  return (
    <View style={{ height: 250, padding: 16 }}>
      <CartesianChart
        data={data}
        xKey={'day'} 
        yKeys={["workouts"]} 
      >
        {({ points, chartBounds }) => (
          <Bar
            color="#ff8787"
            points={points.workouts} 
            chartBounds={chartBounds}  
            
          />
        )}
      </CartesianChart>
    </View>
  );
}