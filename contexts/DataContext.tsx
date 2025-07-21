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
import { getMuscleGroupExerciseBreakdown } from '@/db/data/MuscleGroupBreakdown';
import { getTotalMuscleGroupFocus } from '@/db/data/MuscleGroupFocus';
import { getMuscleGroupIntensity } from '@/db/data/MuscleGroupIntensity';
import { getMuscleGroupSoreness } from '@/db/data/MuscleGroupSoreness';
import { getMuscleSorenessByMuscleGroup } from '@/db/data/MuscleSoreness';
import { getMuscleGroupIdByName } from '@/db/general/MuscleGroups';
import { getMuscleMaxSoreness } from '@/db/user/UserMuscleMaxSoreness';
import {
    deleteFavoriteGraph,
    getFavoriteGraphsByUserId,
    insertFavoriteGraph,
} from '@/db/workout/FavoriteGraphs';
import { getCurrentMax, getRecentSorenessExercises, getTopExercise } from '@/db/workout/SessionExercises';
import { getMax1RM, getWeeklySetCount } from '@/db/workout/SessionSets';
import {
    getMonthlyWorkoutCount,
    getQuarterlyWorkoutCount,
    getTotalCaloriesBurned,
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
    totalCaloriesBurned: number;
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
    muscleGroupSoreness: any[];
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
    getMuscleGroupBreakdown: (muscleGroupName: string) => Promise<any>;
    getMuscleSoreness: (muscleGroup: string) => Promise<any[]>;
    getRecentExercises: (muscleGroup: string) => Promise<any[]>;    
    addFavoriteGraph: (exerciseId: number, graphType: string) => Promise<void>;
    removeFavoriteGraph: (exerciseId: number, graphType: string) => Promise<void>;
}

export const DataContext = createContext<DataContextValue>({
    favoriteRoutines: [],
    favoriteGraphs: [],
    weeklySetsCount: 0,
    totalCaloriesBurned: 0,
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
    muscleGroupSoreness: [],
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
    getMuscleGroupBreakdown: async () => {
        console.warn('getMuscleGroupBreakdown function not implemented');
        return null;
    },
    getMuscleSoreness: async () => {
        console.warn('getMuscleSoreness function not implemented');
        return [];
    },
    getRecentExercises: async () => {
        console.warn('getRecentExercises function not implemented');
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
    const [totalCaloriesBurned, setTotalCaloriesBurned] = useState<number>(0);
    const [topExercise, setTopExercise] = useState<TopExercise>({
        id: 0,
        title: '',
        sessionCount: 0,
    });
    const [muscleGroupFocusBySet, setMuscleGroupFocusBySet] = useState<MuscleGroupStat[]>([]);
    const [muscleGroupIntensity, setMuscleGroupIntensity] = useState<any[]>([]);
    const [muscleGroupSoreness, setMuscleGroupSoreness] = useState<any[]>([]);

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
                            return { ...graph, stats: [], currentMax: 0, progress: 0, lastUpdated: null };
                        }
                        const filledStats = fillResultsWithDates(stats, startDate, endDate);
                        const currentMax = await getCurrentMax(db, graph.exercise_id);

                        const now = new Date();
                        const oneDayMs = 24 * 60 * 60 * 1000;

                        const thisMonth1RM = await getMax1RM(db, user.id, graph.exercise_id, '-30 days', '0 days');
                        const lastMonth1RM = await getMax1RM(db, user.id, graph.exercise_id, '-60 days', '-30 days');

                        let progress = 0;
                        if (lastMonth1RM > 0) {
                            progress = ((thisMonth1RM - lastMonth1RM) / lastMonth1RM) * 100;
                        }

                        // Find the most recent date in stats
                        const allDates = stats
                            .map((s: any) => new Date(s.workout_date || s.date))
                            .filter(d => !isNaN(d.getTime()));
                        const mostRecent = allDates.length > 0 ? new Date(Math.max(...allDates.map(d => d.getTime()))) : null;
                        let lastUpdated = null;
                        if (mostRecent) {
                            const diffDays = Math.floor((now.getTime() - mostRecent.getTime()) / oneDayMs);
                            lastUpdated = diffDays;
                        }
                        return {
                            ...graph,
                            stats: filledStats,
                            currentMax,
                            progress,
                            lastUpdated
                        };
                    })
                );
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
            getTotalCaloriesBurned(db, user.id).then((calories) => {
                setTotalCaloriesBurned(calories);
            });
            getTopExercise(db, user.id).then((exercise) => {
                setTopExercise(exercise);
            });
            getTotalMuscleGroupFocus(db).then((stats) => {
                setMuscleGroupFocusBySet(stats);
            });
            getMuscleGroupIntensity(db, user.id).then((intensity) => {
                setMuscleGroupIntensity(intensity);
            });
            // Fetch both current soreness and max soreness
            const [currentSoreness, maxSoreness] = await Promise.all([
                getMuscleGroupSoreness(db, user.id),
                getMuscleMaxSoreness(db, user.id)
            ]);

            // Combine the data
            const muscleData = currentSoreness.map((item: { muscle_group_id: any; }) => {
                const max = maxSoreness.find((m: { muscle_group_id: any; }) => 
                    m.muscle_group_id === item.muscle_group_id
                );
                return {
                    ...item,
                    max_soreness: max ? max.max_soreness : 1 // Default to 1 if no max
                };
            });
            
            setMuscleGroupSoreness(muscleData);
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

    const getMuscleGroupBreakdown = async (muscleGroupName: string) => {
        if (!db || !user?.id) return null;
        try {
            return await getMuscleGroupExerciseBreakdown(db, user.id, muscleGroupName);
        } catch (error) {
            console.error('Error fetching muscle group breakdown:', error);
            return null;
        }
    };    

    const getMuscleSoreness = async (muscleGroup: string) => {
        if (!db || !user?.id) return [];
        try {
            const muscleGroupId = await getMuscleGroupIdByName(db, muscleGroup);
            if (!muscleGroupId) {
                console.warn(`Muscle group "${muscleGroup}" not found.`);
                return [];
            }

            return await getMuscleSorenessByMuscleGroup(db, user.id, muscleGroupId);
        } catch (e) {
            console.error('Failed to fetch muscle soreness:', e);
            return [];
        }
    }

    const getRecentExercises = async (muscleGroup: string) => {
        if (!db || !user?.id) return [];
        try {
            const muscleGroupId = await getMuscleGroupIdByName(db, muscleGroup);
            if (!muscleGroupId) {
                console.warn(`Muscle group "${muscleGroup}" not found.`);
                return [];
            }

            return await getRecentSorenessExercises(db, user.id, muscleGroupId);
        } catch (e) {
            console.error('Failed to fetch recent exercises:', e);
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
            setFavoriteGraphs((prev) =>
                prev.filter((graph) => graph.exercise_id !== exerciseId || graph.graphType !== graphType)
            );
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
        totalCaloriesBurned,
        topExercise,
        muscleGroupFocusBySet,
        workoutCount,
        muscleGroupIntensity,
        muscleGroupSoreness,
        refreshData,
        fetchExerciseSessionStats,
        fetchExerciseStats,
        getMuscleGroupBreakdown,
        getMuscleSoreness,
        getRecentExercises,
        addFavoriteGraph,
        removeFavoriteGraph,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
