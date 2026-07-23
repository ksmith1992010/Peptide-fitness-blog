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

### Option A — Dashboard Git integration (recommended)

1. Push this repo to GitHub (`main`).
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Import Git repository**.
3. Select `ksmith1992010/Peptide-fitness-blog`.
4. Build settings:

| Setting | Value |
|---|---|
| Project name | `amino-brief` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |

5. **Save and Deploy**. Cloudflare builds from Git on every push to `main`.
6. Add custom domain `aminobrief.com` under the project’s **Custom domains**.

### Option B — GitHub Actions + Wrangler

1. Create a Cloudflare API token (Account → Pages → Edit) and note your Account ID.
2. Add GitHub repo secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Push to `main` — `.github/workflows/deploy-cloudflare.yml` builds and runs `wrangler pages deploy`.

### Local direct upload

```bash
npm run build
npx wrangler pages deploy dist --project-name=amino-brief
```

## Content

- Guides: `src/content/guides/`
- Glossary: `src/content/glossary/`
- Products: `src/data/products.ts`

## Notes

- Calculators are educational unit-conversion tools, not medical advice.
- Shop order requests open an email draft until Stripe is wired.
- External peptide vendor links are intentionally omitted at launch.
