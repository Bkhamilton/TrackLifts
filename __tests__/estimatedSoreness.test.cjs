const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calculateEstimatedSoreness, estimateSetDose, sorenessResponse, sorenessScore, resistanceIndex } = require('../utils/sorenessModel.js');
const { DatabaseSync } = require('node:sqlite');
const { migrateRecordedLoad } = require('../api/migrateRecordedLoad.js');
const { insertRecordedExercises } = require('../db/workout/recordedWork.js');
const { getMuscleLoadSnapshot } = require('../db/data/MuscleLoad.js');
const at = Date.parse('2026-10-30T12:00:00Z'), H = 3600000, D = 24*H;
const muscles = [
 {muscle_id:1, muscle_name:'Lats', muscle_group:'Back', muscle_group_id:1},
 {muscle_id:2, muscle_name:'Lower Traps', muscle_group:'Back', muscle_group_id:1},
 {muscle_id:3, muscle_name:'Unmapped', muscle_group:'Back', muscle_group_id:1},
];
const mappings = [{exercise_id:1,muscle_id:1,intensity:1},{exercise_id:1,muscle_id:2,intensity:.2}];
const ratios = [{muscle_group:'Back',muscles:[{name:'Lats',ratio:.4},{name:'Lower Traps',ratio:.4},{name:'Unmapped',ratio:.2}]}];
const event = (id, patch={}) => ({set_id:id,session_id:1,session_exercise_id:1,exercise_id:1,exercise_name:'Pull-Up',equipment:'Bodyweight',completed:1,completion_source:'confirmed',reps:8,weight:0,body_mass_lbs:180,rir:1,start_time:new Date(at-H).toISOString(),end_time:new Date(at).toISOString(),...patch});
const sets = (count=4, patch={}) => Array.from({length:count}, (_,i)=>event(i+1,patch));
const run = (s=sets(),hours=42,extra={}) => calculateEstimatedSoreness({muscles,mappings,ratios,sets:s,now:at+hours*H,...extra});
const primary = r => r.groups[0].muscles[0];
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-9, `${a} != ${b}`);
test('unweighted bodyweight and assisted sets produce visible current and delayed soreness', () => {
 for(const patch of [{weight:0},{equipment:'Assisted Bodyweight',weight:60},{equipment:'Assisted Bodyweight',weight:-60},{body_mass_lbs:null},{equipment:'Assisted Bodyweight',body_mass_lbs:null}]) {
  assert.ok(primary(run(sets(4,patch),0)).value>0);
  assert.ok(primary(run(sets(4,patch))).value>.2);
 }
 assert.ok(primary(run(sets(4,{body_mass_lbs:null}))).reasons.some(s=>s.includes('body mass')));
});
test('assistance subtracts load, including legacy signed assistance; missing mass is never guessed', () => {
 assert.equal(resistanceIndex(event(1,{equipment:'Assisted Bodyweight',weight:60})),120);
 assert.equal(resistanceIndex(event(1,{equipment:'Assisted Bodyweight',weight:-60})),120);
 assert.equal(resistanceIndex(event(1,{equipment:'Assisted Bodyweight',weight:100})),80);
 assert.equal(resistanceIndex(event(1,{body_mass_lbs:null})),null);
 assert.equal(resistanceIndex(event(1,{weight:20})),200);
});
test('effort, warm-ups and rep exposure affect dose; cold start does not max out', () => {
 const easy=primary(run(sets(4,{rir:5}))).value;
 const hard=primary(run(sets(4,{rir:0}))).value;
 assert.ok(hard>easy*1.5); assert.ok(hard<.8);
 assert.ok(primary(run(sets(4,{rir:0,is_warmup:1}))).value < hard/3);
 assert.ok(primary(run(sets(4,{reps:12,rir:1}))).value>primary(run(sets(4,{reps:3,rir:1}))).value);
 assert.ok(primary(run(sets(1))).value < primary(run(sets(4))).value);
});
test('delayed component peaks within 24–72h then resolves smoothly', () => {
 const hours=Array.from({length:193},(_,i)=>i);
 for(const peak of [32,42,48]) {
  const peakHour=hours.reduce((best,h)=>sorenessResponse(h,peak).delayed>sorenessResponse(best,peak).delayed?h:best,0);
  assert.ok(peakHour>=24 && peakHour<=72);
  assert.ok(sorenessResponse(168,peak).total < .04);
  assert.equal(sorenessResponse(-1,peak).total,0);
 }
 const curve=hours.map(h=>primary(run(sets(),h)).value);
 assert.ok(curve[36]>curve[0]*4 && curve[36]>curve[12]);
 assert.ok(curve[120]<curve[72] && curve[168]<.02);
 assert.ok(Math.abs(primary(run(sets(),168-1e-5)).value-primary(run(sets(),168+1e-5)).value)<1e-5);
});
test('forecast prevents immediate low soreness from looking like completed recovery', () => {
 const group=run(sets(),0).groups[0];
 assert.ok(group.forecast48>group.value+.15);
 assert.ok(primary(run(sets(),120)).forecast48<=primary(run(sets(),120)).value+1e-9);
});
test('same movement familiarity attenuates a later bout; warmups alone do not create adaptation', () => {
 const older=sets(4,{session_id:2,session_exercise_id:2,start_time:new Date(at-14*D-H).toISOString(),end_time:new Date(at-14*D).toISOString()}).map((s,i)=>({...s,set_id:100+i}));
 const novel=primary(run()).value;
 const familiar=primary(run([...older,...sets()])).value;
 assert.ok(familiar<novel);
 const warmupHistory=older.map(s=>({...s,is_warmup:1}));
 assert.ok(primary(run([...warmupHistory,...sets()])).value>familiar);
});
test('earlier comparable resistance changes inferred effort, more assistance does not increase soreness', () => {
 const old=sets(4,{session_id:2,session_exercise_id:2,equipment:'Assisted Bodyweight',weight:30,rir:1,start_time:new Date(at-14*D-H).toISOString(),end_time:new Date(at-14*D).toISOString()}).map((s,i)=>({...s,set_id:100+i}));
 const highResistance=primary(run([...old,...sets(4,{equipment:'Assisted Bodyweight',weight:30,rir:null})])).value;
 const lowResistance=primary(run([...old,...sets(4,{equipment:'Assisted Bodyweight',weight:90,rir:null})])).value;
 assert.ok(highResistance>lowResistance);
 assert.ok(estimateSetDose(event(1,{equipment:'Barbell',weight:100,rir:null}),200).dose < estimateSetDose(event(1,{equipment:'Barbell',weight:180,rir:null}),200).dose);
});
test('missing effort gives an explicit fallback, not zero or invented certainty', () => {
 const muscle=primary(run(sets(4,{rir:null})));
 assert.ok(muscle.value>0); assert.equal(muscle.confidence,'limited');
 assert.ok(muscle.reasons.some(r=>r.includes('Effort assumed')));
 const band=estimateSetDose(event(1,{equipment:'Resistance Band',weight:0,rir:1}));
 assert.ok(band.dose>0); assert.equal(band.capacity,null);
});
test('holds use seconds, no fake 1RM and no reinterpretation of legacy repetitions', () => {
 const short=estimateSetDose(event(1,{exercise_name:'Plank',duration_seconds:10,reps:0}));
 const long=estimateSetDose(event(1,{exercise_name:'Plank',duration_seconds:60,reps:0}));
 assert.ok(long.dose>short.dose); assert.equal(long.capacity,null);
 const unknown=estimateSetDose(event(1,{exercise_name:'Plank',duration_seconds:null,reps:100}));
 assert.ok(unknown.reasons.some(r=>r.includes('duration unknown')));
 assert.ok(primary(run(sets(4,{exercise_name:'Plank',duration_seconds:30,reps:0}))).value>0);
});
test('later records and future workouts do not change an earlier prediction', () => {
 const before=primary(run()).value;
 const future=event(100,{session_id:2,session_exercise_id:2,weight:10000,start_time:new Date(at+10*D).toISOString(),end_time:new Date(at+10*D+H).toISOString()});
 close(primary(run([...sets(),future])).value,before);
 close(primary(run(sets(4,{estimated_1rm:100000}))).value,before);
});
test('one bad historical record cannot dominate a robust recent reference', () => {
 const history=[];
 for(let n=1;n<=5;n++) history.push(...sets(3,{session_id:100+n,session_exercise_id:100+n,equipment:'Barbell',weight:n===1?10000:100,rir:1,start_time:new Date(at-n*7*D-H).toISOString(),end_time:new Date(at-n*7*D).toISOString()}).map((s,i)=>({...s,set_id:100+n*10+i})));
 const current=sets(4,{equipment:'Barbell',weight:100,rir:null});
 const normal=history.map(s=>({...s,weight:100}));
 close(primary(run([...history,...current])).value,primary(run([...normal,...current])).value);
});
test('duplicate mappings and multi-muscle joins count each set only once in explanations', () => {
 const group=run(sets(),42,{mappings:[...mappings,mappings[0]]}).groups[0];
 assert.equal(group.exercises.length,1); assert.equal(group.exercises[0].sets,4);
 close(group.exercises[0].score,group.value); assert.equal(group.exercises[0].contribution,'100%');
 assert.ok(group.muscles[0].value>group.muscles[1].value);
});
test('all displayed group contributions sum exactly after nonlinear scoring and peak blending', () => {
 const second=sets(3,{session_id:2,session_exercise_id:2,start_time:new Date(at-24*H-H).toISOString(),end_time:new Date(at-24*H).toISOString()}).map((s,i)=>({...s,set_id:100+i}));
 const group=run([...sets(),...second]).groups[0];
 close(group.exercises.reduce((n,e)=>n+e.score,0),group.value);
 assert.equal(group.unsupported[0],'Unmapped'); assert.equal(group.muscles[2].value,null);
 assert.ok(group.peak.value>=group.value);
});
test('no history, invalid input, incomplete sets and future timestamps are distinct', () => {
 assert.equal(primary(run([])).status,'no-recent-training');
 assert.equal(primary(run(sets(4,{completed:0}))).value,0);
 for(const patch of [{weight:NaN},{reps:Infinity},{start_time:'invalid'},{weight:-10,equipment:'Barbell'}]) {
  const result=run(sets(4,patch)); assert.equal(primary(result).value,null); assert.ok(result.issues.length);
 }
 assert.ok(sorenessScore(0)===0 && sorenessScore(1e6)<=1);
});
test('future evaluation follows elapsed time and output is independent of input order', () => {
 const a=run(sets()),b=run(sets().reverse());
 close(a.groups[0].value,b.groups[0].value);
 assert.equal(a.modelVersion,'estimated-soreness-v1');
 assert.equal(a.evaluatedAt,at+42*H);
});
async function dbFixture() {
 const sql=new DatabaseSync(':memory:');
 const db={execAsync:async s=>sql.exec(s),runAsync:async(s,p=[])=>{const r=sql.prepare(s).run(...p.map(v=>typeof v==='boolean'?Number(v):v));return {...r,lastInsertRowId:Number(r.lastInsertRowid)};},getAllAsync:async(s,p=[])=>sql.prepare(s).all(...p)};
 sql.exec(`CREATE TABLE MuscleGroups(id INTEGER PRIMARY KEY,name TEXT); CREATE TABLE Muscles(id INTEGER PRIMARY KEY,name TEXT,muscle_group_id INTEGER);
 CREATE TABLE Equipment(id INTEGER PRIMARY KEY,name TEXT); CREATE TABLE Exercises(id INTEGER PRIMARY KEY,title TEXT,equipment_id INTEGER);
 CREATE TABLE ExerciseMuscles(exercise_id INTEGER,muscle_id INTEGER,intensity REAL); CREATE TABLE Routines(id INTEGER PRIMARY KEY,title TEXT);
 CREATE TABLE WorkoutSessions(id INTEGER PRIMARY KEY,user_id INTEGER,start_time TEXT,end_time TEXT,routine_id INTEGER);
 CREATE TABLE SessionExercises(id INTEGER PRIMARY KEY,session_id INTEGER,exercise_id INTEGER);
 CREATE TABLE SessionSets(id INTEGER PRIMARY KEY,session_exercise_id INTEGER,set_order INTEGER,weight REAL,reps INTEGER,estimated_1rm REAL,completed INTEGER,rest_time INTEGER);
 INSERT INTO MuscleGroups VALUES(1,'Back'); INSERT INTO Muscles VALUES(1,'Lats',1),(2,'Lower Traps',1),(3,'Unmapped',1);
 INSERT INTO Equipment VALUES(1,'Bodyweight'); INSERT INTO Exercises VALUES(1,'Pull-Up',1),(2,'Plank',1);
 INSERT INTO ExerciseMuscles VALUES(1,1,1),(1,2,.2),(2,1,1);
 INSERT INTO WorkoutSessions VALUES(1,1,'2026-10-30T11:00:00Z','2026-10-30T12:00:00Z',NULL);`);
 await migrateRecordedLoad(db); return {sql,db};
}
test('actual SQLite persistence carries effort, warm-up, hold duration and historical mass into the active model', async () => {
 const {sql,db}=await dbFixture(); await migrateRecordedLoad(db);
 await insertRecordedExercises(db,1,[{id:1,title:'Pull-Up',equipment:'Bodyweight',sets:[{weight:0,reps:8,rir:1,is_warmup:0,completed:true},{weight:0,reps:8,rir:5,is_warmup:1,completed:true}]}],180);
 const stored=sql.prepare('SELECT * FROM SessionSets ORDER BY id').all();
 assert.equal(stored[0].rir,1);assert.equal(stored[1].is_warmup,1);assert.equal(stored[0].body_mass_lbs,180);
 const snapshot=await getMuscleLoadSnapshot(db,1,ratios,at+42*H);assert.ok(primary(snapshot).value>0);assert.equal(snapshot.modelVersion,'estimated-soreness-v1');
 await insertRecordedExercises(db,1,[{id:2,title:'Plank',equipment:'Bodyweight',sets:[{weight:0,reps:0,rir:3,duration_seconds:45,completed:true}]}],180);
 const hold=sql.prepare('SELECT * FROM SessionSets ORDER BY id DESC LIMIT 1').get();assert.equal(hold.duration_seconds,45);assert.equal(hold.estimated_1rm,null);
 sql.close();
});
test('legacy migration leaves effort, warm-up and duration unknown; edits retain those values', async () => {
 const {sql,db}=await dbFixture();
 sql.exec("INSERT INTO SessionExercises VALUES(1,1,1); INSERT INTO SessionSets(session_exercise_id,set_order,weight,reps,completed) VALUES(1,1,0,8,1)");
 const row=sql.prepare('SELECT * FROM SessionSets').get();assert.equal(row.rir,null);assert.equal(row.duration_seconds,null);assert.equal(row.completion_source,'legacy-unknown');
 await insertRecordedExercises(db,1,[{id:1,title:'Pull-Up',equipment:'Bodyweight',sets:[row]}],250,true);
 const edited=sql.prepare('SELECT * FROM SessionSets ORDER BY id DESC LIMIT 1').get();assert.equal(edited.body_mass_lbs,null);assert.equal(edited.rir,null);
 assert.ok(primary(await getMuscleLoadSnapshot(db,1,ratios,at+42*H)).value>0);sql.close();
});

test('new and edited hold saves reject nonfinite/nonpositive durations while preserving unknown legacy duration', async () => {
 const {sql,db}=await dbFixture();
 for(const editing of [false,true]) for(const duration of [Infinity,NaN,-1,0]) {
  await assert.rejects(insertRecordedExercises(db,1,[{id:2,title:'Plank',equipment:'Bodyweight',sets:[{weight:0,reps:0,duration_seconds:duration,completed:true}]}],180,editing), /positive repetitions/);
 }
 await assert.rejects(insertRecordedExercises(db,1,[{id:2,title:'Plank',equipment:'Bodyweight',sets:[{weight:0,reps:0,completed:true}]}],180), /positive repetitions/);
 await insertRecordedExercises(db,1,[{id:2,title:'Plank',equipment:'Bodyweight',sets:[{weight:0,reps:12,completed:true}]}],180,true);
 const saved=sql.prepare('SELECT * FROM SessionSets').get(); assert.equal(saved.duration_seconds,null); assert.equal(saved.reps,12);sql.close();
});
