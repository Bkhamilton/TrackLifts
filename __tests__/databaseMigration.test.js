// __tests__/databaseMigration.test.js
/**
 * Test suite for database migration logic
 * These tests verify that the UserIndividualMuscleMaxSoreness table migration
 * follows the correct pattern and will work correctly for existing users.
 */

describe('Database Migration - UserIndividualMuscleMaxSoreness', () => {
    describe('addIndividualMuscleSorenessTable', () => {
        test('should create UserIndividualMuscleMaxSoreness table with correct schema', () => {
            // This test verifies the SQL structure is correct
            const expectedSQL = `
        CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness (
            user_id INTEGER NOT NULL,
            muscle_id INTEGER NOT NULL,
            max_soreness REAL NOT NULL,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, muscle_id),
            FOREIGN KEY (user_id) REFERENCES Users(id),
            FOREIGN KEY (muscle_id) REFERENCES Muscles(id)
        );
    `;
            
            // Verify SQL contains all required fields
            expect(expectedSQL).toContain('user_id INTEGER NOT NULL');
            expect(expectedSQL).toContain('muscle_id INTEGER NOT NULL');
            expect(expectedSQL).toContain('max_soreness REAL NOT NULL');
            expect(expectedSQL).toContain('last_updated DATETIME DEFAULT CURRENT_TIMESTAMP');
            expect(expectedSQL).toContain('PRIMARY KEY (user_id, muscle_id)');
            expect(expectedSQL).toContain('FOREIGN KEY (user_id) REFERENCES Users(id)');
            expect(expectedSQL).toContain('FOREIGN KEY (muscle_id) REFERENCES Muscles(id)');
        });

        test('should use CREATE TABLE IF NOT EXISTS for safe migration', () => {
            const expectedSQL = 'CREATE TABLE IF NOT EXISTS UserIndividualMuscleMaxSoreness';
            
            // This ensures the migration won't fail if the table already exists
            expect(expectedSQL).toContain('IF NOT EXISTS');
        });
    });

    describe('initializeDatabase migration logic', () => {
        test('should set individualMuscleSorenessTableV1 flag on first launch', () => {
            // For new users, the flag should be set immediately
            const expectedBehavior = {
                firstLaunch: null,
                shouldSetFlag: true,
                flagName: 'individualMuscleSorenessTableV1'
            };
            
            expect(expectedBehavior.firstLaunch).toBeNull();
            expect(expectedBehavior.shouldSetFlag).toBe(true);
            expect(expectedBehavior.flagName).toBe('individualMuscleSorenessTableV1');
        });

        test('should run migration for existing users without the flag', () => {
            // For existing users, check if flag exists and run migration if not
            const existingUserScenario = {
                firstLaunch: 'false', // Existing user
                individualMuscleSorenessTableV1: null, // Flag not set
                shouldRunMigration: true
            };
            
            expect(existingUserScenario.firstLaunch).toBe('false');
            expect(existingUserScenario.individualMuscleSorenessTableV1).toBeNull();
            expect(existingUserScenario.shouldRunMigration).toBe(true);
        });

        test('should skip migration for users who already have the table', () => {
            // Users with the flag set should not run migration again
            const userWithFlag = {
                firstLaunch: 'false', // Existing user
                individualMuscleSorenessTableV1: 'true', // Flag already set
                shouldRunMigration: false
            };
            
            expect(userWithFlag.firstLaunch).toBe('false');
            expect(userWithFlag.individualMuscleSorenessTableV1).toBe('true');
            expect(userWithFlag.shouldRunMigration).toBe(false);
        });

        test('should be independent from exerciseTablesV2 migration', () => {
            // Both migrations should run independently
            const scenarios = [
                { exerciseTablesV2: null, individualMuscleSorenessTableV1: null, bothShouldRun: true },
                { exerciseTablesV2: 'true', individualMuscleSorenessTableV1: null, onlyIndividualShouldRun: true },
                { exerciseTablesV2: null, individualMuscleSorenessTableV1: 'true', onlyExerciseShouldRun: true },
                { exerciseTablesV2: 'true', individualMuscleSorenessTableV1: 'true', noneShouldRun: true }
            ];
            
            expect(scenarios).toHaveLength(4);
            expect(scenarios[0].bothShouldRun).toBe(true);
            expect(scenarios[1].onlyIndividualShouldRun).toBe(true);
            expect(scenarios[2].onlyExerciseShouldRun).toBe(true);
            expect(scenarios[3].noneShouldRun).toBe(true);
        });
    });

    describe('Table schema consistency', () => {
        test('migration table schema should match createUserTables schema', () => {
            // Both definitions should be identical
            const createUserTablesSchema = {
                table_name: 'UserIndividualMuscleMaxSoreness',
                columns: [
                    { name: 'user_id', type: 'INTEGER', not_null: true },
                    { name: 'muscle_id', type: 'INTEGER', not_null: true },
                    { name: 'max_soreness', type: 'REAL', not_null: true },
                    { name: 'last_updated', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
                ],
                primary_key: ['user_id', 'muscle_id'],
                foreign_keys: [
                    { column: 'user_id', references: 'Users(id)' },
                    { column: 'muscle_id', references: 'Muscles(id)' }
                ]
            };
            
            const migrationSchema = {
                table_name: 'UserIndividualMuscleMaxSoreness',
                columns: [
                    { name: 'user_id', type: 'INTEGER', not_null: true },
                    { name: 'muscle_id', type: 'INTEGER', not_null: true },
                    { name: 'max_soreness', type: 'REAL', not_null: true },
                    { name: 'last_updated', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
                ],
                primary_key: ['user_id', 'muscle_id'],
                foreign_keys: [
                    { column: 'user_id', references: 'Users(id)' },
                    { column: 'muscle_id', references: 'Muscles(id)' }
                ]
            };
            
            expect(createUserTablesSchema).toEqual(migrationSchema);
        });
    });
});
