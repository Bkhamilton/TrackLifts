import { ActiveWorkoutContext } from "@/contexts/ActiveWorkoutContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from 'react';

export default function ActiveWorkoutCheckScreen() {

    const router = useRouter();

    const { isActiveWorkout } = useContext(ActiveWorkoutContext);

    useEffect(() => {
        const checkActiveWorkout = async () => {
            if (isActiveWorkout) {
                router.replace('/workout/activeWorkout');
            } else {
                router.replace('/workout/newWorkout');
            }
        };
        
        checkActiveWorkout();
    }, []);
  
    return null; // or a loading screen
}