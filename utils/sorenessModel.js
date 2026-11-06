import { timestamp, loadColor } from './muscleLoadModel.js';

export const SORENESS_MODEL_VERSION = 'estimated-soreness-v1';
export const SORENESS_MAPPING_VERSION = 'catalog-v3-deduplicated-v1';
export const sorenessColor = loadColor;
export const HOLD_EXERCISES = ['Plank', 'Side Plank', 'Hollow Body Hold', 'Wall Sit'];
export const isHoldExercise = title => HOLD_EXERCISES.includes(title);
const HOUR = 3600000;
const DAY = 24 * HOUR;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const numeric = n => typeof n === 'number' && Number.isFinite(n);
export const sorenessScore = dose => -Math.expm1(-Math.max(0, dose) / 6);
export const sorenessLabel = value => !numeric(value) ? 'Unavailable'
    : value < .1 ? 'Minimal' : value < .3 ? 'Mild' : value < .6 ? 'Moderate' : 'High';

/** Bodyweight is an exercise-specific resistance INDEX, not measured muscle force.
 * Only comparable within the same exercise/equipment. Missing old body mass is
 * never reconstructed from today's profile. Negative legacy assistance is a magnitude.
 */
export function resistanceIndex(set) {
    if (!numeric(set.weight)) return null;
    if (set.equipment === 'Bodyweight' || set.equipment === 'Assisted Bodyweight') {
        if (!numeric(set.body_mass_lbs) || set.body_mass_lbs <= 0) return null;
        const index = set.equipment === 'Assisted Bodyweight'
            ? set.body_mass_lbs - Math.abs(set.weight) : set.body_mass_lbs + set.weight;
        return index > 0 ? index : null;
    }
    if (set.equipment === 'Resistance Band') return null;
    return set.weight > 0 ? set.weight : null;
}

/** Evidence informs curve shape; every numerical coefficient is a tunable heuristic. */
export function sorenessResponse(hours, peakHours = 42) {
    if (!numeric(hours) || hours < 0) return { acute: 0, delayed: 0, total: 0 };
    const peak = clamp(peakHours, 24, 60);
    const x = Math.max(0, hours - 4) / (peak - 4);
    const delayed = x > 0 ? Math.exp(3 * (Math.log(x) + 1 - x)) : 0;
    // Small short-lived post-exercise discomfort, distinct from delayed DOMS.
    const acute = .12 * Math.exp(-hours / 8);
    return { acute, delayed, total: acute + delayed };
}

const effortWeight = rir => .3 + .9 * Math.exp(-clamp(rir, 0, 8) / 3);
function robustReference(history, start) {
    const values = history.filter(h => h.at < start && start - h.at <= 42 * DAY && h.capacity > 0)
        .map(h => h.capacity).sort((a, b) => a - b);
    if (!values.length) return null;
    // Median guards against a single accidentally huge record. It is not an all-time max.
    const middle = Math.floor(values.length / 2);
    return values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
}

/** Returns a meaningful cold-start dose without claiming the effort was observed. */
export function estimateSetDose(set, reference = null) {
    const hold = isHoldExercise(set.exercise_name);
    const reasons = [];
    const reported = numeric(set.rir) && set.rir >= 0 && set.rir <= 8;
    const resistance = resistanceIndex(set);
    let rir = reported ? set.rir : 3;
    let effortSource = reported ? 'reported' : 'assumed';
    if (!reported && !hold && reference > 0 && resistance > 0 && set.reps <= 30) {
        rir = clamp(30 * (reference / resistance - 1) - set.reps, 0, 8);
        effortSource = 'history-estimated';
    }
    if (set.rir != null && !reported) reasons.push('Invalid recorded effort ignored');
    if (!reported) reasons.push(effortSource === 'assumed' ? (hold ? 'Moderate hold effort assumed' : 'Effort assumed (3 reps in reserve)') : 'Effort estimated from earlier comparable sets');
    if ((set.equipment === 'Bodyweight' || set.equipment === 'Assisted Bodyweight') && resistance === null) reasons.push('Historical body mass/mechanics unavailable; effort-based fallback');
    if (set.equipment === 'Resistance Band') reasons.push('Band resistance is not treated as comparable weight');
    let volume;
    if (hold) {
        volume = numeric(set.duration_seconds) && set.duration_seconds > 0
            ? clamp(Math.sqrt(set.duration_seconds / 30), .25, 1.5) : 1;
        if (!numeric(set.duration_seconds)) reasons.push('Hold duration unknown; typical hold assumed');
    } else {
        volume = clamp(Math.sqrt(set.reps / 8), .35, 1.5);
    }
    const warmup = set.is_warmup === 1 || set.is_warmup === true;
    const dose = volume * effortWeight(rir) * (warmup ? .15 : 1) * (hold ? .6 : 1);
    // Capacity references are local to this event's timestamp and use completed,
    // non-warm-up dynamic sets only. High-rep formulas and hold 1RMs are excluded.
    const capacity = !hold && !warmup && resistance > 0 && set.reps <= 12
        ? resistance * (1 + (set.reps + (reported ? set.rir : 3)) / 30) : null;
    return { dose, rir, effortSource, reasons, capacity: numeric(capacity) ? capacity : null, warmup, hold };
}

export function calculateEstimatedSoreness({ muscles, mappings, sets, ratios, now = Date.now() }) {
    if (!numeric(now)) throw new Error('Invalid evaluation timestamp');
    const byExercise = new Map();
    const supported = new Set();
    for (const mapping of mappings) {
        if (!numeric(mapping.intensity) || mapping.intensity <= 0 || mapping.intensity > 1) continue;
        if (!byExercise.has(mapping.exercise_id)) byExercise.set(mapping.exercise_id, new Map());
        const entries = byExercise.get(mapping.exercise_id);
        entries.set(mapping.muscle_id, Math.max(entries.get(mapping.muscle_id) ?? 0, mapping.intensity));
        supported.add(mapping.muscle_id);
    }
    const invalidMuscles = new Set(), issues = new Set(), seen = new Set(), eventMap = new Map();
    for (const set of sets) {
        if (seen.has(set.set_id)) continue;
        seen.add(set.set_id);
        if (set.completed !== true && set.completed !== 1) continue;
        const exposure = byExercise.get(set.exercise_id);
        const start = timestamp(set.start_time), end = timestamp(set.end_time);
        const badInput = !numeric(set.weight) || (set.weight < 0 && set.equipment !== 'Assisted Bodyweight')
            || (!isHoldExercise(set.exercise_name) && (!numeric(set.reps) || set.reps <= 0))
            || (isHoldExercise(set.exercise_name) && set.duration_seconds != null && (!numeric(set.duration_seconds) || set.duration_seconds <= 0));
        if (start > now || end > now) { issues.add('Future workouts excluded'); continue; }
        if (!Number.isFinite(start) || (Number.isFinite(end) && end < start) || badInput) {
            issues.add('Invalid or future workout data excluded');
            for (const [id] of exposure ?? []) invalidMuscles.add(id);
            continue;
        }
        const at = Number.isFinite(end) ? end : start;
        // History remains available for references/adaptation, not just a 7-day query.
        if (!exposure) { if (now - at < 7 * DAY) issues.add('Some exercises have no muscle mapping'); continue; }
        const key = `${set.session_id}:${set.exercise_id}`;
        if (!eventMap.has(key)) eventMap.set(key, { key, exerciseId: set.exercise_id, start, at, sets: [], exposure });
        eventMap.get(key).sets.push(set);
    }
    const events = [...eventMap.values()].sort((a, b) => a.start - b.start || a.at - b.at || a.key.localeCompare(b.key));
    const histories = new Map(), contributions = [];
    for (const event of events) {
        const history = histories.get(event.exerciseId) ?? [];
        const reference = robustReference(history, event.start);
        const prior = history.filter(h => h.at < event.start && event.start - h.at <= 84 * DAY);
        const exposureCount = prior.reduce((n, h) => n + Math.min(h.dose / 2, 1) * Math.exp(-(event.start - h.at) / (42 * DAY)), 0);
        const familiarity = 1 - Math.exp(-exposureCount / 2);
        const adaptation = 1 - .35 * familiarity;
        const estimates = event.sets.map(set => ({ set, ...estimateSetDose(set, reference) }));
        const baseDose = estimates.reduce((n, s) => n + s.dose, 0);
        const peakHours = 42 - 10 * familiarity + Math.min(6, baseDose / 3);
        const capacities = estimates.map(s => s.capacity).filter(c => c > 0).sort((a, b) => a - b);
        // Within-session median rather than selecting its largest typo.
        const capacity = capacities.length ? capacities[Math.floor(capacities.length / 2)] : null;
        histories.set(event.exerciseId, [...prior, { at: event.at, capacity, dose: estimates.filter(s => !s.warmup).reduce((n,s) => n+s.dose, 0) }]);
        if (now - event.at > 21 * DAY) continue; // DOMS numerical tail; retain these events above for adaptation/reference.
        for (const estimate of estimates) {
            const reasons = [...estimate.reasons];
            if (estimate.set.completion_source !== 'confirmed') reasons.push('Older log: completion unverified');
            if (!Number.isFinite(timestamp(estimate.set.end_time))) reasons.push('Finish time unavailable; start time used');
            if (!prior.length) reasons.push('No earlier comparable sessions; familiarity unknown');
            for (const [id, coefficient] of event.exposure) {
                contributions.push({ ...estimate.set, muscle_id: id, coefficient, at: event.at,
                    rawDose: estimate.dose * adaptation * coefficient, peakHours, reasons,
                    effortSource: estimate.effortSource, estimatedRir: estimate.rir,
                    adaptation, reference, dose: 0 });
            }
        }
    }
    // Diminishing dose is applied to the whole session/muscle, not each exercise,
    // so adding an exercise row doesn't reset the volume response.
    const sessionTotals = new Map();
    for (const c of contributions) {
        const key = `${c.session_id}:${c.muscle_id}`;
        sessionTotals.set(key, (sessionTotals.get(key) ?? 0) + c.rawDose);
    }
    for (const c of contributions) {
        const total = sessionTotals.get(`${c.session_id}:${c.muscle_id}`);
        c.dose = c.rawDose * (total > 0 ? 6 * Math.log1p(total / 6) / total : 0);
        c.residual = c.dose * sorenessResponse((now - c.at) / HOUR, c.peakHours).total;
    }
    const byMuscle = new Map();
    for (const c of contributions) {
        if (!byMuscle.has(c.muscle_id)) byMuscle.set(c.muscle_id, []);
        byMuscle.get(c.muscle_id).push(c);
    }
    const individual = muscles.map(m => {
        const entries = byMuscle.get(m.muscle_id) ?? [];
        const recent = entries.filter(c => now - c.at <= 7 * DAY);
        const reasons = [...new Set(recent.flatMap(c => c.reasons))];
        const unavailable = !supported.has(m.muscle_id) || invalidMuscles.has(m.muscle_id);
        const residual = entries.reduce((n, c) => n + c.residual, 0);
        const forecasts = Array.from({ length: 9 }, (_, i) => {
            const future = now + i * 6 * HOUR;
            return unavailable ? null : sorenessScore(entries.reduce((n, c) => n + c.dose * sorenessResponse((future - c.at) / HOUR, c.peakHours).total, 0));
        });
        const value = unavailable ? null : sorenessScore(residual);
        return { ...m, value, residual, forecasts,
            forecast48: unavailable ? null : Math.max(...forecasts),
            status: !supported.has(m.muscle_id) ? 'unsupported' : invalidMuscles.has(m.muscle_id) ? 'invalid-data' : recent.length ? 'estimated' : 'no-recent-training',
            confidence: reasons.length ? 'limited' : recent.length ? 'moderate' : 'limited', reasons,
            direct: entries.some(c => c.coefficient >= .5 && c.residual > 1e-8),
        };
    });
    const groups = [...new Set(muscles.map(m => m.muscle_group))].map(name => {
        const members = individual.filter(m => m.muscle_group === name);
        const supportedMembers = members.filter(m => m.status !== 'unsupported');
        const weights = ratios.find(r => r.muscle_group === name)?.muscles ?? [];
        const coverage = supportedMembers.reduce((n, m) => n + (weights.find(w => w.name === m.muscle_name)?.ratio ?? 0), 0);
        const ratio = m => coverage > 0 ? (weights.find(w => w.name === m.muscle_name)?.ratio ?? 0) / coverage : 0;
        const invalid = !coverage || supportedMembers.some(m => m.value === null);
        const peak = supportedMembers.filter(m => m.direct).sort((a,b) => b.value - a.value)[0] ?? null;
        // Keep a sore prime/secondary muscle visible without allowing a weak
        // stabilizer coefficient to dominate the whole group.
        const groupWeight = m => peak ? .7 * ratio(m) + (m.muscle_id === peak.muscle_id ? .3 : 0) : ratio(m);
        const value = invalid ? null : supportedMembers.reduce((n,m) => n + m.value * groupWeight(m), 0);
        const forecast = invalid ? null : Math.max(...Array.from({length: 9}, (_,i) => {
            const average = supportedMembers.reduce((n,m) => n + m.forecasts[i] * ratio(m), 0);
            const direct = supportedMembers.filter(m => m.direct);
            return direct.length ? .7 * average + .3 * Math.max(...direct.map(m => m.forecasts[i])) : average;
        }));
        const exerciseMap = new Map();
        for (const m of supportedMembers) for (const c of byMuscle.get(m.muscle_id) ?? []) {
            if (c.residual < 1e-8) continue;
            const key = `${c.session_id}:${c.session_exercise_id}`;
            if (!exerciseMap.has(key)) exerciseMap.set(key, { name: c.exercise_name, date: new Date(c.at).toISOString(), sets: new Set(), score: 0, reasons: new Set() });
            const e = exerciseMap.get(key);
            e.sets.add(c.set_id);
            e.score += m.residual > 0 ? (m.value ?? 0) * (c.residual / m.residual) * groupWeight(m) : 0;
            for (const reason of c.reasons) e.reasons.add(reason);
        }
        const exercises = [...exerciseMap.values()].sort((a,b) => b.score-a.score).map(e => ({
            name: e.name, date: e.date, sets: e.sets.size, score: e.score,
            contribution: value > 0 ? `${Math.round(e.score / value * 100)}%` : '—',
            reasons: [...e.reasons], reps: 0, weight: '',
        }));
        const reasons = [...new Set(supportedMembers.flatMap(m => m.reasons))];
        return { muscle_group: name, muscle_group_id: members[0].muscle_group_id,
            value, weighted_soreness: value, forecast48: forecast, peak, muscles: members, exercises,
            coverage, unsupported: members.filter(m => m.status === 'unsupported').map(m => m.muscle_name),
            status: invalid ? 'unavailable' : supportedMembers.every(m => m.status === 'no-recent-training') ? 'no-recent-training' : 'estimated',
            confidence: coverage < .999 || reasons.length ? 'limited' : 'moderate', reasons,
        };
    });
    return { modelVersion: SORENESS_MODEL_VERSION, mappingVersion: SORENESS_MAPPING_VERSION, evaluatedAt: now, groups, issues: [...issues] };
}
