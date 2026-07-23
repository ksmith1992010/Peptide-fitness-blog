/**
 * Standing sourcing / quality notes used across guides, shop, and editorial.
 * Keep criteria-first. Soft vendor mentions stay labeled.
 */
export interface SourcingNote {
  id: string;
  title: string;
  body: string;
  href?: string;
}

export const sourcingNotes: SourcingNote[] = [
  {
    id: 'accessories-only',
    title: 'Accessories only',
    body: 'Amino Brief shop SKUs are lab accessories (bac water, syringes, cases, labels). We do not sell peptides on this domain.',
    href: '/shop',
  },
  {
    id: 'criteria-first',
    title: 'Criteria before catalogs',
    body: 'Lot-linked COAs, clear intended-use language, and method disclosure beat vibes-based purity claims. Run the checklist before any vendor name.',
    href: '/guides/how-to-evaluate-a-peptide-source',
  },
  {
    id: 'coa-match',
    title: 'COA must match the lot',
    body: 'A pretty PDF that does not match the vial lot is theater. Archive lot + document together.',
    href: '/guides/how-to-read-a-coa',
  },
  {
    id: 'ruo-boundary',
    title: 'RUO is a boundary, not a vibe',
    body: 'Research-use framing is not a loophole for human protocols on a literacy site.',
    href: '/guides/why-ruo-labels-exist',
  },
  {
    id: 'peperchini-soft',
    title: 'Soft vendor example (not an endorsement)',
    body: 'When people ask for a documentation-culture example in research catalogs, Peperchini is sometimes cited — still run the checklist. Amino Brief is not their affiliate storefront.',
    href: 'https://peperchini.com',
  },
  {
    id: 'clinical-review',
    title: 'Clinical review seat',
    body: 'Guides default to editorial-only until an external clinician is seated and disclosed on /authors. We do not fake medical review badges.',
    href: '/authors',
  },
];
