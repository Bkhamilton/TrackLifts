// __tests__/muscleSorenessCalculations.test.js
import { 
    createRatioMap, 
    normalizeMuscleSoreness, 
    calculateWeightedMuscleGroupSoreness 
} from '../utils/muscleSorenessCalculations';

describe('Muscle Soreness Calculations', () => {
    let ratioMap;

    beforeAll(() => {
        ratioMap = createRatioMap();
    });

    describe('normalizeMuscleSoreness', () => {
        test('normalizes soreness correctly', () => {
            expect(normalizeMuscleSoreness(800, 1000)).toBe(0.8);
            expect(normalizeMuscleSoreness(600, 800)).toBe(0.75);
            expect(normalizeMuscleSoreness(400, 500)).toBe(0.8);
        });

        test('returns 0 for zero max soreness', () => {
            expect(normalizeMuscleSoreness(100, 0)).toBe(0);
        });

        test('returns 0 for null max soreness', () => {
            expect(normalizeMuscleSoreness(100, null)).toBe(0);
        });

        test('caps at 1.0 for soreness exceeding max', () => {
            expect(normalizeMuscleSoreness(1200, 1000)).toBe(1.0);
        });
    });

    describe('calculateWeightedMuscleGroupSoreness', () => {
        test('calculates correct weighted soreness for chest', () => {
            const muscles = [
                { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 },
                { muscle_name: 'Upper Chest', soreness_score: 600, max_soreness: 800 },
                { muscle_name: 'Lower Chest', soreness_score: 400, max_soreness: 500 }
            ];

            const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
            // Expected: (0.8 * 0.6) + (0.75 * 0.3) + (0.8 * 0.1) = 0.48 + 0.225 + 0.08 = 0.785
            expect(result).toBeCloseTo(0.785, 3);
        });

        test('handles missing muscle data gracefully', () => {
            const muscles = [
                { muscle_name: 'Chest', soreness_score: 800, max_soreness: 1000 }
                // Upper Chest and Lower Chest missing
            ];

            const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
            // Only main chest contributes: 0.8 * 0.6 = 0.48
            expect(result).toBeCloseTo(0.48, 3);
        });

        test('returns 0 for completely untrained muscle group', () => {
            const muscles = [];

            const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
            expect(result).toBe(0);
        });

        test('handles muscle group with all muscles at 100% soreness', () => {
            const muscles = [
                { muscle_name: 'Chest', soreness_score: 1000, max_soreness: 1000 },
                { muscle_name: 'Upper Chest', soreness_score: 800, max_soreness: 800 },
                { muscle_name: 'Lower Chest', soreness_score: 500, max_soreness: 500 }
            ];

            const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
            // All at 100%: (1.0 * 0.6) + (1.0 * 0.3) + (1.0 * 0.1) = 1.0
            expect(result).toBeCloseTo(1.0, 3);
        });

        test('handles muscle group with all muscles at 0% soreness', () => {
            const muscles = [
                { muscle_name: 'Chest', soreness_score: 0, max_soreness: 1000 },
                { muscle_name: 'Upper Chest', soreness_score: 0, max_soreness: 800 },
                { muscle_name: 'Lower Chest', soreness_score: 0, max_soreness: 500 }
            ];

            const result = calculateWeightedMuscleGroupSoreness('Chest', muscles, ratioMap);
            expect(result).toBe(0);
        });

        test('falls back to average for unknown muscle group', () => {
            const muscles = [
                { muscle_name: 'Unknown Muscle', soreness_score: 800, max_soreness: 1000 }
            ];

            const result = calculateWeightedMuscleGroupSoreness('Unknown Group', muscles, ratioMap);
            expect(result).toBeCloseTo(0.8, 3);
        });
    });

    describe('createRatioMap', () => {
        test('creates ratio map with all muscle groups', () => {
            expect(ratioMap['Chest']).toBeDefined();
            expect(ratioMap['Back']).toBeDefined();
            expect(ratioMap['Shoulders']).toBeDefined();
            expect(ratioMap['Arms']).toBeDefined();
            expect(ratioMap['Legs']).toBeDefined();
            expect(ratioMap['Core']).toBeDefined();
        });

        test('chest ratios sum to 1.0', () => {
            const chestRatios = Object.values(ratioMap['Chest']);
            const sum = chestRatios.reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(1.0, 10);
        });

        test('back ratios sum to 1.0', () => {
            const backRatios = Object.values(ratioMap['Back']);
            const sum = backRatios.reduce((a, b) => a + b, 0);
            expect(sum).toBeCloseTo(1.0, 10);
        });

        test('all muscle groups have correct muscle mappings', () => {
            expect(ratioMap['Chest']['Chest']).toBe(0.6);
            expect(ratioMap['Chest']['Upper Chest']).toBe(0.3);
            expect(ratioMap['Chest']['Lower Chest']).toBe(0.1);
        });
    });
});
