/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export interface workoutSet {
  exercise: Exercise;
  sets: Set[];
}

export interface Set {
  number: number;
  weight: number;
  reps: number;
}

export interface History {
  id: number;
  date: string;
  routine: RoutineList;
  lengthMin: string;
  totalWeight: number;
  workout: workoutSet[];
}

export interface ExerciseInfo {
  id: number;
  title: string;
  type: string;
  muscleGroup: string;
  muscles: {
      name: string;
      value: number;
  }[];
};

export interface Exercise {
  id: number;
  title: string;
  type: string;
  muscleGroup: string;
};

export interface RoutineList {
  id: number;
  title: string;
  exercises: Exercise[];
};

export interface Routine {
  id: number;
  title: string;
}

export interface Muscle {
  id: number;
  muscle: string;
  muscleGroup: string;
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Home: undefined;
  Exercises: undefined;
  NewWorkout: undefined;
  History: undefined;
  Data: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
