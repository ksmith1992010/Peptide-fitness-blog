# Amino Brief

Independent peptide **awareness** site for [aminobrief.com](https://aminobrief.com).

Gym-floor clarity, sources, reconstitution math tools, and an accessories shop (bac water, syringes, cases). No peptides sold here.

## Stack

- [Astro](https://astro.build) (static)
- **Cloudflare Pages** (primary host) — `wrangler.toml`
- Netlify config kept as optional fallback (`netlify.toml`)
- Markdown content collections for guides + glossary

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Cloudflare (Git)

### Option A — Cloudflare dashboard Git connect (recommended)

1. Merge the Cloudflare PR into `main` (so `wrangler.toml` is on the production branch).
2. In Cloudflare → **Workers & Pages** → create from GitHub repo `ksmith1992010/Peptide-fitness-blog`.
3. Use these settings:

| Setting | Value |
|---|---|
| Project name | `peptide-fitness-blog` (lowercase required) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version (Advanced) | `22` |

4. Click **Deploy**.
5. Later: attach custom domain `aminobrief.com`.

### Option B — GitHub Actions + Wrangler

1. Add GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Push to `main` — the workflow builds and runs `wrangler deploy`.

### Local direct upload

```bash
npm run build
npx wrangler deploy
```

## Content

- Guides: `src/content/guides/`
- Glossary: `src/content/glossary/`
- Products: `src/data/products.ts`

## Notes

- Calculators are educational unit-conversion tools, not medical advice.
- Shop order requests open an email draft until Stripe is wired.
- External peptide vendor links are intentionally omitted at launch.
