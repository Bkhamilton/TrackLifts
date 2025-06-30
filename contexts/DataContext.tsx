// app/contexts/DataContext.tsx
import { getExerciseSessionStats } from '@/db/data/ExerciseSessionStats';
import {
    getAverageWeightPerSession,
    getHeaviestSets,
    getMostRepsSets,
    getTopSets,
    getTotalVolumePerSession,
} from '@/db/data/ExerciseStatSets';
import { getFavoriteRoutinesByUser } from '@/db/data/FavoriteRoutines';
import { getTotalMuscleGroupFocus } from '@/db/data/MuscleGroupFocus';
import { getMuscleGroupIntensity } from '@/db/data/MuscleGroupIntensity';
import {
    deleteFavoriteGraph,
    getFavoriteGraphsByUserId,
    insertFavoriteGraph,
} from '@/db/workout/FavoriteGraphs';
import { getTopExericise } from '@/db/workout/SessionExercises';
import { getWeeklySetCount } from '@/db/workout/SessionSets';
import {
    getMonthlyWorkoutCount,
    getQuarterlyWorkoutCount,
    getWeeklyWorkoutCount,
    getWorkoutCountByUser,
    getYearlyWorkoutCount
} from '@/db/workout/WorkoutSessions';
import { dataEvents } from '@/utils/events';
import { fillResultsWithDates } from '@/utils/workoutUtils';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DBContext } from './DBContext';
import { UserContext } from './UserContext';

interface FavoriteRoutine {
    routine_id: number;
    routine_title: string;
    usage_count: number;
    last_used: string;
}

interface TopExercise {
    id: number;
    title: string;
    sessionCount: number;
}

interface MuscleGroupStat {
    muscle_group: string;
    total_intensity: number;
}

interface DataContextValue {
    favoriteRoutines: FavoriteRoutine[];
    favoriteGraphs: any[];
    weeklySetsCount: number;
    topExercise: TopExercise;
    muscleGroupFocusBySet: MuscleGroupStat[];
    workoutCount: {
        total: number;
        weekly: number;
        monthly: number;
        quarterly: number;
        yearly: number;
    };
    muscleGroupIntensity: any[];
    refreshData: () => void;
    fetchExerciseSessionStats: (
        exerciseId: number,
        startDate: string,
        endDate: string
    ) => Promise<any[]>;
    fetchExerciseStats: (
        exerciseId: number,
        startDate: string,
        endDate: string,
        statType: 'heaviest_set' | 'top_set' | 'most_reps' | 'total_volume' | 'avg_weight'
    ) => Promise<any[]>;
    addFavoriteGraph: (exerciseId: number, graphType: string) => Promise<void>;
    removeFavoriteGraph: (exerciseId: number, graphType: string) => Promise<void>;
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
    favoriteGraphs: [],
    weeklySetsCount: 0,
    topExercise: {
        id: 0,
        title: '',
        sessionCount: 0,
    },
    muscleGroupFocusBySet: [],
    workoutCount: {
        total: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
    },
    muscleGroupIntensity: [],
    refreshData: () => {
        console.warn('refreshData function not implemented');
    },
    fetchExerciseSessionStats: async () => {
        console.warn('fetchExerciseSessionStats function not implemented');
        return [];
    },
    fetchExerciseStats: async () => {
        console.warn('fetchExerciseStats function not implemented');
        return [];
    },
    addFavoriteGraph: async () => {
        console.warn('addFavoriteGraph function not implemented');
    },
    removeFavoriteGraph: async () => {
        console.warn('deleteFavoriteGraph function not implemented');
    },
});

interface DataContextValueProviderProps {
    children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextValueProviderProps) => {
    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [favoriteRoutines, setFavoriteRoutines] = useState<FavoriteRoutine[]>([]);
    const [favoriteGraphs, setFavoriteGraphs] = useState<any[]>([]);
    const [workoutCount, setWorkoutCount] = useState<any>({
        total: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
    })
    const [weeklySetsCount, setWeeklySetsCount] = useState<number>(0);
    const [topExercise, setTopExercise] = useState<TopExercise>({
        id: 0,
        title: '',
        sessionCount: 0,
    });
    const [muscleGroupFocusBySet, setMuscleGroupFocusBySet] = useState<MuscleGroupStat[]>([]);
    const [muscleGroupIntensity, setMuscleGroupIntensity] = useState<any[]>([]);

    const refreshData = async () => {
        if (db && user.id !== 0) {
            getFavoriteRoutinesByUser(db, user.id).then((routines) => {
                setFavoriteRoutines(routines);
            });
            getFavoriteGraphsByUserId(db, user.id).then(async (graphs) => {
                if (!graphs || graphs.length === 0) {
                    setFavoriteGraphs([]);
                    return;
                }
                const endDate = new Date();
                const startDate = new Date();
                startDate.setMonth(endDate.getMonth() - 1);

                const formattedEnd = endDate.toISOString().slice(0, 10);
                const formattedStart = startDate.toISOString().slice(0, 10);

                const graphTypeToStatType: Record<string, 'heaviest_set' | 'top_set' | 'most_reps' | 'total_volume' | 'avg_weight'> = {
                    'Top Set': 'top_set',
                    'Heaviest Set': 'heaviest_set',
                    'Most Weight Moved': 'total_volume',
                    'Average Weight': 'avg_weight',
                    'Most Repetitions': 'most_reps',
                };                

                const graphsWithStats = await Promise.all(
                    graphs.map(async (graph: any) => {
                        const statType = graphTypeToStatType[graph.graphType] || 'top_set';
                        const stats = await fetchExerciseStats(
                            graph.exercise_id,
                            formattedStart,
                            formattedEnd,
                            statType
                        );
                        if (!stats || stats.length === 0) {
                            return { ...graph, stats: [] };
                        }
                        const filledStats = fillResultsWithDates(stats, startDate, endDate);
                        return { ...graph, stats: filledStats };
                    })
                );
                console.log('Fetched favorite graphs with stats:', JSON.stringify(graphsWithStats, null, 2));
                setFavoriteGraphs(graphsWithStats);
            });
            getWorkoutCountByUser(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    total: count,
                }));
            });
            getWeeklyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    weekly: count,
                }));
            });
            getMonthlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    monthly: count,
                }));
            });
            getQuarterlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    quarterly: count,
                }));
            });
            getYearlyWorkoutCount(db, user.id).then((count) => {
                setWorkoutCount((prev: any) => ({
                    ...prev,
                    yearly: count,
                }));
            });
            getWeeklySetCount(db, user.id).then((count) => {
                setWeeklySetsCount(count);
            });
            getTopExericise(db, user.id).then((exercise) => {
                setTopExercise(exercise);
            });
            getTotalMuscleGroupFocus(db).then((stats) => {
                setMuscleGroupFocusBySet(stats);
            });
            getMuscleGroupIntensity(db, user.id).then((intensity) => {
                setMuscleGroupIntensity(intensity);
            });
        }
    }

    const fetchExerciseSessionStats = async (
        exerciseId: number,
        startDate: string,
        endDate: string
    ) => {
        if (!db || !user?.id || !exerciseId) return [];
        try {
            return await getExerciseSessionStats(db, user.id, exerciseId, startDate, endDate);
        } catch (e) {
            console.error('Failed to fetch exercise session stats:', e);
            return [];
        }
    };

    const fetchExerciseStats = async (
        exerciseId: number,
        startDate: string,
        endDate: string,
        statType: 'heaviest_set' | 'top_set' | 'most_reps' | 'total_volume' | 'avg_weight'
    ) => {
        if (!db || !user?.id || !exerciseId) return [];
        try {
            switch (statType) {
                case 'heaviest_set':
                    return await getHeaviestSets(db, user.id, exerciseId, startDate, endDate);
                case 'top_set':
                    return await getTopSets(db, user.id, exerciseId, startDate, endDate);
                case 'most_reps':
                    return await getMostRepsSets(db, user.id, exerciseId, startDate, endDate);
                case 'total_volume':
                    return await getTotalVolumePerSession(db, user.id, exerciseId, startDate, endDate);
                case 'avg_weight':
                    return await getAverageWeightPerSession(db, user.id, exerciseId, startDate, endDate);
                default:
                    return [];
            }
        } catch (e) {
            console.error('Failed to fetch exercise stats:', e);
            return [];
        }
    };

    const addFavoriteGraph = async (exerciseId: number, graphType: string) => {
        if (!db || !user?.id) return;
        try {
            await insertFavoriteGraph(db, {
                user_id: user.id,
                exercise_id: exerciseId,
                graph_type: graphType,
            });
            // Optionally refresh favorites here if you keep them in state
        } catch (e) {
            console.error('Failed to add favorite graph:', e);
        }
    };

    const removeFavoriteGraph = async (exerciseId: number, graphType: string) => {
        if (!db || !user?.id) return;
        try {
            await deleteFavoriteGraph(db, user.id, exerciseId, graphType);
            // Optionally refresh favorites here if you keep them in state
        } catch (e) {
            console.error('Failed to remove favorite graph:', e);
        }
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        dataEvents.addEventListener('refreshData', handler);
        return () => dataEvents.removeEventListener('refreshData', handler);
    }, [db, user]);

    const value = {
        favoriteRoutines,
        favoriteGraphs,
        weeklySetsCount,
        topExercise,
        muscleGroupFocusBySet,
        workoutCount,
        muscleGroupIntensity,
        refreshData,
        fetchExerciseSessionStats,
        fetchExerciseStats,
        addFavoriteGraph,
        removeFavoriteGraph,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
