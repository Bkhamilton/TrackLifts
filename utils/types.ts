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

export interface ActiveExercise {
    id: number;
    title: string;
    equipment: string;
    muscleGroupId: number;
    muscleGroup: string;
    sets: {
        id: number;
        reps: number;
        weight: number;
        restTime: number;
        order: number;
    }[];
}