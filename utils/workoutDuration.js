import { timestamp } from './muscleLoadModel.js';
export function durationSeconds(value) {
    if (typeof value !== 'string' || !/^\d{2,}:\d{2}:\d{2}$/.test(value)) return null;
    const [h, m, s] = value.split(':').map(Number);
    return m < 60 && s < 60 ? h * 3600 + m * 60 + s : null;
}
export function workoutDuration(start, end) {
    const startMs = timestamp(start), endMs = timestamp(end);
    if (!Number.isFinite(endMs)) return end || '00:00:00'; // Preserve legacy duration.
    if (!Number.isFinite(startMs) || endMs < startMs) return '00:00:00';
    const seconds = Math.floor((endMs - startMs) / 1000);
    return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
}
export function finishFromDuration(start, duration) {
    const seconds = durationSeconds(duration), startMs = timestamp(start);
    if (seconds === null || !Number.isFinite(startMs)) throw new Error('Enter a valid duration (HH:MM:SS).');
    return new Date(startMs + seconds * 1000).toISOString();
}
