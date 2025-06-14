import { View } from '@/components/Themed';
import React from 'react';
import { CartesianChart, Line } from 'victory-native';

export default function MiniSparkline({ data }: { data: { x: number, y: number }[] }) {
  return (
    <View style={{ width: 60, height: 30 }}>
      <CartesianChart
        data={data}
        padding={0} 
        xKey={'x'} 
        yKeys={[]} 
      >
        {() => (
          <Line
            color="#ff8787"
            strokeWidth={2}
            animate={{ type: "timing", duration: 1000 }} 
            points={[]}          
          />
        )}
      </CartesianChart>
    </View>
  );
}
// Usage with hardcoded data:
// <MiniSparkline data={[{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 6 }]} />