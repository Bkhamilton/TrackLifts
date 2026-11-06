/** Recorded exposure, not a validated pain/fatigue/recovery prediction. */
export const MODEL_VERSION = 'recorded-load-v1';
export const MAPPING_VERSION = 'catalog-v3-audited-scope-v1';
// Display conventions, NOT physiological constants. See the source-of-truth plan.
export const HALF_LIFE_HOURS = 48;
export const DISPLAY_SET_UNITS = 10;
export const loadValue = units => Math.max(0, Math.min(1, units / DISPLAY_SET_UNITS));
export const loadColor = value => {
    if (!Number.isFinite(value)) return '#9299a3';
    const v = Math.max(0, Math.min(1, value));
    return v <= 0.5 ? `rgb(${Math.round(50 + v * 410)}, 205, 50)`
        : `rgb(255, ${Math.round(205 - (v - 0.5) * 310)}, ${Math.round(50 - (v - 0.5) * 100)})`;
};
export function timestamp(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value)) return NaN;
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    const calendar = new Date(Date.UTC(year, month - 1, day));
    if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return NaN;
    return Date.parse(/[zZ]|[+-]\d{2}:\d{2}$/.test(value) ? value : value.replace(' ', 'T') + 'Z');
}
/** Pounds, preserving the app's entered per-dumbbell convention. */
export function effectiveResistance(weight, equipment, bodyMass = null) {
    if (!Number.isFinite(weight) || weight < 0) return null;
    if (equipment === 'Bodyweight' || equipment === 'Assisted Bodyweight') {
        if (!Number.isFinite(bodyMass) || bodyMass <= 0) return null;
        return equipment === 'Bodyweight' ? bodyMass + weight : Math.max(0, bodyMass - weight);
    }
    if (equipment === 'Resistance Band') return null;
    return weight;
}
export function calculateMuscleLoad({ muscles, mappings, sets, ratios, now = Date.now() }) {
    if (!Number.isFinite(now)) throw new Error('Invalid evaluation timestamp');
    const byExercise = new Map();
    const supported = new Set();
    for (const m of mappings) {
        if (!Number.isFinite(m.intensity) || m.intensity <= 0 || m.intensity > 1) continue;
        if (!byExercise.has(m.exercise_id)) byExercise.set(m.exercise_id, new Map());
        const exposure = byExercise.get(m.exercise_id);
        exposure.set(m.muscle_id, Math.max(exposure.get(m.muscle_id) ?? 0, m.intensity));
        supported.add(m.muscle_id);
    }
    const muscleMap = new Map(muscles.map(m => [m.muscle_id, {
        ...m, units: 0, value: supported.has(m.muscle_id) ? 0 : null,
        status: supported.has(m.muscle_id) ? 'no-recorded-exposure' : 'unsupported', limited: false, invalidInput: false,
    }]));
    const contributions = [];
    const issues = new Set();
    const seen = new Set();
    for (const set of sets) {
        if (seen.has(set.set_id)) continue;
        seen.add(set.set_id);
        if (set.completed !== 1 && set.completed !== true) continue;
        const exposure = byExercise.get(set.exercise_id);
        const markInvalid = () => {
            for (const [id] of exposure ?? []) {
                const muscle = muscleMap.get(id);
                if (muscle) { muscle.limited = true; muscle.invalidInput = true; }
            }
        };
        const start = timestamp(set.start_time), end = timestamp(set.end_time);
        if (!Number.isFinite(start) || start > now || (Number.isFinite(end) && (end < start || end > now))) {
            issues.add('Invalid or future workout timestamps excluded'); markInvalid(); continue;
        }
        const at = Number.isFinite(end) ? end : start;
        if (!exposure) { issues.add('Some exercises have no supported muscle mapping'); continue; }
        if (!Number.isFinite(set.reps) || set.reps <= 0 || !Number.isFinite(set.weight) || set.weight < 0) {
            issues.add('Invalid set inputs excluded');
            markInvalid();
            continue;
        }
        // No fake resistance or inferred effort. One valid performed set is one
        // exposure unit before mapping and time weighting, including bodyweight/holds.
        const residual = Math.pow(2, -(now - at) / 3600000 / HALF_LIFE_HOURS);
        if (residual < 1e-8) continue; // Numerical tail, not a calendar boundary.
        const legacy = set.completion_source !== 'confirmed';
        if (legacy) issues.add('Older logs have unverified set completion');
        if (!Number.isFinite(end)) issues.add('Some older workouts use start time because finish time is unavailable');
        for (const [id, coefficient] of exposure) {
            const muscle = muscleMap.get(id);
            if (!muscle) continue;
            const units = coefficient * residual;
            muscle.units += units;
            muscle.limited ||= legacy;
            contributions.push({ ...set, muscle_id: id, muscle_group: muscle.muscle_group, units, at });
        }
    }
    const individual = [...muscleMap.values()].map(m => ({ ...m,
        value: m.status === 'unsupported' || m.invalidInput ? null : loadValue(m.units),
        status: m.status === 'unsupported' ? 'unsupported' : m.limited ? 'limited-data' : m.units > 0 ? 'recorded-exposure' : 'no-recorded-exposure',
    }));
    const groups = [...new Set(individual.map(m => m.muscle_group))].map(name => {
        const members = individual.filter(m => m.muscle_group === name);
        const weights = ratios.find(r => r.muscle_group === name)?.muscles || [];
        const active = members.filter(m => m.status !== 'unsupported');
        const denominator = active.reduce((s, m) => s + (weights.find(w => w.name === m.muscle_name)?.ratio || 0), 0);
        const weighted = m => denominator > 0 ? (weights.find(w => w.name === m.muscle_name)?.ratio || 0) / denominator : 0;
        const units = denominator > 0 ? active.reduce((s, m) => s + m.units * weighted(m), 0) : null;
        const value = units === null || active.some(m => m.invalidInput) ? null : loadValue(units);
        const exerciseMap = new Map();
        for (const c of contributions.filter(c => c.muscle_group === name)) {
            const muscle = members.find(m => m.muscle_id === c.muscle_id);
            const key = `${c.session_id}:${c.session_exercise_id}`;
            if (!exerciseMap.has(key)) exerciseMap.set(key, { name: c.exercise_name, routine: c.routine_title || 'Custom Workout', date: new Date(c.at).toISOString(), sets: new Map(), units: 0 });
            const entry = exerciseMap.get(key);
            entry.sets.set(c.set_id, c);
            entry.units += c.units * weighted(muscle);
        }
        const exercises = [...exerciseMap.values()].sort((a, b) => b.units - a.units).map(e => ({
            name: e.name, routine: e.routine, date: e.date, sets: e.sets.size,
            reps: Math.round([...e.sets.values()].reduce((s, c) => s + c.reps, 0) / e.sets.size),
            weight: 'See log', units: e.units,
            contribution: units > 0 ? `${Math.round(e.units / units * 100)}%` : '0%',
        }));
        return { muscle_group: name, muscle_group_id: members[0].muscle_group_id,
            units, weighted_soreness: value, value, coverage: denominator,
            unsupported: members.filter(m => m.status === 'unsupported').map(m => m.muscle_name),
            peak: active.slice().sort((a, b) => b.units - a.units)[0] || null,
            muscles: members, exercises,
            status: denominator === 0 ? 'unsupported' : value === null ? 'limited-data' : members.some(m => m.limited) || denominator < 0.999 ? 'limited-data' : units > 0 ? 'recorded-exposure' : 'no-recorded-exposure',
        };
    });
    return { modelVersion: MODEL_VERSION, mappingVersion: MAPPING_VERSION, evaluatedAt: now, groups, issues: [...issues] };
}
