// A simplification across every caller - "day" means UTC calendar day,
// not each user's own timezone, so the boundary can land at a locally
// odd hour depending on where someone is.
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
