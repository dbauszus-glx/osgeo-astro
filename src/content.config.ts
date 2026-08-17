import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const events = defineCollection({
	// Load Markdown and MDX files in the `src/content/events/` directory.
	loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/** Day the event starts; also what the listings sort and group on. */
			startDate: z.coerce.date(),
			/** Only for events that run over more than one day. */
			endDate: z.coerce.date().optional(),
			location: z.string().optional(),
			/** External registration/booking page, if the event has one. */
			registerUrl: z.string().url().optional(),
			heroImage: image().optional(),
			/**
			 * Sponsors by tier, in the order they should be shown. `logos` are keys
			 * from SPONSORS in src/sponsors.ts, so logos are shared between events.
			 */
			sponsors: z
				.array(
					z.object({
						tier: z.string(),
						logos: z.array(z.string()).nonempty(),
					}),
				)
				.optional(),
		}),
});

const gofundgeo = defineCollection({
	// Load Markdown and MDX files in the `src/content/gofundgeo/` directory.
	// One entry per funding round or award announcement.
	loader: glob({ base: './src/content/gofundgeo', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/** Date of the award or of the meeting the funding was agreed at. */
			startDate: z.coerce.date(),
			/**
			 * Shown instead of the exact date for older rounds where only the
			 * period is known, e.g. '2019–20'. `startDate` still sets the order.
			 */
			dateLabel: z.string().optional(),
			location: z.string().optional(),
			heroImage: image().optional(),
		}),
});

const training = defineCollection({
	// Load Markdown and MDX files in the `src/content/training/` directory.
	// One entry per course; copy an existing file as a template for a new one.
	loader: glob({ base: './src/content/training', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		/** Day the course starts; also what the table sorts on. */
		startDate: z.coerce.date(),
		/** Only for courses that run over more than one day. */
		endDate: z.coerce.date().optional(),
		/** Who runs the course, e.g. 'Nick Bearman & InStats'. */
		provider: z.string().optional(),
		/** 'Online' or the venue the course is taught at. */
		location: z.string().default('Online'),
		/** Booking page — the course title in the table links here. */
		registerUrl: z.string().url().optional(),
		/** Free text, e.g. '£250' or 'Free'. Shown as-is. */
		cost: z.string().optional(),
	}),
});

export const collections = { blog, events, gofundgeo, training };
