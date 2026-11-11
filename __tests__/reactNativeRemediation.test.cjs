const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { createGeneralTables, createUserTables, createWorkoutTables, createIndexes } = require('../api/createTables.js');
const { deleteExercise } = require('../db/general/Exercises.js');
const { saveProfileChanges } = require('../db/user/Profile.js');
const { getWorkoutFrequencyByUser } = require('../db/data/WorkoutFrequency.js');
const { buildLast7DaysFrequency, buildLast30DaysFrequency, getLast7Days } = require('../utils/workoutUtils.js');

async function fixture(foreignKeys = true) {
    const sqlite = new DatabaseSync(':memory:');
    sqlite.exec(`PRAGMA foreign_keys=${foreignKeys ? 'ON' : 'OFF'}`);
    const db = {
        sqlite,
        execAsync: async sql => sqlite.exec(sql),
        runAsync: async (sql, values = []) => {
            const result = sqlite.prepare(sql).run(...values);
            return { ...result, lastInsertRowId: Number(result.lastInsertRowid) };
        },
        getAllAsync: async (sql, values = []) => sqlite.prepare(sql).all(...values),
        getFirstAsync: async (sql, values = []) => sqlite.prepare(sql).get(...values),
    };
    await createGeneralTables(db);
    await createUserTables(db);
    await createWorkoutTables(db);
    await createIndexes(db);
    sqlite.exec(`
        INSERT INTO Users (id, username, name, password) VALUES (1, 'saved', 'Test', 'x');
        INSERT INTO UserProfileStats (user_id,height,weight,bodyFat,favoriteExercise,memberSince,goals)
        VALUES (1,'70','180','15','Pull-up','2020','Keep going');
        INSERT INTO MuscleGroups VALUES (1,'Group');
        INSERT INTO Muscles VALUES (1,'Muscle',1);
        INSERT INTO Equipment VALUES (1,'Bodyweight');
        INSERT INTO Exercises VALUES (7,'Pull-up',1,1);
        INSERT INTO ExerciseMuscles VALUES (9,7,1,1);
        INSERT INTO Routines VALUES (11,'Routine',1);
        INSERT INTO WorkoutSessions (id,user_id,start_time) VALUES (13,1,'2026-11-11T12:00:00Z');
    `);
    return db;
}

for (const foreignKeys of [true, false]) {
    test(`unused deletion removes mapping before definition (foreign keys ${foreignKeys})`, async t => {
        const db = await fixture(foreignKeys);
        t.after(() => db.sqlite.close());
        await deleteExercise(db, 7);
        assert.equal((await db.getFirstAsync('SELECT COUNT(*) n FROM Exercises')).n, 0);
        assert.equal((await db.getFirstAsync('SELECT COUNT(*) n FROM ExerciseMuscles')).n, 0);
        assert.equal((await db.getFirstAsync('SELECT COUNT(*) n FROM WorkoutSessions')).n, 1);
    });

    for (const [reference, insert] of [
        ['routine', 'INSERT INTO RoutineExercises VALUES (17,11,7); INSERT INTO ExerciseSets (routine_exercise_id,set_order,weight,reps) VALUES (17,1,0,8)'],
        ['session', 'INSERT INTO SessionExercises VALUES (19,13,7); INSERT INTO SessionSets (session_exercise_id,set_order,weight,reps) VALUES (19,1,0,8)'],
        ['record', 'INSERT INTO ExerciseMaxHistory (user_id,exercise_id,one_rep_max) VALUES (1,7,200)'],
        ['graph', "INSERT INTO FavoriteGraphs (user_id,exercise_id,graph_type) VALUES (1,7,'top_set')"],
    ]) {
        test(`${reference} reference blocks deletion without changing rows (foreign keys ${foreignKeys})`, async t => {
            const db = await fixture(foreignKeys);
            t.after(() => db.sqlite.close());
            db.sqlite.exec(insert);
            const before = db.sqlite.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
                .all().map(({ name }) => [name, db.sqlite.prepare(`SELECT * FROM "${name}"`).all()]);
            await assert.rejects(deleteExercise(db, 7), /cannot be deleted/);
            for (const [name, rows] of before) {
                assert.deepEqual(db.sqlite.prepare(`SELECT * FROM "${name}"`).all(), rows);
            }
        });
    }
}

test('failed parent deletion rolls back mapping removal; retry succeeds; unavailable/missing definitions reject', async t => {
    const db = await fixture();
    t.after(() => db.sqlite.close());
    db.sqlite.exec("CREATE TRIGGER fail_delete BEFORE DELETE ON Exercises BEGIN SELECT RAISE(ABORT,'injected failure'); END");
    await assert.rejects(deleteExercise(db, 7), /injected failure/);
    assert.equal((await db.getFirstAsync('SELECT id FROM ExerciseMuscles')).id, 9);
    assert.equal((await db.getFirstAsync('SELECT title FROM Exercises WHERE id=7')).title, 'Pull-up');
    db.sqlite.exec('DROP TRIGGER fail_delete');
    await deleteExercise(db, 7);
    await assert.rejects(deleteExercise(db, 7), /no longer exists/);
    await assert.rejects(deleteExercise(null, 7), /not ready/);
});

test('profile patches preserve untouched persisted fields, including changes newer than a draft', async t => {
    const db = await fixture();
    t.after(() => db.sqlite.close());
    const first = await saveProfileChanges(db, 1, { username: 'new name' });
    assert.equal(first.user.username, 'new name');
    assert.equal(first.stats.height, '70');
    assert.equal(first.stats.weight, '180');
    assert.equal(first.stats.goals, 'Keep going');
    const draft = { stats: { height: '71' } };
    db.sqlite.exec("UPDATE UserProfileStats SET weight='185', goals='Updated elsewhere' WHERE user_id=1");
    const second = await saveProfileChanges(db, 1, draft);
    assert.equal(second.user.username, 'new name');
    assert.equal(second.stats.height, '71');
    assert.equal(second.stats.weight, '185');
    assert.equal(second.stats.goals, 'Updated elsewhere');
    assert.equal(second.stats.bodyFat, '15');
    assert.equal(second.stats.favoriteExercise, 'Pull-up');
    assert.equal(second.stats.memberSince, '2020');
    // Explicitly clearing a field is different from not editing it.
    const cleared = await saveProfileChanges(db, 1, { stats: { goals: '' } });
    assert.equal(cleared.stats.goals, '');
    assert.equal(cleared.stats.weight, '185');
});

test('profile failure is atomic, retryable, and missing rows never report success', async t => {
    const db = await fixture();
    t.after(() => db.sqlite.close());
    db.sqlite.exec("CREATE TRIGGER fail_profile BEFORE UPDATE ON UserProfileStats BEGIN SELECT RAISE(ABORT,'injected failure'); END");
    const changes = { username: 'retry', stats: { height: '72' } };
    await assert.rejects(saveProfileChanges(db, 1, changes), /injected failure/);
    assert.equal((await db.getFirstAsync('SELECT username FROM Users')).username, 'saved');
    assert.equal((await db.getFirstAsync('SELECT height FROM UserProfileStats')).height, '70');
    db.sqlite.exec('DROP TRIGGER fail_profile');
    const saved = await saveProfileChanges(db, 1, changes);
    assert.equal(saved.user.username, 'retry');
    assert.equal(saved.stats.height, '72');
    db.sqlite.exec('DELETE FROM UserProfileStats');
    await assert.rejects(saveProfileChanges(db, 1, { username: 'not committed' }), /unavailable/);
    assert.equal((await db.getFirstAsync('SELECT username FROM Users')).username, 'retry');
    await assert.rejects(saveProfileChanges(db, 1, { stats: { user_id: '2' } }), /Invalid/);
});

test('same-connection profile/deletion transactions serialize and a failed write does not poison the queue', async t => {
    const db = await fixture();
    t.after(() => db.sqlite.close());
    db.sqlite.exec("CREATE TRIGGER fail_profile BEFORE UPDATE ON UserProfileStats BEGIN SELECT RAISE(ABORT,'injected failure'); END");
    const results = await Promise.allSettled([
        saveProfileChanges(db, 1, { username: 'rollback', stats: { height: '72' } }),
        deleteExercise(db, 7),
        saveProfileChanges(db, 1, { username: 'committed' }),
    ]);
    assert.deepEqual(results.map(result => result.status), ['rejected', 'fulfilled', 'fulfilled']);
    assert.equal((await db.getFirstAsync('SELECT username FROM Users')).username, 'committed');
    assert.equal((await db.getFirstAsync('SELECT COUNT(*) n FROM Exercises')).n, 0);
});

test('frequency builders distinguish unavailable from successful empty and populated results', () => {
    for (const builder of [buildLast7DaysFrequency, buildLast30DaysFrequency]) {
        for (const value of [null, undefined, {}]) assert.deepEqual(builder(value), []);
        const empty = builder([]);
        assert.ok(empty.length === 7 || empty.length === 30);
        assert.ok(empty.every(row => row.session_count === 0));
        const date = getLast7Days().at(-1);
        const populated = builder([{ workout_date: date, session_count: 2 }]);
        assert.equal(populated.find(row => row.workout_date === date).session_count, 2);
        assert.equal(populated.reduce((sum, row) => sum + row.session_count, 0), 2);
    }
});

test('frequency reads return empty only on success, never for a failed or invalid response', async t => {
    const db = await fixture();
    t.after(() => db.sqlite.close());
    db.sqlite.exec(`CREATE VIEW WorkoutFrequency AS
        SELECT user_id, date(start_time) workout_date, COUNT(*) session_count
        FROM WorkoutSessions GROUP BY user_id, date(start_time)`);
    assert.deepEqual(await getWorkoutFrequencyByUser(db, 2), []);
    const populated = await getWorkoutFrequencyByUser(db, 1);
    assert.equal(populated[0].session_count, 1);
    db.sqlite.exec('DROP VIEW WorkoutFrequency');
    await assert.rejects(getWorkoutFrequencyByUser(db, 1), /no such table/);
    await assert.rejects(getWorkoutFrequencyByUser({ getAllAsync: async () => null }, 1), /unavailable/);
});

test('Data renders loading/error without zero charts, and renders actual successful frequency', () => {
    // Use the existing SSR/transpile approach; native presentation is outside this test.
    const fs = require('node:fs');
    const path = require('node:path');
    const vm = require('node:vm');
    const ts = require('typescript');
    const React = require('react');
    const { renderToString } = require('react-dom/server');
    function load(relativePath, imports) {
        const code = ts.transpileModule(fs.readFileSync(require.resolve(path.join('..', ...relativePath)), 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
        }).outputText;
        const exports = {};
        vm.runInNewContext(code, {
            exports,
            require(id) {
                if (id === 'react') return React;
                if (id in imports) return imports[id];
                throw new Error(`Unexpected import: ${id}`);
            },
        });
        return exports;
    }
    const WorkoutContext = React.createContext({});
    const DataContext = React.createContext({});
    const useHookData = load(['hooks', 'profile', 'useHookData.ts'], {
        '@/contexts/WorkoutContext': { WorkoutContext },
        '@/contexts/DataContext': { DataContext },
        '@/utils/workoutUtils': require('../utils/workoutUtils.js'),
        '@/utils/dataCalculations': load(['utils', 'dataCalculations.ts'], {}),
    });
    const NativeView = ({ children }) => React.createElement('div', null, children);
    const chartRows = [];
    const Screen = load(['screens', 'profile', 'DataScreen.tsx'], {
        '@/hooks/profile/useHookData': useHookData,
        '@/contexts/DataContext': { DataContext },
        '@/components/Themed': { View: NativeView, Text: NativeView, ScrollView: NativeView },
        'react-native': { StyleSheet: { create: styles => styles }, RefreshControl: () => null, TouchableOpacity: NativeView },
        '@expo/vector-icons': { MaterialCommunityIcons: () => null },
        'expo-router': { useRouter: () => ({}) },
        '@/components/Data/DataHeader': ({ weeklyFrequency }) => {
            chartRows.push(weeklyFrequency);
            return React.createElement('div', null, 'Frequency chart');
        },
        '@/components/Data/WorkoutHistory': ({ data }) => {
            chartRows.push(data);
            return React.createElement('div', null, 'History chart');
        },
        ...Object.fromEntries([
            '@/components/Data/ExerciseAnalysis', '@/components/Data/FavoriteGraphs',
            '@/components/Data/FavoriteRoutines', '@/components/Data/MuscleGroupStats',
            '@/components/modals/ConfirmationModal', '@/components/modals/Data/AddFavoriteGraphModal',
            '@/components/modals/Workout/AddExerciseModal', '@/components/Title',
        ].map(id => [id, () => null])),
    }).default;
    function render(status, rows) {
        chartRows.length = 0;
        return renderToString(React.createElement(WorkoutContext.Provider, {
            value: { workoutFrequency: rows, frequencyStatus: status, frequencyError: 'Read failed' },
        }, React.createElement(DataContext.Provider, {
            value: { workoutCount: { total: 0 }, totalCaloriesBurned: 0 },
        }, React.createElement(Screen))));
    }
    assert.match(render('loading', null), /Loading workout frequency/);
    assert.equal(chartRows.length, 0);
    assert.match(render('error', []), /Read failed/);
    assert.equal(chartRows.length, 0);
    assert.match(render('ready', []), /Frequency chart/);
    assert.deepEqual(chartRows.map(rows => rows.length), [7, 30]);
    assert.ok(chartRows.flat().every(row => row.session_count === 0));
    const today = getLast7Days().at(-1);
    render('ready', [{ workout_date: today, session_count: 3 }]);
    assert.ok(chartRows.every(rows => rows.some(row => row.session_count === 3)));
});
