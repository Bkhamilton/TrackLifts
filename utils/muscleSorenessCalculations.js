// utils/muscleSorenessCalculations.js
import muscleRatios from '@/data/MuscleRatio.json';

/**
 * Creates a lookup map for muscle ratios for efficient access
 * @returns {Object} Map of muscle group -> muscle name -> ratio
 */
export const createRatioMap = () => {
    const ratioMap = {};
    muscleRatios.forEach(group => {
        ratioMap[group.muscle_group] = {};
        group.muscles.forEach(muscle => {
            ratioMap[group.muscle_group][muscle.name] = muscle.ratio;
        });
    });
    return ratioMap;
};

/**
 * Normalizes muscle soreness to a 0-1 scale
 * @param {number} muscleSoreness - Current muscle soreness score
 * @param {number} maxSoreness - Maximum soreness ever achieved for this muscle
 * @returns {number} Normalized soreness (0-1)
 */
export const normalizeMuscleSoreness = (muscleSoreness, maxSoreness) => {
    if (maxSoreness === 0 || maxSoreness === null || maxSoreness === undefined) {
        return 0;
    }
    return Math.min(muscleSoreness / maxSoreness, 1.0);
};

/**
 * Calculates weighted muscle group soreness using individual muscle soreness
 * and ratios from MuscleRatio.json
 * @param {string} muscleGroupName - Name of the muscle group
 * @param {Array} muscles - Array of muscle objects with soreness_score and max_soreness
 * @param {Object} ratioMap - Muscle ratio lookup map
 * @returns {number} Weighted muscle group soreness (0-1)
 */
export const calculateWeightedMuscleGroupSoreness = (muscleGroupName, muscles, ratioMap) => {
    if (!muscles || muscles.length === 0) {
        return 0;
    }

    const groupRatios = ratioMap[muscleGroupName];
    if (!groupRatios) {
        console.warn(`No ratio data found for muscle group: ${muscleGroupName}`);
        // Fallback to simple average
        const avgSoreness = muscles.reduce((sum, m) => {
            return sum + normalizeMuscleSoreness(m.soreness_score || 0, m.max_soreness || 1);
        }, 0) / muscles.length;
        return avgSoreness;
    }

    let weightedSum = 0;
    let totalRatioUsed = 0;

    muscles.forEach(muscle => {
        const muscleName = muscle.muscle_name;
        const ratio = groupRatios[muscleName];

        if (ratio !== undefined) {
            const normalizedSoreness = normalizeMuscleSoreness(
                muscle.soreness_score || 0,
                muscle.max_soreness || 1
            );
            weightedSum += normalizedSoreness * ratio;
            totalRatioUsed += ratio;
        }
    });

    // If we have some muscles contributing, return the weighted sum
    // Note: If not all muscles in the group have data, totalRatioUsed will be < 1.0
    // We return the actual weighted sum, not normalized, so missing muscles contribute 0
    return weightedSum;
};

/**
 * Calculates weighted muscle group soreness for all muscle groups
 * @param {Array} muscleGroups - Array of muscle group objects
 * @param {Function} getMuscleSoreness - Function to fetch muscle soreness by muscle group
 * @param {Function} getMuscleMaXSoreness - Function to fetch max soreness by muscle
 * @returns {Promise<Array>} Array of muscle groups with weighted soreness scores
 */
export const calculateAllWeightedMuscleGroupSoreness = async (
    muscleGroups,
    getMuscleSoreness,
    getMuscleMaXSoreness
) => {
    const ratioMap = createRatioMap();
    const results = [];

    for (const group of muscleGroups) {
        try {
            // Fetch individual muscle soreness for this group
            const muscles = await getMuscleSoreness(group.muscle_group);
            
            // Fetch max soreness for each muscle
            const musclesWithMax = await Promise.all(
                muscles.map(async (muscle) => {
                    const maxSoreness = await getMuscleMaXSoreness(muscle.muscle_id);
                    return {
                        ...muscle,
                        max_soreness: maxSoreness || 1
                    };
                })
            );

            // Calculate weighted soreness
            const weightedSoreness = calculateWeightedMuscleGroupSoreness(
                group.muscle_group,
                musclesWithMax,
                ratioMap
            );

            results.push({
                ...group,
                weighted_soreness: weightedSoreness
            });
        } catch (error) {
            console.error(`Error calculating soreness for ${group.muscle_group}:`, error);
            results.push({
                ...group,
                weighted_soreness: 0
            });
        }
    }

    return results;
};
