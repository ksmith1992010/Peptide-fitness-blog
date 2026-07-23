/**
 * Scrubbed keyword map — intents Amino Brief can win without “buy peptide” SERPs.
 * Use for titles, metas, H1/H2, and internal-link anchors.
 */
export interface KeywordTarget {
  /** Primary query / phrase */
  primary: string;
  secondaries: string[];
  /** Canonical URL path */
  path: string;
  intent: 'informational' | 'commercial' | 'navigational' | 'tool';
  /** Why this is winnable / worth chasing */
  note: string;
  linkable?: boolean;
}

export const keywordTargets: KeywordTarget[] = [
  {
    primary: 'how to read a peptide COA',
    secondaries: [
      'certificate of analysis peptide',
      'HPLC peptide purity',
      'lot number COA match',
      'fake peptide COA',
    ],
    path: '/guides/how-to-read-a-coa',
    intent: 'informational',
    note: 'High competition from vendors — we win on independence (no peptide sales) + checklist clarity for .edu/.org cites.',
    linkable: true,
  },
  {
    primary: 'research use only meaning peptides',
    secondaries: ['RUO label meaning', 'what does RUO mean', 'research use only vs FDA approved'],
    path: '/guides/why-ruo-labels-exist',
    intent: 'informational',
    note: 'Journalism + policy citation magnet; lower protocol-spam competition than compound names.',
    linkable: true,
  },
  {
    primary: 'how to evaluate a peptide source',
    secondaries: ['peptide vendor checklist', 'research peptide red flags', 'peptide COA vendor'],
    path: '/guides/how-to-evaluate-a-peptide-source',
    intent: 'informational',
    note: 'Pairs with COA/RUO; criteria-first angle differentiates from affiliate lists.',
    linkable: true,
  },
  {
    primary: 'peptide reconstitution calculator',
    secondaries: [
      'reconstitution math mg mL units',
      'U-100 peptide calculator',
      'bac water reconstitution calculator',
    ],
    path: '/tools/reconstitution',
    intent: 'tool',
    note: 'Tool SERPs convert + earn creator links; pair with literacy guide; never protocol language.',
    linkable: true,
  },
  {
    primary: 'peptide reconstitution math',
    secondaries: ['mg to units peptide', 'how to calculate peptide concentration'],
    path: '/guides/reconstitution-math-without-the-guru',
    intent: 'informational',
    note: 'Supports tool rankings; coach/newsletter citation target.',
    linkable: true,
  },
  {
    primary: 'BPC-157 evidence',
    secondaries: ['BPC-157 research', 'BPC-157 human trials', 'BPC-157 animal studies'],
    path: '/compounds/bpc-157',
    intent: 'informational',
    note: 'Own evidence-grade honesty vs “miracle heal” pages; hub + snapshot cluster.',
    linkable: false,
  },
  {
    primary: 'retatrutide evidence',
    secondaries: ['retatrutide research', 'retatrutide vs tirzepatide literacy'],
    path: '/compounds/retatrutide',
    intent: 'informational',
    note: 'Media-driven demand; keep human-evidence badge honest.',
    linkable: false,
  },
  {
    primary: 'GLP-1 headlines evidence',
    secondaries: ['Ozempic research literacy', 'semaglutide news vs evidence'],
    path: '/guides/glp1-headlines-vs-evidence',
    intent: 'informational',
    note: 'Newsjacking without selling Rx drugs.',
    linkable: true,
  },
  {
    primary: 'evidence tiers cell animal human',
    secondaries: ['animal studies vs human trials peptides', 'peptide evidence ladder'],
    path: '/guides/evidence-tiers-cell-to-human',
    intent: 'informational',
    note: 'Newsletter swap staple; definitional AEO bait.',
    linkable: true,
  },
  {
    primary: 'bacteriostatic water for reconstitution',
    secondaries: ['buy bac water', 'bac water 30 mL', 'bacteriostatic water accessories'],
    path: '/shop/bac-water',
    intent: 'commercial',
    note: 'Cleaner commercial SERP than gray-market peptides; matches what we sell.',
    linkable: false,
  },
  {
    primary: 'what are peptides',
    secondaries: ['peptide meaning research', 'what peptides actually are'],
    path: '/guides/what-peptides-actually-are',
    intent: 'informational',
    note: 'Top-of-funnel literacy pillar.',
    linkable: false,
  },
];

export const linkableAssets = keywordTargets.filter((k) => k.linkable);

/** Google operators for resource-page / .edu prospecting */
export const prospectingOperators = [
  'site:.edu "certificate of analysis" (peptide OR chemistry OR "lab safety") (resources OR "useful links")',
  'site:.edu ("research use only" OR RUO) (resources OR libguides OR "course materials")',
  'site:.edu (peptide OR "laboratory receiving") intitle:resources',
  '"useful links" OR "recommended resources" ("certificate of analysis" OR HPLC) peptide',
  'intitle:resources ("compounding" OR "research chemicals") peptide OR RUO',
  '"reconstitution calculator" (peptide OR "insulin syringe") ("tools" OR resources)',
  'site:.org "research use only" peptides (resources OR FAQ)',
];
