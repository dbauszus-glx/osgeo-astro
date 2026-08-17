// The shared sponsor registry. Logos live in src/assets/sponsors/ and are shared
// across events — an event's frontmatter refers to sponsors by the keys below, so
// the same logo is only ever stored, and optimised, once.
//
// To add a sponsor: drop the logo in src/assets/sponsors/ and add an entry here.
import type { ImageMetadata } from 'astro';

const logos = import.meta.glob<{ default: ImageMetadata }>(
	'./assets/sponsors/*.{png,jpg,jpeg,webp,svg}',
	{ eager: true },
);

export interface Sponsor {
	/** Display name, used as the link title and the logo's alt text. */
	name: string;
	href: string;
	/** File name within src/assets/sponsors/. */
	logo: string;
}

export const SPONSORS = {
	geolytix: { name: 'GEOLYTIX', href: 'https://geolytix.com', logo: 'geolytix.svg' },
	addresscloud: { name: 'Addresscloud', href: 'https://www.addresscloud.com', logo: 'address_cloud.png' },
	idox: { name: 'IDOX Geospatial', href: 'https://www.idoxgroup.com/solutions/gis-and-geospatial/', logo: 'idox.png' },
	cgi: { name: 'CGI', href: 'https://www.cgi.com/', logo: 'CGI.svg' },
	'esri-uk': { name: 'ESRI UK', href: 'https://www.esriuk.com/en-gb/home', logo: 'esri_uk.png' },
	geoxphere: { name: 'GEOXPHERE', href: 'https://www.geoxphere.com/', logo: 'geoxphere.png' },
	astun: { name: 'Astun Technology', href: 'https://www.astuntechnology.com/', logo: 'astun.png' },
	overture: { name: 'Overture Maps Foundation', href: 'https://overturemaps.org/', logo: 'omf.png' },
	sparkgeo: { name: 'Sparkgeo', href: 'https://sparkgeo.com/', logo: 'sparkgeo.png' },
	'mergin-maps': { name: 'Mergin Maps', href: 'https://merginmaps.com/', logo: 'mergin_maps.svg' },
	mapbox: { name: 'Mapbox', href: 'https://www.mapbox.com/', logo: 'mapbox.png' },
	maptiler: { name: 'MapTiler', href: 'https://www.maptiler.com/', logo: 'maptiler.svg' },
	nautoguide: { name: 'Nautoguide', href: 'https://nautoguide.com', logo: 'nautoguide.png' },
	vercel: { name: 'Vercel', href: 'https://vercel.com/open-source-program', logo: 'vercel.png' },
	qfieldcloud: { name: 'QFieldCloud by OPENGIS.ch', href: 'https://qfield.cloud/', logo: 'qfieldcloud.png' },
	'women-in-geospatial': { name: 'Women+ in Geospatial', href: 'https://womeningeospatial.org', logo: 'women_geospatial.png' },
	agi: { name: 'The Association for Geographic Information', href: 'https://www.agi.org.uk', logo: 'association-graphical-information.jpg' },
	mapaction: { name: 'MapAction', href: 'https://mapaction.org', logo: 'mapaction.png' },
} as const satisfies Record<string, Sponsor>;

export type SponsorKey = keyof typeof SPONSORS;

/**
 * Resolve a frontmatter sponsor key to its details and imported logo. Keys come
 * from Markdown, so an unknown one fails the build here rather than rendering
 * a gap in the sponsor grid.
 */
export function getSponsor(key: string) {
	const sponsor = SPONSORS[key as SponsorKey] as Sponsor | undefined;
	if (!sponsor) {
		throw new Error(
			`Unknown sponsor "${key}". Add it to SPONSORS in src/sponsors.ts. Known: ${Object.keys(SPONSORS).join(', ')}`,
		);
	}

	const image = logos[`./assets/sponsors/${sponsor.logo}`];
	if (!image) {
		throw new Error(`Missing logo src/assets/sponsors/${sponsor.logo} for sponsor "${key}".`);
	}

	return { ...sponsor, image: image.default };
}
