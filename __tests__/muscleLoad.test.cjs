const { test } = require('node:test');
const assert = require('node:assert/strict');
const { DatabaseSync } = require('node:sqlite');
const { calculateMuscleLoad, effectiveResistance, timestamp, loadValue, loadColor } = require('../utils/muscleLoadModel.js');
const { migrateRecordedLoad } = require('../api/migrateRecordedLoad.js');
const { getMuscleLoadSnapshot } = require('../db/data/MuscleLoad.js');
const { insertRecordedExercises, rebuildExerciseRecords, validateWorkoutTimes } = require('../db/workout/recordedWork.js');
const { workoutDuration, finishFromDuration } = require('../utils/workoutDuration.js');
const { createGeneralTables, createUserTables, createWorkoutTables } = require('../api/createTables.js');
const now = Date.parse('2026-11-06T12:00:00Z');
const muscles = [
    { muscle_id: 1, muscle_name: 'Primary', muscle_group_id: 1, muscle_group: 'Group' },
    { muscle_id: 2, muscle_name: 'Secondary', muscle_group_id: 1, muscle_group: 'Group' },
    { muscle_id: 3, muscle_name: 'Unmapped', muscle_group_id: 1, muscle_group: 'Group' },
];
const ratios = [{ muscle_group: 'Group', muscles: [{ name: 'Primary', ratio: .5 }, { name: 'Secondary', ratio: .3 }, { name: 'Unmapped', ratio: .2 }] }];
const mappings = [{ exercise_id: 1, muscle_id: 1, intensity: 1 }, { exercise_id: 1, muscle_id: 2, intensity: .5 }];
const event = (id, patch = {}) => ({ set_id: id, session_id: id, session_exercise_id: id, exercise_id: 1, exercise_name: 'Pull-up', completed: 1, completion_source: 'confirmed', reps: 10, weight: 0, start_time: '2026-11-06T11:00:00Z', end_time: '2026-11-06T12:00:00Z', ...patch });
const model = (sets, extra = {}) => calculateMuscleLoad({ muscles, mappings, ratios, sets, now, ...extra });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
function adapter() {
    const sqlite = new DatabaseSync(':memory:');
    sqlite.exec('PRAGMA foreign_keys=ON');
    const args = values => values.map(v => typeof v === 'boolean' ? Number(v) : v);
    return { sqlite,
        execAsync: async sql => sqlite.exec(sql),
        runAsync: async (sql, values = []) => { const r = sqlite.prepare(sql).run(...args(values)); return { ...r, lastInsertRowId: Number(r.lastInsertRowid) }; },
        getAllAsync: async (sql, values = []) => sqlite.prepare(sql).all(...args(values)),
        getFirstAsync: async (sql, values = []) => sqlite.prepare(sql).get(...args(values)),
    };
}
async function database() {
    const db = adapter();
    await createGeneralTables(db); await createUserTables(db); await createWorkoutTables(db);
    db.sqlite.exec(`INSERT INTO Users (id,username,name,password) VALUES (1,'test','Test','x'), (2,'other','Other','x');
        INSERT INTO MuscleGroups VALUES (1,'Group');
        INSERT INTO Muscles VALUES (1,'Primary',1),(2,'Secondary',1),(3,'Unmapped',1);
        INSERT INTO Equipment VALUES (1,'Bodyweight');
        INSERT INTO Exercises VALUES (1,'Pull-up',1,1);
        INSERT INTO ExerciseMuscles VALUES (1,1,1,1),(2,1,2,.5);
        INSERT INTO WorkoutSessions (id,user_id,start_time,end_time) VALUES (1,1,'2026-11-05T11:00:00Z','2026-11-05T12:00:00Z');`);
    await migrateRecordedLoad(db);
    return db;
}
test('zero-added bodyweight work, cold start and secondary coefficients', () => {
    const group = model([event(1)]).groups[0];
    assert.equal(group.muscles[0].units, 1);
    assert.equal(group.muscles[1].units, .5);
    assert.ok(group.value > 0 && group.value < 1);
    assert.ok(model(Array.from({length: 6}, (_,i) => event(i))).groups[0].value > group.value);
});
test('no invented body mass, assistance decreases resistance, units and dumbbell convention preserved', () => {
    assert.equal(effectiveResistance(0, 'Bodyweight'), null);
    assert.equal(effectiveResistance(0, 'Bodyweight', 180), 180);
    assert.equal(effectiveResistance(20, 'Bodyweight', 180), 200);
    assert.equal(effectiveResistance(20, 'Assisted Bodyweight', 180), 160);
    assert.equal(effectiveResistance(80, 'Assisted Bodyweight', 180), 100);
    assert.equal(effectiveResistance(200, 'Assisted Bodyweight', 180), 0);
    assert.equal(effectiveResistance(40, 'Dumbbell'), 40);
    assert.equal(effectiveResistance(-1, 'Barbell'), null);
    assert.equal(effectiveResistance(NaN, 'Barbell'), null);
    assert.equal(model([event(1, {weight: 20})]).groups[0].units, model([event(1, {weight: 80})]).groups[0].units);
});
test('planned sets excluded; legacy completion explicit; no exposure is not unsupported', () => {
    const result = model([event(1, {completed: 0}), event(2, {completion_source: 'legacy-unknown'})]);
    assert.equal(result.groups[0].muscles[0].units, 1);
    assert.equal(result.groups[0].status, 'limited-data');
    assert.ok(result.issues.some(i => i.includes('unverified')));
    assert.equal(result.groups[0].muscles[2].value, null);
    assert.equal(model([]).groups[0].muscles[0].status, 'no-recorded-exposure');
    assert.equal(loadColor(null), '#9299a3');
});
test('smooth elapsed-time decay, no midnight/7-day cliff, legacy duration fallback, future/invalid dates', () => {
    const base = model([event(1)]).groups[0].units;
    close(model([event(1)], {now: now + 48*3600000}).groups[0].units, base / 2);
    const before = model([event(1)], {now: now + 168*3600000 - 1}).groups[0].units;
    const after = model([event(1)], {now: now + 168*3600000 + 1}).groups[0].units;
    assert.ok(after > 0 && Math.abs(before-after) < 1e-6);
    assert.equal(model([event(1, {start_time: 'bad'})]).groups[0].units, 0);
    assert.equal(model([event(1, {end_time:'2027-01-01T00:00:00Z'})]).groups[0].units, 0);
    assert.ok(model([event(1, {end_time:'01:00:00'})]).issues.length);
    assert.ok(Number.isNaN(timestamp('2026-02-30T12:00:00Z')));
    assert.equal(timestamp('2026-11-06 12:00:00'), now);
    assert.equal(timestamp('2026-11-06T07:00:00-05:00'), now);
});
test('invalid inputs cannot produce NaN, infinity or saturation', () => {
    for (const patch of [{weight:Infinity}, {reps:NaN}, {reps:0}, {weight:-1}]) {
        const r = model([event(1, patch)]);
        assert.equal(r.groups[0].units, 0); assert.ok(r.issues.length);
        assert.equal(r.groups[0].value, null);
    }
    assert.equal(loadValue(0), 0); assert.equal(loadValue(10), 1); assert.equal(loadValue(100), 1);
});
test('explanations deduplicate sets, include all sessions and sum to group dose', () => {
    const r = model([event(1), event(2), event(1)], {mappings: [...mappings, mappings[0]]}).groups[0];
    assert.equal(r.exercises.length, 2);
    assert.equal(r.exercises.reduce((n,e) => n+e.sets, 0), 2);
    close(r.exercises.reduce((n,e) => n+e.units, 0), r.units);
    assert.equal(r.exercises[0].contribution, '50%');
    close(r.value, loadValue(r.units));
    assert.equal(r.coverage, .8);
    assert.equal(r.peak.muscle_name, 'Primary');
});
test('migration preserves legacy rows and IDs, is repeatable, never fabricates provenance', async () => {
    const db = adapter(); await createGeneralTables(db); await createUserTables(db); await createWorkoutTables(db);
    db.sqlite.exec('PRAGMA foreign_keys=OFF; INSERT INTO SessionSets (id,session_exercise_id,set_order,weight,reps) VALUES (42,1,1,0,8)');
    await migrateRecordedLoad(db); await migrateRecordedLoad(db);
    const row = db.sqlite.prepare('SELECT * FROM SessionSets').get();
    assert.equal(row.id, 42); assert.equal(row.weight, 0);
    assert.equal(row.completion_source, 'legacy-unknown'); assert.equal(row.body_mass_lbs, null);
    db.sqlite.close();
});
test('actual SQLite save/read/edit/delete replay and user isolation', async () => {
    const db = await database();
    const exercises = [{ id:1, equipment:'Bodyweight', sets:[{weight:0,reps:8,completed:true},{weight:100,reps:10,completed:false}] }];
    await insertRecordedExercises(db, 1, exercises, 180); await rebuildExerciseRecords(db, 1);
    const row = db.sqlite.prepare('SELECT * FROM SessionSets').get();
    assert.equal(row.body_mass_lbs, 180); assert.equal(row.completion_source, 'confirmed'); assert.equal(row.estimated_1rm, 228);
    assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM SessionSets').get().n, 1);
    let snapshot = await getMuscleLoadSnapshot(db,1,ratios,now);
    assert.ok(snapshot.groups[0].value > 0);
    assert.equal((await getMuscleLoadSnapshot(db,2,ratios,now)).groups[0].value, 0);
    // Editing preserves the workout's body mass; no current profile weight enters.
    db.sqlite.exec('DELETE FROM SessionSets; DELETE FROM SessionExercises');
    await insertRecordedExercises(db, 1, [{id:1,equipment:'Bodyweight',sets:[{...row,reps:4}]}], 250, true);
    await rebuildExerciseRecords(db,1);
    assert.equal(db.sqlite.prepare('SELECT body_mass_lbs FROM SessionSets').get().body_mass_lbs, 180);
    assert.equal(db.sqlite.prepare('SELECT MAX(one_rep_max) n FROM ExerciseMaxHistory').get().n, 204);
    db.sqlite.exec('DELETE FROM SessionSets; DELETE FROM SessionExercises; DELETE FROM WorkoutSessions');
    await rebuildExerciseRecords(db,1);
    assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM ExerciseMaxHistory').get().n, 0);
    assert.equal((await getMuscleLoadSnapshot(db,1,ratios,now)).groups[0].value, 0);
    db.sqlite.close();
});
test('failed set writes roll back without partial exercises/records', async () => {
    const db = await database();
    await db.runAsync('BEGIN TRANSACTION');
    await assert.rejects(insertRecordedExercises(db, 1, [{id:1,equipment:'Barbell',sets:[{weight:50,reps:10,completed:true},{weight:-1,reps:10,completed:true}]}]), /non-negative/);
    await db.runAsync('ROLLBACK');
    assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM SessionSets').get().n, 0);
    assert.equal(db.sqlite.prepare('SELECT COUNT(*) n FROM SessionExercises').get().n, 0);
    db.sqlite.close();
});
test('timestamps and duration edits preserve old logs and new finish timestamps', () => {
    assert.equal(workoutDuration('2026-11-05T11:00:00Z','2026-11-05T12:00:00Z'), '01:00:00');
    assert.equal(workoutDuration('2026-11-05T11:00:00Z','00:45:00'), '00:45:00');
    assert.equal(finishFromDuration('2026-11-05T11:00:00Z','01:00:00'), '2026-11-05T12:00:00.000Z');
    assert.throws(() => finishFromDuration('bad','01:00:00'));
    assert.throws(() => validateWorkoutTimes('2026-11-05T12:00:00Z','2026-11-05T11:00:00Z'));
});

test('catalog coverage is explicit and coefficient identities are valid', () => {
    const catalog = require('../data/NewExercises.json');
    const definitions = require('../data/NewMuscles.json');
    const names = new Set(definitions.map(m => m.name));
    const mapped = new Set();
    for (const exercise of catalog) {
        const seen = new Set();
        for (const m of exercise.muscles) {
            assert.ok(names.has(m.name)); assert.ok(m.value > 0 && m.value <= 1);
            assert.ok(!seen.has(m.name)); seen.add(m.name); mapped.add(m.name);
        }
    }
    assert.deepEqual([...names].filter(n => !mapped.has(n)).sort(), ['Abductors','Deep Core','Middle Traps','Serratus','Teres']);
});
test('a later record or outlier weight cannot rewrite earlier set exposure', () => {
    const base = model([event(1)]);
    const laterRecord = model([event(1, {estimated_1rm: 100000, weight: 10000})]);
    assert.equal(base.groups[0].units, laterRecord.groups[0].units);
    assert.equal(base.modelVersion, 'recorded-load-v1');
    assert.equal(base.mappingVersion, 'catalog-v3-audited-scope-v1');
});
test('migration failure is atomic', async () => {
    const db = adapter(); await createWorkoutTables(db);
    const exec = db.execAsync;
    db.execAsync = async sql => { if (sql.includes('body_mass_lbs')) throw new Error('disk full'); return exec(sql); };
    await assert.rejects(migrateRecordedLoad(db), /disk full/);
    assert.ok(!db.sqlite.prepare('PRAGMA table_info(SessionSets)').all().some(c => c.name === 'completion_source'));
    db.sqlite.close();
});
test('workout reads wait for writes and a failed write does not poison the queue', async () => {
    const { withWorkoutDataLock } = require('../utils/workoutDataLock.js');
    const db = {};
    let release;
    const barrier = new Promise(resolve => { release = resolve; });
    const order = [];
    const write = withWorkoutDataLock(db, async () => { order.push('write'); await barrier; order.push('commit'); });
    const read = withWorkoutDataLock(db, async () => { order.push('read'); });
    await Promise.resolve(); await Promise.resolve();
    assert.deepEqual(order, ['write']); release(); await Promise.all([write,read]);
    assert.deepEqual(order, ['write','commit','read']);
    await assert.rejects(withWorkoutDataLock(db, () => { throw new Error('rollback'); }), /rollback/);
    assert.equal(await withWorkoutDataLock(db, () => 42), 42);
});
