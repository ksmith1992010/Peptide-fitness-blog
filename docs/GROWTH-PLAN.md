# Amino Brief — Growth & organic traffic plan

Amino Brief is **literacy + accessories**, not a research-peptide storefront. Organic strategy must match that — or we compete on poisoned “buy BPC-157” SERPs we should not win.

## What actually works in this niche (scrubbed)

Patterns from YMYL / peptide SEO playbooks + what fits our brand:

| Tactic | Works? | Amino Brief application |
|--------|--------|-------------------------|
| E-E-A-T pages (editorial, authors, corrections, review disclosure) | **Required** | Shipped; keep clinician seat honest (no fake MD badges) |
| Educational intent (“what is”, “how to read COA”, “RUO meaning”, “evidence”) | **Yes** | Primary ranking targets |
| Compound hubs with evidence grades + citations | **Yes** | `/compounds/{id}` + snapshot guides |
| Topical clusters + aggressive internal links | **Yes** | See `src/data/seo-clusters.ts` |
| Unique FAQ answers (not identical disclaimer spam) | **Yes for AEO** | Prefer page-specific Qs; keep medical disclaimer in prose |
| Citing PubMed / FDA / primary papers | **Yes** | `sources[]` on guides |
| Competing on “buy [peptide]” / dosing protocols | **No / dangerous** | We sell accessories only; refuse protocol porn |
| PBN / fake medical citations | **No** | Banned |
| Resource-page & journalism citations of original explainers | **Yes** | `/outreach` pitches |
| AI crawler files (`llms.txt`) + clean definitions | **Yes (AEO)** | Keep `llms*.txt` current |
| Thin 120-word near-duplicate snapshots | **Hurts** | Expand or differentiate; link hubs ↔ guides |

## Keyword / intent clusters (own these)

Defined in code: `src/data/seo-clusters.ts` (surfaced on `/learn`).

1. **Literacy pillar** — what peptides are, evidence tiers, myths, reading papers  
2. **Quality / sourcing** — COA, RUO, evaluate a source, storage, sourcing notes  
3. **Compound cluster** — each hub + evidence snapshot (BPC-157, retatrutide, etc.)  
4. **Incretin / media literacy** — GLP-1 headlines vs evidence (not “buy semaglutide”)  
5. **Methods desk cluster** — synthesis, cyclic peptides, GPCRs, imaging, conotoxin *as research lanes*  
6. **Tools** — reconstitution / syringe / vial math (calculator + explainer pairs)  
7. **Accessories commerce** — bac water, syringes (non-YMYL-adjacent SKUs; still no injection advice)

## Content cadence

1. Desk RSS → human literacy brief (methods papers → “research lane” framing)  
2. One compound snapshot refresh / month with primary-source links  
3. One citation-worthy explainer pitch / week from `/outreach`  
4. Update `llms-full.txt` whenever guides ship  

## Outreach execution

Tracker + ready pitch copy: `/outreach` (`src/data/outreach.ts`).

Priority order:

1. .edu / lab-safety resource lists → COA guide  
2. Policy / compounding reporters → RUO guide  
3. Metabolic explainers → retatrutide + GLP-1 headlines  
4. Strength-coach newsletters → recon math (no protocols)  
5. Quality reviewers → sourcing checklist  

## Measurement (when Search Console is on aminobrief.com)

- Impressions on literacy queries, not brand-only  
- Clicks to `/guides/*` and `/compounds/*`  
- Referral from pitched domains (manual)  
- AI answer citations (spot-check Perplexity / AI Overviews quarterly)  

## Guardrails

- Educational / research framing only — no medical prescriptions  
- News loop writes **drafts** for human review (YMYL)  
- Competitor research informs structure — no content scraping  
- Cloudflare Worker + static Astro assets  
