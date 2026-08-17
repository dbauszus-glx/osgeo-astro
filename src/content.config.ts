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
			location: z.string().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog, events, gofundgeo };
