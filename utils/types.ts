export interface Exercise {
    id: number;
    title: string;
    equipment: string;
    muscleGroupId: number;
    muscleGroup: string;
}

export interface History {
    id: number;
    date: string;
    routine: {
        id: number;
        title: string;
        exercises: Exercise[];
    };
    lengthMin: string;
    totalWeight: number;
    workout: any[];
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
    muscleGroupId: number;
    muscleGroup: string;
    sets: ActiveSet[];
}

export interface ActiveSet {
    id: number;
    reps: number;
    weight: number;
    restTime: number;
    order: number;
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