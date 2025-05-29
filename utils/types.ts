export interface Exercise {
    id: number;
    title: string;
    equipment: string;
    muscleGroupId: number;
    muscleGroup: string;
    muscles?: any[];
}

export interface History {
    id: number;
    date: string;
    routine: ActiveRoutine;
    lengthMin: string;
    notes: string;
    totalWeight: number;
}

export interface Workout {
    id: number;
    date: string;
    routine: ActiveRoutine;
    startTime: string;
    endTime: string;
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
    muscleGroupId: number;
    muscleGroup: string;
    sets: ActiveSet[];
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