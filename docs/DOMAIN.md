# Domain attach — aminobrief.com

Canonical site URL in Astro is already `https://aminobrief.com` (`astro.config.mjs`). Live traffic today is the Workers.dev host until DNS is attached.

## Buy

1. Register `aminobrief.com` (and optionally `www`) at any registrar.
2. Point nameservers to Cloudflare **or** keep registrar DNS and create the records Cloudflare shows when you add the Worker domain.

## Attach to the Worker

1. Cloudflare Dashboard → Workers & Pages → `peptide-fitness-blog` → **Domains & Routes**
2. Add custom domain: `aminobrief.com`
3. Add `www.aminobrief.com` and set a 301 redirect to apex (or vice versa — pick one canonical; site config uses apex)
4. Wait for certificate provisioning

## Env after attach

Set Worker / build vars:

```bash
# Stripe success/cancel + Resend links should use the real domain
npx wrangler secret put PUBLIC_SITE_URL
# value: https://aminobrief.com
```

Astro build already emits canonical / OG / sitemap for `https://aminobrief.com`. After attach, verify:

- `https://aminobrief.com/api/health`
- Canonical tags on a guide page
- Newsletter + checkout CORS (Worker allows `aminobrief.com` and `www.aminobrief.com`)

## Email (optional, same day)

Create `editorial@` and `orders@` at your mail provider. SPF/DKIM/DMARC for the domain if you send via Resend (`RESEND_FROM`).

## Do not

- Do not change `site:` in Astro to workers.dev long-term — keep the brand canonical.
- Do not commit DNS API tokens.
