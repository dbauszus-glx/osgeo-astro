// The newsletters live in src/assets/newsletter as complete saved HTML pages and,
// for the earlier issues, as PDFs. Both are served verbatim from /newsletter/ by the
// `newsletter-archive` integration in astro.config.mjs; the HTML is only read here
// for card metadata, and the PDFs are enumerated without importing them.
const pages = import.meta.glob('./assets/newsletter/*.html', {
	query: '?raw',
	import: 'default',
	eager: true,
}) as Record<string, string>;

const pdfs = Object.keys(import.meta.glob('./assets/newsletter/*.pdf'));

const MONTHS = {
	jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
	jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function meta(html: string, name: string) {
	const match = html.match(new RegExp(`<meta[^>]*(?:property|name)="${name}"[^>]*content="([^"]*)"`, 'i'));
	return match?.[1].replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

/** Both naming schemes end in a month and a two digit year: `-apr-26` / `_apr_24`. */
function issueDate(name: string) {
	const [, mon, yy] = name.match(/[-_]([a-z]{3})[-_](\d{2})$/i) ?? [];
	return new Date(2000 + Number(yy), MONTHS[mon?.toLowerCase() as keyof typeof MONTHS] ?? 0, 1);
}

function issueTitle(date: Date) {
	return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export interface NewsletterIssue {
	href: string;
	date: Date;
	title: string;
	description: string;
	image?: string;
	format: 'Web' | 'PDF';
	cta: string;
}

/** Every issue in the archive, newest first. */
export const newsletterIssues: NewsletterIssue[] = [
	...Object.entries(pages).map(([path, html]) => {
		const name = path.split('/').pop()!.replace(/\.html$/, '');
		const date = issueDate(name);

		return {
			href: `/newsletter/${name}.html`,
			date,
			title: issueTitle(date),
			description: meta(html, 'og:description') ?? '',
			image: meta(html, 'og:image'),
			format: 'Web' as const,
			cta: 'Read this issue',
		};
	}),
	...pdfs.map((path) => {
		const file = path.split('/').pop()!;
		const date = issueDate(file.replace(/\.pdf$/, ''));

		return {
			href: `/newsletter/${file}`,
			date,
			title: issueTitle(date),
			description: 'Newsletter issue as a PDF download.',
			image: undefined,
			format: 'PDF' as const,
			cta: 'Open the PDF',
		};
	}),
].sort((a, b) => b.date.valueOf() - a.date.valueOf());
