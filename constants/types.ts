export interface Exercise {
    id: number;
    title: string;
    equipment: string;
    muscleGroupId?: number;
    muscleGroup: string;
    muscles?: any[];
}

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
}

export interface History {
    id: number;
    startTime: string;
    routine: ActiveRoutine;
    lengthMin: string;
    endTime?: string;
    notes: string;
}

export interface Workout {
    routine: ActiveRoutine;
    startTime: string | null;
    endTime: string | null;
    lengthMin: string;
    notes: string;
}

export interface Routine {
    id: number;
    title: string;
    exercises: Exercise[];
}

export interface ActiveRoutine {
    id: number;
    title: string;
    exercises: ActiveExercise[];
}

export interface ActiveExercise {
    id: number;
    title: string;
    equipment: string;
    muscleGroupId?: number;
    muscleGroup: string;
    sets: ActiveSet[];
    exercise_id?: number;
    routine_id?: number;
}

export interface ActiveSet {
    id: number;
    reps: number;
    weight: number;
    restTime: number;
    set_order: number;
}

export interface Set {
    number: number;
    weight: number;
    reps: number;
}

export interface MuscleGroup {
    id: number;
    name: string;
}

export interface Muscle {
    id: number;
    name: string;
    muscleGroupId: number;
    muscleGroup: string;
}

export interface Equipment {
    id: number;
    name: string;
}

export interface Splits {
    id: number;
    name: string;
    user_id?: number;
    routines: {
        id: number;
        split_id: number;
        day: number;
        routine_id: number;
        routine: string;
    }[];
    is_active?: boolean;
}

export interface UserProfileStats {
    height: string;
    weight: string;
    bodyFat: string;
    favoriteExercise: string;
    memberSince: string;
    goals: string;
}

export interface OnboardingData {
    name: string;
    username: string;
    height: string;
    weight: string;
    bodyFat: string;
    favoriteExercise: string;
}

export interface FavoriteGraph {
    id: string;
    exercise: string;
    exercise_id: number;
    equipment: string;
    graphType: string;
    stats?: any[];
    currentMax: number;
    progress: number;
    lastUpdated: number;
}