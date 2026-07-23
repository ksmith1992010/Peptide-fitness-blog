# Next additions

## Shipped
- [x] Compound cluster pages (`/compounds`, `/compounds/[id]`)
- [x] Editorial / E-E-A-T page (`/editorial`)
- [x] Authors / review disclosure (`/authors`)
- [x] Sourcing literacy guide (criteria-first; no vendor soft-sell yet)
- [x] Turnstile-ready newsletter (set `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`)
- [x] Stripe Checkout API + shop UI for accessory SKUs (expanded price map + `STRIPE_PRICE_JSON`)
- [x] Outreach / backlink tracker (`/outreach`)
- [x] `workers_dev` + `preview_urls` enabled in wrangler
- [x] Workers AI rewrite assist on desk drafts (`POST /api/news/drafts/:id/rewrite`)
- [x] Desk publish pipeline UI (staff token, copy MD, checklist, run news pull)
- [x] Ops runbook: `docs/OPS-CLOUDFLARE.md`

## Still to do (ops / product)
1. **Bind real KV** in Cloudflare dashboard: `SUBSCRIBERS`, `NEWS_DRAFTS` (see `docs/OPS-CLOUDFLARE.md`)
2. **Set Worker secrets**: `NEWS_TRIGGER_SECRET`, optional Turnstile + Stripe keys / price IDs
3. **Attach custom domain** `aminobrief.com`
4. **Resend / Mailchimp** sync from SUBSCRIBERS KV for real newsletter sends
5. Seat an **external clinical reviewer** when ready (slot already disclosed on `/authors`)
6. Soft **Peperchini** mention only after sourcing-literacy criteria are live and labeled
7. Optional: auto-open GitHub PR from desk (GitHub App) — currently copy/paste + human PR
