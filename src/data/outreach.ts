export type OutreachStatus = 'idea' | 'drafting' | 'pitched' | 'linked' | 'passed';

export interface OutreachTarget {
  name: string;
  type: string;
  angle: string;
  assetLabel: string;
  assetPath: string;
  status: OutreachStatus;
  /** Ready-to-send pitch (ops) */
  pitchSubject: string;
  pitchBody: string;
  nextAction: string;
}

export const outreachTargets: OutreachTarget[] = [
  {
    name: 'University lab safety / receiving resource lists',
    type: 'Education / .edu adjacency',
    angle: 'COA literacy + lot-match checklist as a citation-friendly explainer',
    assetLabel: 'How to read a COA',
    assetPath: '/guides/how-to-read-a-coa',
    status: 'drafting',
    pitchSubject: 'Resource suggestion: COA literacy explainer for lab receiving pages',
    pitchBody: `Hi — Amino Brief published a short, citation-friendly explainer on how to read a certificate of analysis without getting fooled by recycled PDFs:\n\nhttps://aminobrief.com/guides/how-to-read-a-coa\n\nIt’s educational only (no vendor storefront, no medical advice). If useful for your lab safety / receiving resource list, you’re welcome to link it. Happy to adjust wording if you need a one-line blurb.\n\n— Amino Brief Editorial\nhttps://aminobrief.com/editorial`,
    nextAction: 'Find 5 .edu lab-safety or chem-store resource pages; send pitch',
  },
  {
    name: 'Compounding / pharmacy policy reporters',
    type: 'Journalism citation',
    angle: 'RUO label literacy when covering gray-market peptides',
    assetLabel: 'Why RUO labels exist',
    assetPath: '/guides/why-ruo-labels-exist',
    status: 'drafting',
    pitchSubject: 'Backgrounder: what “research use only” does (and doesn’t) mean',
    pitchBody: `Hello — if you’re covering research peptides / compounding gray zones, this plain-language RUO explainer may help readers:\n\nhttps://aminobrief.com/guides/why-ruo-labels-exist\n\nWe also keep an evidence-grade system and sourcing checklist (accessories-only shop; we don’t sell peptides). Glad to answer process questions on how we label claims.\n\nhttps://aminobrief.com/evidence\nhttps://aminobrief.com/editorial`,
    nextAction: 'Pitch 3 reporters who recently covered compounding/peptides',
  },
  {
    name: 'Metabolic / obesity research explainers',
    type: 'Journalism citation',
    angle: 'Retatrutide + GLP-1 headline literacy without protocol porn',
    assetLabel: 'GLP-1 headlines vs evidence',
    assetPath: '/guides/glp1-headlines-vs-evidence',
    status: 'drafting',
    pitchSubject: 'GLP-1 media literacy brief (evidence grades, no dosing)',
    pitchBody: `Hi — we published a media-literacy brief on reading GLP-1 / Ozempic-class headlines without upgrading blurbs into advice:\n\nhttps://aminobrief.com/guides/glp1-headlines-vs-evidence\n\nRelated: retatrutide evidence snapshot with an honest human-evidence badge:\nhttps://aminobrief.com/guides/retatrutide-evidence-snapshot\n\nCite freely; we’re an education site, not a clinic.`,
    nextAction: 'Pitch health desks + obesity research newsletters',
  },
  {
    name: 'Evidence-focused wellness newsletters',
    type: 'Newsletter swap',
    angle: 'Evidence tiers explainer — animal ≠ human',
    assetLabel: 'Evidence tiers',
    assetPath: '/guides/evidence-tiers-cell-to-human',
    status: 'idea',
    pitchSubject: 'Swap idea: evidence-tier explainer for peptide-curious readers',
    pitchBody: `Hey — Amino Brief’s evidence-tier explainer is built for newsletters that won’t touch dosing:\n\nhttps://aminobrief.com/guides/evidence-tiers-cell-to-human\n\nOpen to a reciprocal mention if your list is research-literacy aligned (disclose relationships). We don’t sell peptides.`,
    nextAction: 'Shortlist 10 newsletters; personalize first line',
  },
  {
    name: 'Strength coaches with research-curious audiences',
    type: 'Creator citation',
    angle: 'Reconstitution math without protocol porn',
    assetLabel: 'Recon math guide',
    assetPath: '/guides/reconstitution-math-without-the-guru',
    status: 'idea',
    pitchSubject: 'Reconstitution math explainer your audience can actually use',
    pitchBody: `Quick share — unit-conversion literacy for research vials (mg/mL/units) without “how I pin” content:\n\nhttps://aminobrief.com/guides/reconstitution-math-without-the-guru\nhttps://aminobrief.com/tools/reconstitution\n\nEducational only. Link if it saves you from repeating the same math in DMs.`,
    nextAction: 'DM 5 coaches who already disclaim medical advice',
  },
  {
    name: 'Sourcing / quality reviewers',
    type: 'Industry literacy',
    angle: 'Vendor evaluation checklist — criteria before catalogs',
    assetLabel: 'Evaluate a source',
    assetPath: '/guides/how-to-evaluate-a-peptide-source',
    status: 'pitched',
    pitchSubject: 'Criteria-first sourcing checklist (not an affiliate list)',
    pitchBody: `Sharing our sourcing checklist — documentation, lots, RUO language, red flags:\n\nhttps://aminobrief.com/guides/how-to-evaluate-a-peptide-source\nhttps://aminobrief.com/resources/sourcing-notes\n\nSoft vendor examples stay labeled; we sell accessories only.`,
    nextAction: 'Follow up once; track if linked',
  },
  {
    name: 'Science / methods newsletters',
    type: 'Newsletter citation',
    angle: 'Desk-style “research lane” briefs from Nature-class peptide papers',
    assetLabel: 'Peptide synthesis literacy',
    assetPath: '/guides/peptide-synthesis-literacy',
    status: 'idea',
    pitchSubject: 'Peptide synthesis literacy for non-chemist readers',
    pitchBody: `We turn methods-desk papers into lay literacy (synthesis, cyclic peptides, imaging agents) without protocol cosplay:\n\nhttps://aminobrief.com/guides/peptide-synthesis-literacy\nhttps://aminobrief.com/guides/cyclic-peptides-research-lane\nhttps://aminobrief.com/guides/imaging-peptides-research-lane\n\nIf you curate “papers worth understanding,” these may fit.`,
    nextAction: 'Pitch 5 chemistry/biology explainers lists',
  },
  {
    name: 'Pain / neuroscience explainers (careful)',
    type: 'Journalism citation',
    angle: 'Conotoxin research lane — antinociception ≠ DIY analgesic',
    assetLabel: 'Conotoxin research lane',
    assetPath: '/guides/conotoxin-research-lane',
    status: 'idea',
    pitchSubject: 'Backgrounder: conotoxin papers are not home analgesics',
    pitchBody: `For coverage of venom-derived peptide research, this boundary piece may help:\n\nhttps://aminobrief.com/guides/conotoxin-research-lane\n\nWe explicitly refuse DIY analgesic framing. Educational site only.`,
    nextAction: 'Only pitch outlets already covering venom/pain science',
  },
];
