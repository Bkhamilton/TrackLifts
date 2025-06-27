import { useEffect, useState } from 'react';

export const useWorkoutTimer = (startTime: number | null, isWorkoutStopped: boolean) => {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [stoppedTime, setStoppedTime] = useState<number | null>(null);

    useEffect(() => {
        if (isWorkoutStopped || !startTime) return;

        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [isWorkoutStopped, startTime]);

    const formatTime = () => {
        if (!startTime) return '00:00:00';

        const elapsed = isWorkoutStopped && stoppedTime 
            ? stoppedTime - startTime 
            : currentTime - startTime;

        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const stopTimer = () => {
        setStoppedTime(Date.now());
    };

    return { formattedTime: formatTime(), stopTimer };
};