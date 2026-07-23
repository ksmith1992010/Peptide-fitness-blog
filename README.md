# Amino Brief

Independent peptide **awareness** site for [aminobrief.com](https://aminobrief.com).

Gym-floor clarity, sources, reconstitution math tools, and an accessories shop (bac water, syringes, cases). No peptides sold here.

## Stack

- [Astro](https://astro.build) (static)
- Netlify (`netlify.toml`)
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

## Content

- Guides: `src/content/guides/`
- Glossary: `src/content/glossary/`
- Products: `src/data/products.ts`

## Notes

- Calculators are educational unit-conversion tools, not medical advice.
- Shop order requests use Netlify Forms until Stripe checkout is wired.
- External peptide vendor links are intentionally omitted at launch.
