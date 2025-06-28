import { useRouter } from 'expo-router';
import { useState } from 'react';

interface ExportOptions {
    userProfile: boolean;
    routines: boolean;
    workoutHistory: boolean;
    exerciseData: boolean;
    splits: boolean;
    progressMetrics: boolean;
}

export default function useHookHistory() {

    const router = useRouter();

    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        userProfile: true,
        routines: true,
        workoutHistory: true,
        exerciseData: true,
        splits: true,
        progressMetrics: true,
    });

    const toggleExportOption = (option: keyof ExportOptions) => {
        setExportOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const handleExport = () => {
        // This will be implemented later
        console.log('Exporting with options:', exportOptions);
        router.navigate('/(tabs)/(index)');
    };

    return {
        exportOptions,
        toggleExportOption,
        handleExport,
    };
}
