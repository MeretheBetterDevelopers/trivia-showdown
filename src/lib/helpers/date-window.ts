// A simplification across every caller - "day"/"week"/"month" mean UTC
// calendar units, not each user's own timezone, so the boundary can land
// at a locally odd hour depending on where someone is.
export function getUTCDayWindow(date: Date = new Date()): {
  opensAt: Date;
  closesAt: Date;
} {
  const opensAt = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const closesAt = new Date(opensAt);
  closesAt.setUTCDate(closesAt.getUTCDate() + 1);
  return { opensAt, closesAt };
}

// ISO week: Monday 00:00 UTC through the following Monday.
export function getUTCWeekWindow(date: Date = new Date()): {
  opensAt: Date;
  closesAt: Date;
} {
  const day = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  // getUTCDay(): Sunday=0..Saturday=6. Treat Sunday as day 7 so Monday is
  // always day 1, then step back to that week's Monday.
  const isoDay = day.getUTCDay() === 0 ? 7 : day.getUTCDay();
  day.setUTCDate(day.getUTCDate() - (isoDay - 1));

  const closesAt = new Date(day);
  closesAt.setUTCDate(closesAt.getUTCDate() + 7);
  return { opensAt: day, closesAt };
}

export function getUTCMonthWindow(date: Date = new Date()): {
  opensAt: Date;
  closesAt: Date;
} {
  const opensAt = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  );
  const closesAt = new Date(opensAt);
  closesAt.setUTCMonth(closesAt.getUTCMonth() + 1);
  return { opensAt, closesAt };
}
