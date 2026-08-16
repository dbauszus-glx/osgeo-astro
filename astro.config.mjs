// @ts-check

import { createReadStream } from 'node:fs';
import { cp, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const NEWSLETTER_DIR = new URL('./src/assets/newsletter/', import.meta.url);

const MIME_TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
	'.pdf': 'application/pdf',
};

/**
 * The newsletters are PDFs and complete saved HTML pages; the pages reference
 * their own `<name>_files/` asset folder with relative URLs, so they have to be
 * served verbatim. This serves src/assets/newsletter/ under /newsletter/ during
 * dev and copies it into dist/newsletter/ at the end of a build.
 * @returns {import('astro').AstroIntegration}
 */
function newsletterArchive() {
	return {
		name: 'newsletter-archive',
		hooks: {
			'astro:server:setup': ({ server }) => {
				server.middlewares.use('/newsletter', async (req, res, next) => {
					const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
					// Only intercept the issues and their asset folders; the
					// /newsletter index route stays with Astro.
					if (!/\.(html|pdf)$/.test(path) && !path.includes('_files/')) return next();
					const file = new URL(`.${path}`, NEWSLETTER_DIR);
					if (!fileURLToPath(file).startsWith(fileURLToPath(NEWSLETTER_DIR))) return next();
					try {
						if (!(await stat(file)).isFile()) return next();
					} catch {
						return next();
					}
					const ext = path.slice(path.lastIndexOf('.'));
					res.setHeader('Content-Type', MIME_TYPES[ext] ?? 'application/octet-stream');
					createReadStream(file).pipe(res);
				});
			},
			'astro:build:done': async ({ dir }) => {
				await cp(NEWSLETTER_DIR, new URL('./newsletter/', dir), {
					recursive: true,
					// Keep source-only extras (download archives and the like) out of the build.
					filter: (source) => !source.endsWith('.zip'),
				});
			},
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), newsletterArchive()],
});
