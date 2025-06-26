// app/contexts/DBContext.tsx
import { getEquipment } from '@/db/general/Equipment';
import { getMuscleGroups } from '@/db/general/MuscleGroups';
import { getMuscles } from '@/db/general/Muscles';
import { MuscleGroup } from '@/utils/types';
import { useSQLiteContext } from 'expo-sqlite';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

interface DBContextValue {
    db: any;
    equipment: any[];
    muscles: Muscle[];
    muscleGroups: MuscleGroup[];
}

type Muscle = {
    id: string;
    name: string;
    muscleGroupId: string;
    muscleGroup: string;
}

export const DBContext = createContext<DBContextValue>({
    db: null,
    equipment: [],
    muscles: [],
    muscleGroups: [],
});

interface DBContextValueProviderProps {
    children: ReactNode;
}

export const DBContextProvider = ({ children }: DBContextValueProviderProps) => {
    const db = useSQLiteContext();

    const [equipment, setEquipment] = useState<any[]>([]);
    const [muscles, setMuscles] = useState<Muscle[]>([]);
    const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);

    useEffect(() => {
        if (db) {
            getEquipment(db).then((data) => {
                setEquipment(data);
            });
            getMuscleGroups(db).then((data) => {
                setMuscleGroups(data);
            });
            getMuscles(db).then((data) => {
                setMuscles(data);
            });
        }
    }, [db]);

    const value = {
        db,
        equipment,
        muscles,
        muscleGroups,
    };

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    );
};
