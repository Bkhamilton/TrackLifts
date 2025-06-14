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

  return (
    <View style={{ height: 250, padding: 16 }}>
      <CartesianChart
        data={data}
        padding={20} 
        xKey={'day'} 
        yKeys={[]} 
      >
        {() => (
          <>
            <Bar
              color="#ff8787"
              animate={{
                type: "timing",
                duration: 1000
              }} 
              points={[]} 
              chartBounds={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}            
            />
          </>
        )}
      </CartesianChart>
    </View>
  );
}