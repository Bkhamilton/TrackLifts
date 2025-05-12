import { HapticTab } from '@/components/HapticTab';
import { View } from '@/components/Themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ActiveWorkoutContext } from '@/contexts/ActiveWorkoutContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

interface TabBarButtonProps {
    name: any; 
    color: string;
}

function TabBarButton({ name, color }: TabBarButtonProps) {

    const { isActiveWorkout } = useContext(ActiveWorkoutContext);

    const route = isActiveWorkout ? '/(tabs)/workout/activeWorkout' : '/(tabs)/workout/newWorkout';

    return (
        <Link href={route} asChild>
            <TouchableOpacity
                style={{
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 12,
                    elevation: 5,  
                    backgroundColor: '#FF6347',
                }}
            >
                <MaterialCommunityIcons size={44} name={name} color={color} />
            </TouchableOpacity>
        </Link>
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {},
                }),
        }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
            }}
        />
        <Tabs.Screen
            name="exercises"
            options={{
                title: 'Exercises',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="figure.strengthtraining.traditional" color={color} />,
            }}
        />
        <Tabs.Screen
            name="workout"
            options={{
                title: 'New Workout',
                tabBarIcon: ({ color }) => <IconSymbol name="figure.strengthtraining.traditional" color={color} />,
                tabBarButton: (props) => (
                    <View style={{ alignItems: 'center', backgroundColor: 'transparent' }}>
                        <TabBarButton 
                            name="arm-flex"    
                            color={Colors[colorScheme ?? 'light'].text}
                        />
                    </View>
                ),
                headerShown: false,
            }}
        />
        <Tabs.Screen
            name="history"
            options={{
                title: 'History',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
            }}
        />                
        <Tabs.Screen
            name="data"
            options={{
                title: 'Data',
                tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
            }}
        />
        </Tabs>
    );
}
