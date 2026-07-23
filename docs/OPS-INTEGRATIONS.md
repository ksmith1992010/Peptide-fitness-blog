# Integrations setup — Turnstile, Stripe, Resend

All three are **optional until secrets are set**. `/api/health` reports booleans only (never secret values).

## Turnstile (spam)

1. Cloudflare Dashboard → Turnstile → add site (aminobrief.com + workers.dev preview host)
2. Copy **site key** → Cloudflare Workers Builds / build env: `PUBLIC_TURNSTILE_SITE_KEY`
3. Copy **secret key** → Worker secret:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Used by:

- `POST /api/newsletter` (NewsletterForm)
- `POST /api/contact` (Contact form)

If secret is unset, verification is skipped (early-deploy mode). If secret is set, token is required.

## Stripe (accessory checkout)

1. Stripe Dashboard → Products → create products matching shop SKUs (retail prices in `src/data/products.ts`)
2. Copy Price IDs (`price_…`) into Worker secrets:

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_PRICE_BAC_WATER
npx wrangler secret put STRIPE_PRICE_SYRINGES
npx wrangler secret put STRIPE_PRICE_CASE
npx wrangler secret put STRIPE_PRICE_ALCOHOL
npx wrangler secret put STRIPE_PRICE_EMPTY_VIALS
npx wrangler secret put STRIPE_PRICE_GLOVES
npx wrangler secret put STRIPE_PRICE_LABELS
npx wrangler secret put STRIPE_PRICE_RECON_KIT
# or one blob:
npx wrangler secret put STRIPE_PRICE_JSON
# {"bac-water":"price_…", ...}
```

3. Set `PUBLIC_SITE_URL=https://aminobrief.com` (or current workers.dev) for success/cancel URLs
4. Verify `GET /api/checkout/priced` lists SKUs
5. Product pages show “Card checkout live” when the SKU is priced

Reseller / wholesale MOQs still use the email order form.

## Resend (newsletter + contact)

1. Create Resend account + verify sending domain (after DNS attach)
2. Create an Audience → copy Audience ID
3. Secrets:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_AUDIENCE_ID
npx wrangler secret put RESEND_FROM
# e.g. Amino Brief <editorial@aminobrief.com>
```

Behavior:

- Signup → KV always; audience sync when Resend configured
- Desk **Newsletter dry-run / backfill** for staff
- Contact form emails desk when Resend configured; otherwise returns mailto fallback

## Health checklist

```bash
curl -s https://peptide-fitness-blog.kyle-smith-77d.workers.dev/api/health | jq
```

Expect eventually:

```json
{
  "bindings": {
    "subscribers": true,
    "newsDrafts": true,
    "ai": true,
    "turnstile": true,
    "stripe": true,
    "resend": true,
    "staffSecret": true
  }
}
```
