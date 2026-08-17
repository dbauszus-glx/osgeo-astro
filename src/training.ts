// Shared helpers for the `training` collection, so the training page and any
// other listing agree on ordering, on what counts as "upcoming", and on how a
// course's date range is written.
import { type CollectionEntry, getCollection } from 'astro:content';

export type Training = CollectionEntry<'training'>;

/** The last day a course runs; single-day courses end when they start. */
export function trainingEnd(course: Training) {
	return course.data.endDate ?? course.data.startDate;
}

/**
 * Courses split into upcoming (soonest first) and past (most recent first).
 * Note this is evaluated at build time — the site has to be rebuilt for a course
 * to move from one list to the other.
 */
export async function getTraining() {
	const courses = await getCollection('training');
	// Midnight today, so a course is still "upcoming" on the day it runs.
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const upcoming = courses
		.filter((course) => trainingEnd(course) >= today)
		.sort((a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf());

	const past = courses
		.filter((course) => trainingEnd(course) < today)
		.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

	return { upcoming, past };
}

const DAY = { day: 'numeric' } as const;
const DAY_MONTH_YEAR = { day: 'numeric', month: 'short', year: 'numeric' } as const;

/**
 * "18–19 Aug 2026", "30 Nov – 1 Dec 2026" or "5 Oct 2026" depending on whether
 * the course runs over several days, and whether those days share a month.
 */
export function trainingDates(course: Training) {
	const { startDate } = course.data;
	const endDate = course.data.endDate;
	const format = (date: Date, options: Intl.DateTimeFormatOptions) =>
		date.toLocaleDateString('en-GB', options);

	if (!endDate || endDate.valueOf() === startDate.valueOf()) {
		return format(startDate, DAY_MONTH_YEAR);
	}

	const sameMonth =
		startDate.getFullYear() === endDate.getFullYear() &&
		startDate.getMonth() === endDate.getMonth();

	const start = format(startDate, sameMonth ? DAY : DAY_MONTH_YEAR);
	return `${start} – ${format(endDate, DAY_MONTH_YEAR)}`;
}
