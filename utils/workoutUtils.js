// Returns an array of the last 7 days as 'YYYY-MM-DD'
export function getLast7Days() {
  const days = [];
  const pad = (n) => n < 10 ? '0' + n : n;
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
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