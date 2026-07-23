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
  SUBSCRIBERS?: KVNamespace;
  NEWS_DRAFTS?: KVNamespace;
  NEWS_TRIGGER_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_BAC_WATER?: string;
  STRIPE_PRICE_SYRINGES?: string;
  STRIPE_PRICE_CASE?: string;
  PUBLIC_SITE_URL?: string;
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

async function verifyTurnstile(token: string | undefined, env: Env, ip: string | null): Promise<boolean> {
  // If Turnstile is not configured, allow (local / early deploy).
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const body = new URLSearchParams();
  body.set('secret', env.TURNSTILE_SECRET_KEY);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, request);

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    name?: string;
    company?: string;
    turnstileToken?: string;
  } | null;

  if (!body?.email || !isEmail(body.email)) return json({ error: 'Valid email required' }, 400, request);
  // honeypot
  if (body.company) return json({ message: 'Thanks — you’re on the Amino Brief list (or already were).' }, 200, request);

  const ip = request.headers.get('CF-Connecting-IP');
  const human = await verifyTurnstile(body.turnstileToken, env, ip);
  if (!human) return json({ error: 'Turnstile verification failed' }, 403, request);

  if (!env.SUBSCRIBERS) {
    return json(
      {
        error:
          'Newsletter storage is not configured yet. Create a KV namespace named SUBSCRIBERS and bind it in Cloudflare.',
      },
      503,
      request,
    );
  }

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
  if (!env.NEWS_DRAFTS) {
    return { created: 0, drafts: [] };
  }
  const store = env.NEWS_DRAFTS;
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
    const seen = await store.get(urlKey);
    if (seen) continue;
    await store.put(urlKey, id);
    await store.put(`draft:${id}`, JSON.stringify(draft));
    created.push(draft);
  }

  await store.put(
    'meta:last-run',
    JSON.stringify({ at: new Date().toISOString(), created: created.length }),
  );

  return { created: created.length, drafts: created };
}

async function listDrafts(env: Env): Promise<NewsItem[]> {
  if (!env.NEWS_DRAFTS) return [];
  const store = env.NEWS_DRAFTS;
  const drafts: NewsItem[] = [];
  let cursor: string | undefined;
  do {
    const page = await store.list({ prefix: 'draft:', cursor, limit: 100 });
    for (const key of page.keys) {
      const raw = await store.get(key.name);
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

async function handleStripeCheckout(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, request);
  if (!env.STRIPE_SECRET_KEY) {
    return json(
      {
        error: 'Stripe is not configured yet. Set STRIPE_SECRET_KEY (and price IDs) as Worker secrets.',
      },
      503,
      request,
    );
  }

  const body = (await request.json().catch(() => null)) as {
    sku?: string;
    quantity?: number;
  } | null;

  const sku = body?.sku || '';
  const quantity = Math.max(1, Math.min(100, Number(body?.quantity || 1)));
  const priceMap: Record<string, string | undefined> = {
    'bac-water': env.STRIPE_PRICE_BAC_WATER,
    'insulin-syringes': env.STRIPE_PRICE_SYRINGES,
    'vial-carry-case': env.STRIPE_PRICE_CASE,
  };
  const price = priceMap[sku];
  if (!price) return json({ error: 'Unknown or unpriced SKU for Stripe checkout' }, 400, request);

  const site = env.PUBLIC_SITE_URL || 'https://aminobrief.com';
  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', `${site}/shop?checkout=success`);
  params.set('cancel_url', `${site}/shop/${sku}?checkout=cancel`);
  params.set('line_items[0][price]', price);
  params.set('line_items[0][quantity]', String(quantity));

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !data.url) {
    return json({ error: data.error?.message || 'Stripe session failed' }, 502, request);
  }
  return json({ url: data.url, id: data.id }, 200, request);
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/newsletter') return handleNewsletter(request, env);
  if (url.pathname === '/api/checkout') return handleStripeCheckout(request, env);

  if (url.pathname === '/api/news/drafts' && request.method === 'GET') {
    if (!env.NEWS_DRAFTS) {
      return json(
        {
          drafts: [],
          lastRun: null,
          warning: 'NEWS_DRAFTS KV is not bound yet. Create and bind it in Cloudflare to enable the desk.',
        },
        200,
        request,
      );
    }
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
    if (!env.NEWS_DRAFTS) return json({ error: 'NEWS_DRAFTS KV not configured' }, 503, request);
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
    if (!env.NEWS_DRAFTS) return json({ error: 'NEWS_DRAFTS KV not configured' }, 503, request);
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
