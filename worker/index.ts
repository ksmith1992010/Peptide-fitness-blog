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

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    name?: string;
    company?: string;
  } | null;

  if (!body?.email || !isEmail(body.email)) return json({ error: 'Valid email required' }, 400);
  // honeypot
  if (body.company) return json({ message: 'You’re on the list.' });

  const email = body.email.trim().toLowerCase();
  const key = `email:${email}`;
  const existing = await env.SUBSCRIBERS.get(key);
  if (existing) return json({ message: 'Already subscribed — you’re good.' });

  await env.SUBSCRIBERS.put(
    key,
    JSON.stringify({
      email,
      name: (body.name || '').trim().slice(0, 120),
      createdAt: new Date().toISOString(),
      source: 'amino-brief-web',
    }),
  );

  return json({ message: 'Subscribed. Welcome to Amino Brief.' });
}

function stripHtml(html: string): string {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRssItems(xml: string, source: string, limit = 8): { title: string; url: string; summary: string; publishedAt: string }[] {
  const items: { title: string; url: string; summary: string; publishedAt: string }[] = [];
  const blocks = xml.split(/<item[\s>]/i).slice(1);
  for (const block of blocks) {
    if (items.length >= limit) break;
    const title = stripHtml((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
    const link = stripHtml((block.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '');
    const desc = stripHtml((block.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] || '');
    const pub = stripHtml((block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1] || new Date().toISOString());
    if (!title || !link) continue;
    items.push({ title, url: link, summary: desc.slice(0, 280), publishedAt: pub, });
  }
  return items.map((i) => ({ ...i, /* source tagged later */ }));
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
  const list = await env.NEWS_DRAFTS.list({ prefix: 'draft:' });
  const drafts: NewsItem[] = [];
  for (const key of list.keys.slice(0, 40)) {
    const raw = await env.NEWS_DRAFTS.get(key.name);
    if (!raw) continue;
    try {
      drafts.push(JSON.parse(raw) as NewsItem);
    } catch {
      // skip bad
    }
  }
  return drafts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/newsletter') return handleNewsletter(request, env);

  if (url.pathname === '/api/news/drafts' && request.method === 'GET') {
    const drafts = await listDrafts(env);
    return json({
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
    });
  }

  if (url.pathname === '/api/news/drafts/' || url.pathname.startsWith('/api/news/drafts/')) {
    const id = url.pathname.split('/').pop();
    if (id && request.method === 'GET') {
      const raw = await env.NEWS_DRAFTS.get(`draft:${id}`);
      if (!raw) return json({ error: 'Not found' }, 404);
      return json(JSON.parse(raw));
    }
  }

  if (url.pathname === '/api/news/run' && request.method === 'POST') {
    const auth = request.headers.get('Authorization') || '';
    const secret = env.NEWS_TRIGGER_SECRET;
    if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'Unauthorized' }, 401);
    const result = await runNewsLoop(env);
    return json(result);
  }

  return json({ error: 'Not found' }, 404);
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (err) {
        return json({ error: err instanceof Error ? err.message : 'Server error' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runNewsLoop(env).then(() => undefined));
  },
};
