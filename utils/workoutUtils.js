// Returns an array of the last 7 days as 'YYYY-MM-DD'
export function getLast7Days() {
    const days = [];
    const pad = (n) => n < 10 ? '0' + n : n;
    const today = new Date();
    for (let i = -1; i < 6; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        days.push(`${year}-${month}-${day}`);
    }
    return days.reverse(); // oldest to newest, or remove .reverse() for newest to oldest
}

export function getLast30Days() {
    const days = [];
    const pad = (n) => n < 10 ? '0' + n : n;
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        days.push(`${year}-${month}-${day}`);
    }
    return days;
}

// Fills in missing days with session_count: 0
export function buildLast7DaysFrequency(rawFrequency) {
    const lookup = Object.fromEntries(
        rawFrequency.map(row => [row.workout_date, row.session_count])
    );
    return getLast7Days().map(date => ({
        workout_date: date,
        session_count: lookup[date] ?? 0,
    }));
}

export const buildLast30DaysFrequency = (rawFrequency) => {
    const lookup = Object.fromEntries(
        rawFrequency.map(row => [row.workout_date, row.session_count])
    );
    return getLast30Days().map(date => ({
        workout_date: date,
        session_count: lookup[date] ?? 0,
    }));
}

export function fillResultsWithDates(results, start, end) {
    // Map results by date (YYYY-MM-DD)
    const resultMap = {};
    results.forEach(item => {
        const dateKey = new Date(item.workout_date).toISOString().slice(0, 10);
        resultMap[dateKey] = item;
    });

    const filled = [];
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        const dateKey = current.toISOString().slice(0, 10);
        if (resultMap[dateKey]) {
            filled.push({ ...resultMap[dateKey], workout_date: dateKey });
        } else {
            filled.push({
                session_id: null,
                workout_date: dateKey,
                exercise_id: results[0]?.exercise_id ?? null,
                set_id: null,
                weight: null,
                reps: null,
            });
        }
        current.setDate(current.getDate() + 1);
    }
    return filled;
}

export function formatLengthTime(timeStr) {
    if (!timeStr) return '0s'; // Handle undefined case
    // Accepts "HH:MM:SS" or "DD:HH:MM:SS"
    const parts = timeStr.split(':').map(Number);
    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (parts.length === 3) {
        // HH:MM:SS
        [hours, minutes, seconds] = parts;
    } else if (parts.length === 4) {
        // DD:HH:MM:SS
        [days, hours, minutes, seconds] = parts;
    }

    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
    // Only include seconds if days === 0
    if (days === 0) result += `${seconds}s`;

    return result.trim();
}

export const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};