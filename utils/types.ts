export interface Exercise {
    id: number;
    title: string;
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