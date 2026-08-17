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
		}),
});

export const collections = { blog, events };
