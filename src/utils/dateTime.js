import { toZonedTime } from "date-fns-tz";

const timeZone = "Africa/Cairo";

export const toCairoTime = (date) => toZonedTime(date, timeZone);

export const fromCairoTime = (date) => toZonedTime(date, timeZone);
