# Cloudflare ops for Amino Brief

Worker name: `peptide-fitness-blog`  
Account (from prior deploys): `77d22fce8be7e3ee2422baac6ce999e6`  
Dashboard: https://dash.cloudflare.com/77d22fce8be7e3ee2422baac6ce999e6/workers/services/view/peptide-fitness-blog/production

## 1. Create + bind KV

In the dashboard (Workers → peptide-fitness-blog → Settings → Bindings), create and bind:

| Binding name   | Purpose                          |
|----------------|----------------------------------|
| `SUBSCRIBERS`  | Newsletter emails                |
| `NEWS_DRAFTS`  | Desk drafts from RSS cron        |

Or via CLI (when authenticated):

```bash
npx wrangler kv namespace create SUBSCRIBERS
npx wrangler kv namespace create NEWS_DRAFTS
```

Then add the returned IDs under `kv_namespaces` in `wrangler.jsonc` **or** bind only in the dashboard (preferred if Git deploy manages config carefully).

Placeholder fake IDs (`0000…`) break deploy (error 10041) — never commit those.

## 2. Secrets

```bash
npx wrangler secret put NEWS_TRIGGER_SECRET
npx wrangler secret put TURNSTILE_SECRET_KEY   # optional
npx wrangler secret put STRIPE_SECRET_KEY      # optional
npx wrangler secret put STRIPE_PRICE_BAC_WATER
npx wrangler secret put STRIPE_PRICE_SYRINGES
npx wrangler secret put STRIPE_PRICE_CASE
# also: STRIPE_PRICE_ALCOHOL, STRIPE_PRICE_EMPTY_VIALS, STRIPE_PRICE_GLOVES,
#       STRIPE_PRICE_LABELS, STRIPE_PRICE_RECON_KIT
# or one JSON blob:
npx wrangler secret put STRIPE_PRICE_JSON

# Newsletter sending (optional Resend)
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_AUDIENCE_ID
npx wrangler secret put RESEND_FROM   # e.g. "Amino Brief <editorial@aminobrief.com>"
```

Build-time (Astro): set `PUBLIC_TURNSTILE_SITE_KEY` in the Cloudflare build env if using Turnstile on the form.

Optional: `PUBLIC_SITE_URL=https://aminobrief.com` for Stripe success/cancel URLs.

### Newsletter APIs

- `POST /api/newsletter` — public signup → KV; also syncs to Resend audience when `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` are set
- `POST /api/newsletter/broadcast` — staff Bearer token; body `{ subject, html, dryRun?, limit? }` sends via Resend (capped)
- `POST /api/newsletter/backfill` — staff Bearer token; sync existing KV subscribers into the Resend audience (capped)
- `GET /api/health` — binding booleans (no secret values)

## 3. Workers AI

`wrangler.jsonc` already declares `"ai": { "binding": "AI" }`.  
Desk uses `POST /api/news/drafts/:id/rewrite` (staff Bearer token) with `@cf/meta/llama-3.1-8b-instruct`.

## 4. Custom domain

Workers → peptide-fitness-blog → Domains & Routes → add `aminobrief.com` (and `www` redirect as needed).

## 5. Desk workflow

1. Open `/desk`
2. Paste `NEWS_TRIGGER_SECRET` into Staff session
3. Open a draft → optional **AI rewrite assist** → **Copy markdown**
4. Paste into `src/content/guides/<slug>.md`, fact-check, PR
