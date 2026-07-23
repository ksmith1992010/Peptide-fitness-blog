# Next additions

## Shipped in next wave
- [x] Compound cluster pages (`/compounds`, `/compounds/[id]`)
- [x] Editorial / E-E-A-T page (`/editorial`)
- [x] Sourcing literacy guide (criteria-first; no vendor soft-sell yet)
- [x] Turnstile-ready newsletter (set `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`)
- [x] Stripe Checkout API stub (`POST /api/checkout`) + shop UI for core SKUs
- [x] Outreach / backlink tracker (`/outreach`)
- [x] `workers_dev` + `preview_urls` enabled in wrangler

## Still to do (ops / product)
1. **Bind real KV** in Cloudflare dashboard: `SUBSCRIBERS`, `NEWS_DRAFTS`
2. **Set Worker secrets**: `NEWS_TRIGGER_SECRET`, optional `TURNSTILE_SECRET_KEY`, `STRIPE_SECRET_KEY` + price IDs
3. **Attach custom domain** `aminobrief.com`
4. **Resend / Mailchimp** sync from SUBSCRIBERS KV for real newsletter sends
5. **Human publish pipeline**: desk draft → PR markdown into `src/content/guides`
6. **Workers AI rewrite** step on news drafts (summarize + evidence checklist)
7. **Author bios / medical reviewer** when ready for stronger YMYL signaling
8. Soft **Peperchini** mention only after sourcing-literacy criteria are live and labeled
9. Expand Stripe price map beyond bac water / syringes / carry case
