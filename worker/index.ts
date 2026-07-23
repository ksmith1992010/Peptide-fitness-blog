/**
 * Amino Brief Cloudflare Worker
 * - /api/newsletter  POST subscribe → KV
 * - /api/news/drafts GET list drafts
 * - /api/news/run    POST trigger news loop (secret)
 * - scheduled cron   pull trends → draft briefs in KV
 * - all other routes → static assets
 */

export interface Env {
  ASSETS: Fetcher;
  SUBSCRIBERS: KVNamespace;
  NEWS_DRAFTS: KVNamespace;
  NEWS_TRIGGER_SECRET?: string;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
  draftMarkdown: string;
  createdAt: string;
  status: 'draft';
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowed =
    origin === 'https://aminobrief.com' ||
    origin.endsWith('.workers.dev') ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:');
  return {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://aminobrief.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

function json(data: unknown, status = 200, request?: Request): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...(request ? corsHeaders(request) : {}) },
  });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, request);

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    name?: string;
    company?: string;
  } | null;

  if (!body?.email || !isEmail(body.email)) return json({ error: 'Valid email required' }, 400, request);
  // honeypot
  if (body.company) return json({ message: 'Thanks — you’re on the Amino Brief list (or already were).' }, 200, request);

  const email = body.email.trim().toLowerCase();
  const key = `email:${email}`;
  const existing = await env.SUBSCRIBERS.get(key);
  if (!existing) {
    await env.SUBSCRIBERS.put(
      key,
      JSON.stringify({
        email,
        name: (body.name || '').trim().slice(0, 120),
        createdAt: new Date().toISOString(),
        source: 'amino-brief-web',
      }),
    );
  }

  // Same message whether new or existing — avoid email enumeration
  return json({ message: 'Thanks — you’re on the Amino Brief list (or already were).' }, 200, request);
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeHttpUrl(value: string): string | null {
  try {
    const u = new URL(value);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

function parseRssItems(xml: string, _source: string, limit = 8): { title: string; url: string; summary: string; publishedAt: string }[] {
  const items: { title: string; url: string; summary: string; publishedAt: string }[] = [];
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of blocks) {
    if (items.length >= limit) break;
    const title = stripHtml((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '').slice(0, 300);
    const linkRaw = stripHtml((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '');
    const link = safeHttpUrl(linkRaw);
    const desc = stripHtml((block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] || '').slice(0, 280);
    const pub = stripHtml((block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1] || new Date().toISOString());
    if (!title || !link) continue;
    items.push({ title, url: link, summary: desc, publishedAt: pub });
  }
  return items;
}

async function fetchFeeds(): Promise<{ title: string; url: string; summary: string; publishedAt: string; source: string }[]> {
  const simpleFeeds = [
    {
      source: 'Google News peptides',
      url: 'https://news.google.com/rss/search?q=peptide+OR+%22research+peptide%22+OR+semaglutide+OR+%22BPC-157%22&hl=en-US&gl=US&ceid=US:en',
    },
    {
      source: 'Google News GLP-1',
      url: 'https://news.google.com/rss/search?q=GLP-1+OR+retatrutide+OR+tirzepatide&hl=en-US&gl=US&ceid=US:en',
    },
  ];

  const out: { title: string; url: string; summary: string; publishedAt: string; source: string }[] = [];
  for (const feed of simpleFeeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'AminoBriefBot/1.0 (+https://aminobrief.com)' },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRssItems(xml, feed.source, 6);
      for (const item of items) out.push({ ...item, source: feed.source });
    } catch {
      // continue other feeds
    }
  }
  return out;
}

function draftFromItem(item: { title: string; url: string; summary: string; publishedAt: string; source: string }): string {
  return `---
title: "${item.title.replace(/"/g, "'")}"
description: "Desk draft from ${item.source} — review before publish."
pubDate: ${new Date().toISOString().slice(0, 10)}
category: safety
evidence: literacy
tags: [newsroom, draft, auto]
featured: false
draft: true
---

> **Desk draft — not published editorial yet.** Auto-pulled from public RSS. Fact-check, add sources, and remove hype before promoting to Guides.

## What surfaced

**Headline:** ${item.title}

**Source feed:** ${item.source}

**Link:** ${item.url}

**Feed blurb:** ${item.summary || 'No summary provided by feed.'}

## Amino Brief angle (fill in)

- What is verified vs rumor?
- Evidence tier (FDA / human / animal / anecdotal)?
- Any RUO / quality / regulatory angle readers need?
- Link related Amino Brief guides for internal SEO.

## Disclaimer

Educational desk note only. Not medical advice.
`;
}

export async function runNewsLoop(env: Env): Promise<{ created: number; drafts: NewsItem[] }> {
  const items = await fetchFeeds();
  const created: NewsItem[] = [];

  for (const item of items.slice(0, 10)) {
    const id = crypto.randomUUID();
    const draft: NewsItem = {
      id,
      title: item.title,
      url: item.url,
      source: item.source,
      publishedAt: item.publishedAt,
      summary: item.summary,
      draftMarkdown: draftFromItem(item),
      createdAt: new Date().toISOString(),
      status: 'draft',
    };

    // de-dupe by URL
    const urlKey = `url:${item.url}`;
    const seen = await env.NEWS_DRAFTS.get(urlKey);
    if (seen) continue;
    await env.NEWS_DRAFTS.put(urlKey, id);
    await env.NEWS_DRAFTS.put(`draft:${id}`, JSON.stringify(draft));
    created.push(draft);
  }

  await env.NEWS_DRAFTS.put(
    'meta:last-run',
    JSON.stringify({ at: new Date().toISOString(), created: created.length }),
  );

  return { created: created.length, drafts: created };
}

async function listDrafts(env: Env): Promise<NewsItem[]> {
  const drafts: NewsItem[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.NEWS_DRAFTS.list({ prefix: 'draft:', cursor, limit: 100 });
    for (const key of page.keys) {
      const raw = await env.NEWS_DRAFTS.get(key.name);
      if (!raw) continue;
      try {
        drafts.push(JSON.parse(raw) as NewsItem);
      } catch {
        // skip bad
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return drafts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/newsletter') return handleNewsletter(request, env);

  if (url.pathname === '/api/news/drafts' && request.method === 'GET') {
    const drafts = await listDrafts(env);
    return json(
      {
        drafts: drafts.map((d) => ({
          id: d.id,
          title: d.title,
          url: d.url,
          source: d.source,
          summary: d.summary,
          createdAt: d.createdAt,
          status: d.status,
        })),
        lastRun: await env.NEWS_DRAFTS.get('meta:last-run'),
      },
      200,
      request,
    );
  }

  // Full draft markdown is staff-only
  if (url.pathname.startsWith('/api/news/drafts/') && request.method === 'GET') {
    const auth = request.headers.get('Authorization') || '';
    const secret = env.NEWS_TRIGGER_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'Unauthorized' }, 401, request);
    const id = url.pathname.split('/').pop();
    if (!id) return json({ error: 'Not found' }, 404, request);
    const raw = await env.NEWS_DRAFTS.get(`draft:${id}`);
    if (!raw) return json({ error: 'Not found' }, 404, request);
    return json(JSON.parse(raw), 200, request);
  }

  if (url.pathname === '/api/news/run' && request.method === 'POST') {
    const auth = request.headers.get('Authorization') || '';
    const secret = env.NEWS_TRIGGER_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'Unauthorized' }, 401, request);
    const result = await runNewsLoop(env);
    return json(result, 200, request);
  }

  return json({ error: 'Not found' }, 404, request);
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Server error' }, 500, request);
      }
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runNewsLoop(env).then(() => undefined));
  },
};
