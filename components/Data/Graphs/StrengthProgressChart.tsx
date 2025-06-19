import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function StrengthProgressChart () {
  const screenWidth = Dimensions.get('window').width;

  // Hardcoded bench press progress
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      data: [135, 145, 155, 160, 175], // weights in lbs
      color: (opacity = 1) => `rgba(255, 135, 135, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <LineChart
      data={data}
      width={screenWidth - 32}
      height={220}
      chartConfig={{
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
          r: '5',
          strokeWidth: '2',
          stroke: '#ff8787'
        }
      }}
      bezier
      style={{ marginVertical: 8, borderRadius: 16 }}
    />
  );
};