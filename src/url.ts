/**
 * Prefix an internal, site-root-relative path with the configured `base`.
 * Astro rewrites bundled asset URLs itself, but paths written by hand — links,
 * files in public/, the newsletter archive — have to be prefixed here.
 */
export function withBase(path: string) {
	return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
