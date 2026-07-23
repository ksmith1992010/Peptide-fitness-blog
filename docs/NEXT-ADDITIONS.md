# Next additions

## Shipped
- [x] Compound cluster pages (`/compounds`, `/compounds/[id]`)
- [x] Editorial / Authors / FAQ (E-E-A-T)
- [x] Sourcing literacy guide + soft criteria-first Peperchini example
- [x] Turnstile-ready newsletter + Resend sync/broadcast stub
- [x] Stripe Checkout API + expanded SKU price map
- [x] Outreach tracker + desk publish pipeline + Workers AI rewrite
- [x] Compound snapshots across hubs (incl. CJC/IPA, GHK-Cu, storage literacy)
- [x] Guides search + category/evidence filters
- [x] noindex desk/outreach + robots disallow
- [x] Ops runbook: `docs/OPS-CLOUDFLARE.md`

## Still to do (ops / product)
1. **Bind real KV** in Cloudflare: `SUBSCRIBERS`, `NEWS_DRAFTS`
2. **Set Worker secrets**: `NEWS_TRIGGER_SECRET`; optional Turnstile, Stripe, Resend
3. **Attach custom domain** `aminobrief.com`
4. Seat an **external clinical reviewer** when ready (`/authors` slot)
5. Optional: GitHub App auto-PR from desk
6. Optional: Resend audience backfill for existing KV subscribers
