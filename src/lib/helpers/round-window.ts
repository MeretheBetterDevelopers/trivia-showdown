import { getUTCDayWindow, getUTCMonthWindow, getUTCWeekWindow } from "./date-window";

export type ScheduledRoundMode = "DAILY" | "WEEKLY" | "MONTHLY";

export const ROUND_WINDOW: Record<
  ScheduledRoundMode,
  (date?: Date) => { opensAt: Date; closesAt: Date }
> = {
  DAILY: getUTCDayWindow,
  WEEKLY: getUTCWeekWindow,
  MONTHLY: getUTCMonthWindow,
};
