/**
 * Get exercise breakdown for a specific muscle group from recent workouts
 * @param {object} db - The database instance
 * @param {number} userId - The user ID
 * @param {string} muscleGroupName - The muscle group name (e.g., 'Chest', 'Back')
 * @param {number} daysPast - Number of days to look back (default 14)
 * @returns {Promise<Object>} Exercise breakdown data
 */
export const getMuscleGroupExerciseBreakdown = async (db, userId, muscleGroupName, daysPast = 14) => {
    try {
        const query = `
            SELECT 
                ws.id AS session_id,
                ws.start_time,
                r.title AS routine_title,
                e.title AS exercise_name,
                COUNT(ss.id) AS total_sets,
                AVG(ss.reps) AS avg_reps,
                MAX(ss.weight) AS max_weight,
                SUM(ss.weight * ss.reps) AS total_volume,
                em.intensity
            FROM WorkoutSessions ws
            LEFT JOIN Routines r ON ws.routine_id = r.id
            JOIN SessionExercises se ON ws.id = se.session_id
            JOIN SessionSets ss ON se.id = ss.session_exercise_id
            JOIN Exercises e ON se.exercise_id = e.id
            JOIN ExerciseMuscles em ON e.id = em.exercise_id
            JOIN Muscles m ON em.muscle_id = m.id
            JOIN MuscleGroups mg ON m.muscle_group_id = mg.id
            WHERE ws.user_id = ?
              AND mg.name = ?
              AND ws.start_time >= datetime('now', '-${daysPast} days')
            GROUP BY ws.id, se.exercise_id
            ORDER BY ws.start_time DESC, total_volume DESC
        `;
        
        const results = await db.getAllAsync(query, [userId, muscleGroupName]);
        
        if (results.length === 0) {
            return null;
        }
        
        // Get the most recent workout session
        const mostRecentSession = results[0];
        const sessionExercises = results.filter(r => r.session_id === mostRecentSession.session_id);
        
        // Calculate total volume for percentage calculations
        const totalSessionVolume = sessionExercises.reduce((sum, ex) => sum + ex.total_volume, 0);
        
        // Format the exercises data
        const exercises = sessionExercises.map(ex => ({
            name: ex.exercise_name,
            sets: ex.total_sets,
            reps: Math.round(ex.avg_reps),
            weight: ex.max_weight > 0 ? `${ex.max_weight} lbs` : 'Bodyweight',
            contribution: `${Math.round((ex.total_volume / totalSessionVolume) * 100)}%`
        }));
        
        return {
            routine: mostRecentSession.routine_title || 'Custom Workout',
            date: new Date(mostRecentSession.start_time).toLocaleDateString('en-US'),
            exercises: exercises
        };
        
    } catch (error) {
        console.error('Error fetching muscle group exercise breakdown:', error);
        throw error;
    }
};

/**
 * Get the most recent workout that targeted a specific muscle group
 * @param {object} db - The database instance
 * @param {number} userId - The user ID
 * @param {string} muscleGroupName - The muscle group name
 * @returns {Promise<Object|null>} Most recent workout breakdown or null
 */
export const getLatestMuscleGroupWorkout = async (db, userId, muscleGroupName) => {
    return await getMuscleGroupExerciseBreakdown(db, userId, muscleGroupName, 30);
};