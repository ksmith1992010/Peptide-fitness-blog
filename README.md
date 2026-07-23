# Amino Brief

Independent peptide **awareness** site for [aminobrief.com](https://aminobrief.com).

## Stack

- Astro static site + Cloudflare Worker (`worker/index.ts`)
- KV: newsletter subscribers + news drafts
- Cron every 6 hours for newsroom drafts
- SEO: sitemap, RSS, `llms.txt`, JSON-LD

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build
npx wrangler deploy
```

### One-time Cloudflare setup (after first successful deploy)

1. Deploy succeeds **without** KV first (site + Worker APIs online).
2. Then create KV and bind in the dashboard:

```bash
npx wrangler kv namespace create SUBSCRIBERS
npx wrangler kv namespace create NEWS_DRAFTS
```

In Cloudflare → Worker → Settings → Bindings:
- `SUBSCRIBERS` → KV namespace
- `NEWS_DRAFTS` → KV namespace

Or uncomment `kv_namespaces` in `wrangler.jsonc` with the real IDs and redeploy.

Optional:

```bash
npx wrangler secret put NEWS_TRIGGER_SECRET
```

Dashboard Git settings:

| Setting | Value |
|---|---|
| Project name | `peptide-fitness-blog` |
| Build | `npm run build` |
| Deploy | `npx wrangler deploy` |
| NODE_VERSION | `22` |

## Systems

- **Tools** — peptide dropdown, duration context, not-medical-advice warnings
- **Newsletter** — `POST /api/newsletter` → KV
- **News loop** — cron → RSS → KV drafts → `/desk` (no auto-publish)
- **Shop** — MOQ / reseller / wholesale tiers; sourced accessories only
- **SEO** — `/growth` playbook page

## Notes

- Calculators are educational unit conversion + research literacy, not prescriptions.
- Peptides are not sold on this domain.
