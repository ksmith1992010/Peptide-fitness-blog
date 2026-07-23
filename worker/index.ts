/**
 * Amino Brief Cloudflare Worker
 * - /api/newsletter           POST subscribe → KV (+ optional Resend audience)
 * - /api/newsletter/broadcast POST staff broadcast via Resend
 * - /api/newsletter/backfill  POST staff KV → Resend audience sync
 * - /api/checkout             POST Stripe Checkout session
 * - /api/checkout/priced      GET priced SKU list
 * - /api/health               GET binding status (no secrets)
 * - /api/news/drafts          GET list drafts
 * - /api/news/drafts/:id      GET full markdown (staff)
 * - /api/news/drafts/:id/rewrite POST Workers AI assist (staff)
 * - /api/news/run             POST trigger news loop (staff)
 * - scheduled cron            pull trends → draft briefs in KV
 * - all other routes          → static assets
 */

export interface Env {
  ASSETS: Fetcher;
  AI?: Ai;
  SUBSCRIBERS?: KVNamespace;
  NEWS_DRAFTS?: KVNamespace;
  NEWS_TRIGGER_SECRET?: string;
  TURNSTILE_SECRET_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_BAC_WATER?: string;
  STRIPE_PRICE_SYRINGES?: string;
  STRIPE_PRICE_CASE?: string;
  STRIPE_PRICE_ALCOHOL?: string;
  STRIPE_PRICE_EMPTY_VIALS?: string;
  STRIPE_PRICE_GLOVES?: string;
  STRIPE_PRICE_LABELS?: string;
  STRIPE_PRICE_RECON_KIT?: string;
  /** Optional JSON object: { "slug": "price_xxx", ... } */
  STRIPE_PRICE_JSON?: string;
  PUBLIC_SITE_URL?: string;
  RESEND_API_KEY?: string;
  RESEND_AUDIENCE_ID?: string;
  RESEND_FROM?: string;
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
  aiRewrite?: string;
  aiRewrittenAt?: string;
  aiModel?: string;
}

function requireStaff(request: Request, env: Env): Response | null {
  const auth = (request.headers.get('Authorization') || '').trim();
  const secret = (env.NEWS_TRIGGER_SECRET || '').trim();
  if (!secret || auth !== `Bearer ${secret}`) {
    return json({ error: 'Unauthorized' }, 401, request);
  }
  return null;
}

function stripePriceMap(env: Env): Record<string, string> {
  const map: Record<string, string> = {};
  const pairs: [string, string | undefined][] = [
    ['bac-water', env.STRIPE_PRICE_BAC_WATER],
    ['insulin-syringes', env.STRIPE_PRICE_SYRINGES],
    ['vial-carry-case', env.STRIPE_PRICE_CASE],
    ['alcohol-prep-pads', env.STRIPE_PRICE_ALCOHOL],
    ['sterile-empty-vials', env.STRIPE_PRICE_EMPTY_VIALS],
    ['nitrile-gloves', env.STRIPE_PRICE_GLOVES],
    ['vial-labels-kit', env.STRIPE_PRICE_LABELS],
    ['recon-starter-kit', env.STRIPE_PRICE_RECON_KIT],
  ];
  for (const [slug, price] of pairs) {
    if (price) map[slug] = price;
  }
  if (env.STRIPE_PRICE_JSON) {
    try {
      const extra = JSON.parse(env.STRIPE_PRICE_JSON) as Record<string, string>;
      for (const [k, v] of Object.entries(extra)) {
        if (typeof v === 'string' && v.startsWith('price_')) map[k] = v;
      }
    } catch {
      // ignore bad JSON
    }
  }
  return map;
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
  const name = (body.name || '').trim().slice(0, 120);
  if (!existing) {
    await env.SUBSCRIBERS.put(
      key,
      JSON.stringify({
        email,
        name,
        createdAt: new Date().toISOString(),
        source: 'amino-brief-web',
      }),
    );
  }

  // Best-effort Resend audience sync (does not fail the signup UX)
  if (env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID && !existing) {
    try {
      await syncResendContact(env, email, name);
    } catch {
      // KV is source of truth; Resend can be backfilled later
    }
  }

  // Same message whether new or existing — avoid email enumeration
  return json({ message: 'Thanks — you’re on the Amino Brief list (or already were).' }, 200, request);
}

async function syncResendContact(env: Env, email: string, name: string): Promise<void> {
  const res = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      first_name: name || undefined,
      unsubscribed: false,
    }),
  });
  // 409 = already exists — fine
  if (!res.ok && res.status !== 409) {
    throw new Error(`Resend contact sync failed (${res.status})`);
  }
}

async function listSubscriberRecords(
  env: Env,
  limit = 200,
): Promise<{ email: string; name: string }[]> {
  if (!env.SUBSCRIBERS) return [];
  const rows: { email: string; name: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.SUBSCRIBERS.list({ prefix: 'email:', cursor, limit: 100 });
    for (const key of page.keys) {
      const raw = await env.SUBSCRIBERS.get(key.name);
      if (!raw) continue;
      try {
        const row = JSON.parse(raw) as { email?: string; name?: string };
        if (row.email && isEmail(row.email)) {
          rows.push({ email: row.email, name: (row.name || '').slice(0, 120) });
        }
      } catch {
        // skip
      }
      if (rows.length >= limit) return rows;
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return rows;
}

async function listSubscriberEmails(env: Env, limit = 200): Promise<string[]> {
  return (await listSubscriberRecords(env, limit)).map((r) => r.email);
}

async function handleNewsletterBroadcast(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, request);
  const denied = requireStaff(request, env);
  if (denied) return denied;
  if (!env.RESEND_API_KEY) {
    return json({ error: 'Set RESEND_API_KEY Worker secret to send broadcasts' }, 503, request);
  }
  if (!env.SUBSCRIBERS) {
    return json({ error: 'SUBSCRIBERS KV not configured' }, 503, request);
  }

  const body = (await request.json().catch(() => null)) as {
    subject?: string;
    html?: string;
    dryRun?: boolean;
    limit?: number;
  } | null;

  const subject = (body?.subject || '').trim().slice(0, 200);
  const html = (body?.html || '').trim();
  if (!subject || !html) return json({ error: 'subject and html required' }, 400, request);

  const limit = Math.max(1, Math.min(200, Number(body?.limit || 50)));
  const recipients = await listSubscriberEmails(env, limit);
  const from = env.RESEND_FROM || 'Amino Brief <editorial@aminobrief.com>';

  if (body?.dryRun) {
    return json({ dryRun: true, recipientCount: recipients.length, from, subject }, 200, request);
  }

  // Send individually to avoid BCC leakage; cap per request
  let sent = 0;
  const errors: string[] = [];
  for (const to of recipients) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (res.ok) sent += 1;
    else errors.push(`${to}:${res.status}`);
  }

  return json({ sent, attempted: recipients.length, errors: errors.slice(0, 10) }, 200, request);
}

async function handleNewsletterBackfill(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, request);
  const denied = requireStaff(request, env);
  if (denied) return denied;
  if (!env.RESEND_API_KEY || !env.RESEND_AUDIENCE_ID) {
    return json({ error: 'Set RESEND_API_KEY and RESEND_AUDIENCE_ID secrets' }, 503, request);
  }
  if (!env.SUBSCRIBERS) return json({ error: 'SUBSCRIBERS KV not configured' }, 503, request);

  const body = (await request.json().catch(() => null)) as { limit?: number; dryRun?: boolean } | null;
  const limit = Math.max(1, Math.min(200, Number(body?.limit || 50)));
  const rows = await listSubscriberRecords(env, limit);

  if (body?.dryRun) {
    return json({ dryRun: true, wouldSync: rows.length }, 200, request);
  }

  let synced = 0;
  const errors: string[] = [];
  for (const row of rows) {
    try {
      await syncResendContact(env, row.email, row.name);
      synced += 1;
    } catch (err) {
      errors.push(`${row.email}:${err instanceof Error ? err.message : 'fail'}`);
    }
  }
  return json({ synced, attempted: rows.length, errors: errors.slice(0, 10) }, 200, request);
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
  const priceMap = stripePriceMap(env);
  const price = priceMap[sku];
  if (!price) {
    return json(
      {
        error: 'Unknown or unpriced SKU for Stripe checkout',
        pricedSkus: Object.keys(priceMap),
      },
      400,
      request,
    );
  }

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
  if (url.pathname === '/api/newsletter/broadcast') return handleNewsletterBroadcast(request, env);
  if (url.pathname === '/api/newsletter/backfill') return handleNewsletterBackfill(request, env);
  if (url.pathname === '/api/checkout') return handleStripeCheckout(request, env);
  if (url.pathname === '/api/health' && request.method === 'GET') {
    return json(
      {
        ok: true,
        service: 'amino-brief',
        bindings: {
          subscribers: Boolean(env.SUBSCRIBERS),
          newsDrafts: Boolean(env.NEWS_DRAFTS),
          ai: Boolean(env.AI),
          turnstile: Boolean(env.TURNSTILE_SECRET_KEY),
          stripe: Boolean(env.STRIPE_SECRET_KEY),
          resend: Boolean(env.RESEND_API_KEY),
          staffSecret: Boolean(env.NEWS_TRIGGER_SECRET),
        },
        pricedSkus: Object.keys(stripePriceMap(env)),
        deskRewriteModels: ['xai/grok-4.5', '@cf/meta/llama-3.1-8b-instruct'],
      },
      200,
      request,
    );
  }

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
          hasAiRewrite: Boolean(d.aiRewrite),
          aiRewrittenAt: d.aiRewrittenAt || null,
        })),
        lastRun: await env.NEWS_DRAFTS.get('meta:last-run'),
      },
      200,
      request,
    );
  }

  // POST /api/news/drafts/:id/rewrite — Workers AI assist (staff-only)
  if (url.pathname.match(/^\/api\/news\/drafts\/[^/]+\/rewrite$/) && request.method === 'POST') {
    const denied = requireStaff(request, env);
    if (denied) return denied;
    if (!env.NEWS_DRAFTS) return json({ error: 'NEWS_DRAFTS KV not configured' }, 503, request);
    if (!env.AI) return json({ error: 'Workers AI binding not available' }, 503, request);
    const id = url.pathname.split('/')[4];
    if (!id) return json({ error: 'Not found' }, 404, request);
    const raw = await env.NEWS_DRAFTS.get(`draft:${id}`);
    if (!raw) return json({ error: 'Not found' }, 404, request);
    const draft = JSON.parse(raw) as NewsItem;
    const rewrite = await rewriteDraftWithAi(env, draft);
    draft.aiRewrite = rewrite.text;
    draft.aiRewrittenAt = new Date().toISOString();
    draft.aiModel = rewrite.model;
    await env.NEWS_DRAFTS.put(`draft:${id}`, JSON.stringify(draft));
    return json(
      { id, aiRewrite: rewrite.text, aiRewrittenAt: draft.aiRewrittenAt, aiModel: rewrite.model },
      200,
      request,
    );
  }

  // Full draft markdown is staff-only
  if (url.pathname.startsWith('/api/news/drafts/') && request.method === 'GET') {
    const denied = requireStaff(request, env);
    if (denied) return denied;
    if (!env.NEWS_DRAFTS) return json({ error: 'NEWS_DRAFTS KV not configured' }, 503, request);
    const id = url.pathname.split('/').pop();
    if (!id) return json({ error: 'Not found' }, 404, request);
    const raw = await env.NEWS_DRAFTS.get(`draft:${id}`);
    if (!raw) return json({ error: 'Not found' }, 404, request);
    return json(JSON.parse(raw), 200, request);
  }

  if (url.pathname === '/api/news/run' && request.method === 'POST') {
    const denied = requireStaff(request, env);
    if (denied) return denied;
    if (!env.NEWS_DRAFTS) return json({ error: 'NEWS_DRAFTS KV not configured' }, 503, request);
    const result = await runNewsLoop(env);
    return json(result, 200, request);
  }

  if (url.pathname === '/api/checkout/priced' && request.method === 'GET') {
    return json({ pricedSkus: Object.keys(stripePriceMap(env)) }, 200, request);
  }

  return json({ error: 'Not found' }, 404, request);
}

async function extractAiText(result: unknown): Promise<string> {
  if (!result) return '';
  if (typeof result === 'string') return result.trim();
  const obj = result as {
    response?: string;
    output_text?: string;
    choices?: { message?: { content?: string | { type?: string; text?: string }[] } }[];
  };
  if (typeof obj.response === 'string' && obj.response.trim()) return obj.response.trim();
  if (typeof obj.output_text === 'string' && obj.output_text.trim()) return obj.output_text.trim();
  const content = obj.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  return '';
}

async function rewriteDraftWithAi(
  env: Env,
  draft: NewsItem,
): Promise<{ text: string; model: string }> {
  const system =
    'You write careful research-literacy markdown for Amino Brief — gym-floor clarity with sources. Educational only; never prescribe dosing or medical protocols.';
  const user = `Rewrite the desk draft below into a tighter editorial brief.

Rules:
- Educational / research framing only — never prescribe dosing or medical protocols
- Keep a "gym bro with sources" tone: clear, direct, skeptical of hype
- Include an Evidence checklist section with bullets: verified vs rumor, evidence tier guess, RUO/quality angle, related internal link suggestions
- Keep the source URL
- Output markdown only (no preamble)
- End with: Educational desk note only. Not medical advice.

Title: ${draft.title}
Source: ${draft.source}
URL: ${draft.url}
Feed summary: ${draft.summary}

Original draft:
${draft.draftMarkdown}`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];

  // Prefer Grok when Cloudflare AI catalog + billing allow it; fall back to Llama.
  const attempts: { model: string; input: Record<string, unknown> }[] = [
    {
      model: 'xai/grok-4.5',
      input: {
        messages,
        max_completion_tokens: 2048,
        reasoning_effort: 'medium',
      },
    },
    {
      model: '@cf/meta/llama-3.1-8b-instruct',
      input: {
        messages,
        max_tokens: 1200,
      },
    },
  ];

  let lastError = 'Workers AI returned an empty rewrite';
  for (const attempt of attempts) {
    try {
      const result = await env.AI!.run(attempt.model as Parameters<NonNullable<Env['AI']>['run']>[0], attempt.input);
      const text = await extractAiText(result);
      if (text) return { text, model: attempt.model };
      lastError = `${attempt.model} returned empty output`;
    } catch (err) {
      lastError = err instanceof Error ? `${attempt.model}: ${err.message}` : String(err);
    }
  }
  throw new Error(lastError);
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
