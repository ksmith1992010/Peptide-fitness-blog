# Next additions

## Shipped
- [x] Compound cluster pages (`/compounds`, `/compounds/[id]`)
- [x] Editorial / E-E-A-T page (`/editorial`)
- [x] Authors / review disclosure (`/authors`)
- [x] FAQ page with FAQ schema (`/faq`)
- [x] Sourcing literacy guide (criteria-first; no vendor soft-sell yet)
- [x] Turnstile-ready newsletter (set `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`)
- [x] Stripe Checkout API + shop UI for accessory SKUs (expanded price map + `STRIPE_PRICE_JSON`)
- [x] Outreach / backlink tracker (`/outreach`)
- [x] `workers_dev` + `preview_urls` enabled in wrangler
- [x] Workers AI rewrite assist on desk drafts (`POST /api/news/drafts/:id/rewrite`)
- [x] Desk publish pipeline UI (staff token, copy MD, checklist, run news pull)
- [x] Resend audience sync on signup + staff broadcast stub (`RESEND_*` secrets)
- [x] Compound snapshots: retatrutide, tesamorelin, TB-500
- [x] Ops runbook: `docs/OPS-CLOUDFLARE.md`

## Still to do (ops / product)
1. **Bind real KV** in Cloudflare dashboard: `SUBSCRIBERS`, `NEWS_DRAFTS` (see `docs/OPS-CLOUDFLARE.md`)
2. **Set Worker secrets**: `NEWS_TRIGGER_SECRET`; optional Turnstile, Stripe, Resend
3. **Attach custom domain** `aminobrief.com`
4. Seat an **external clinical reviewer** when ready (slot already disclosed on `/authors`)
5. Soft **Peperchini** mention only after sourcing-literacy criteria are live and labeled
6. Optional: auto-open GitHub PR from desk (GitHub App) — currently copy/paste + human PR
7. Optional: Resend audience backfill job for existing KV subscribers
