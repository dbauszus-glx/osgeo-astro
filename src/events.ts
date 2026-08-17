// Shared helpers for the `events` collection, so the landing page and /events
// agree on ordering, on what counts as "upcoming", and on where an event links to.
import { type CollectionEntry, getCollection } from 'astro:content';
import { withBase } from './url';

export type Event = CollectionEntry<'events'>;

/** Where an event's own page lives. */
export function eventHref(event: Event) {
	return withBase(`/events/${event.id}/`);
}

/** The last day an event runs; single-day events end when they start. */
export function eventEnd(event: Event) {
	return event.data.endDate ?? event.data.startDate;
}

/**
 * Every event split into upcoming (soonest first) and past (most recent first).
 * Note this is evaluated at build time — the site has to be rebuilt for an event
 * to move from one list to the other.
 */
export async function getEvents() {
	const events = await getCollection('events');
	// Midnight today, so an event is still "upcoming" on the day it runs.
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const upcoming = events
		.filter((event) => eventEnd(event) >= today)
		.sort((a, b) => a.data.startDate.valueOf() - b.data.startDate.valueOf());

	const past = events
		.filter((event) => eventEnd(event) < today)
		.sort((a, b) => b.data.startDate.valueOf() - a.data.startDate.valueOf());

	return { upcoming, past };
}
