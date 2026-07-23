import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const guides = (await getCollection('guides')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const siteUrl = site?.toString().replace(/\/$/, '') ?? 'https://aminobrief.com';
  const items = guides
    .map((guide) => {
      const link = `${siteUrl}/guides/${guide.id}/`;
      return `<item>
  <title><![CDATA[${guide.data.title}]]></title>
  <link>${link}</link>
  <guid>${link}</guid>
  <pubDate>${guide.data.pubDate.toUTCString()}</pubDate>
  <description><![CDATA[${guide.data.description}]]></description>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Amino Brief Guides</title>
  <link>${siteUrl}</link>
  <description>Peptide awareness with sources — evidence-tagged educational briefs.</description>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
