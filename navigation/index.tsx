/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import ExercisesScreen from '../screens/ExercisesScreen';
import HistoryScreen from '../screens/HistoryScreen';
import NewWorkoutScreen from '../screens/NewWorkoutScreen';
import DataScreen from '../screens/DataScreen';

import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const CustomTabBarButton = ({children, onPress}: {children: React.ReactNode, onPress?: Function}) => (
  <TouchableOpacity
    style = {{
      top: -5,
      justifyContent: 'center',
      alignItems: 'center'
    }}
    onPress = {onPress}
    //Currently works, onPress needs to be more explicitly typed
  >
    <View 
    style = {{
      width: 60,
      height: 50,
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: '#990D0D'
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#e3dada',
        tabBarInactiveTintColor: '#ff8787',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#141414',
        },        
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'Home'>) => ({
          title: 'Home',
          tabBarIcon: ({ focused, color }) => {
            return <TabBarIcon name={focused ? "arm-flex" : "arm-flex-outline"} color={color} title={"Home"}/>
          },
        })}
      />      
      <BottomTab.Screen
        name="Exercises"
        component={ExercisesScreen}
        options={({ navigation }: RootTabScreenProps<'Exercises'>) => ({
          title: 'Exercises',
          tabBarIcon: ({ focused, color }) => {
            return <TabBarIcon name="dumbbell" color={color} title={"Exercises"} />
          },
        })}
      />
      <BottomTab.Screen
        name="NewWorkout"
        component={NewWorkoutScreen}
        initialParams={{ routine: { _id: '0001', title: "New Workout", exercises: [] } }}
        options={({ navigation }: RootTabScreenProps<'NewWorkout'>) => ({
          title: 'New Workout',
          tabBarIcon: ({ color }) => {
            return <TabBarIcon name="plus" color={'#e3dada'} title={""}/>
          },
          tabBarButton: (props) => (
            <CustomTabBarButton {... props} />
          ),
        })}
      />                
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ focused, color }) => {
            return <TabBarIcon name={focused ? 'calendar-month' : 'calendar-month-outline'} color={color} title={"History"}/>
          },
        }}
      />
      <BottomTab.Screen
        name="Data"
        component={DataScreen}
        options={{
          title: 'Data',
          tabBarIcon: ({ focused, color }) => {
            return <TabBarIcon name={focused ? "chart-areaspline" : "chart-line"} color={color} title={"Data"}/>
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
  title: string;
}) {
  return <View style={styles.iconContainer}>
    <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} name={props.name} color={props.color} />
    <Text
      style={{fontSize: 10, color:props.color}}
    >{props.title}</Text>
    </View>;
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 8,
  }
});