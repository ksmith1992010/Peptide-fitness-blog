import { prospectingOperators } from './keywords';

export type OutreachStatus = 'idea' | 'drafting' | 'pitched' | 'linked' | 'passed';

export interface OutreachTarget {
  name: string;
  type: string;
  angle: string;
  assetLabel: string;
  assetPath: string;
  status: OutreachStatus;
  pitchSubject: string;
  pitchBody: string;
  nextAction: string;
  /** Optional Google operators to find prospects */
  operators?: string[];
}

export { prospectingOperators };

export const outreachTargets: OutreachTarget[] = [
  {
    name: 'University LibGuides / lab receiving resource lists',
    type: 'Education / .edu',
    angle: 'COA literacy checklist for chemistry / lab-safety resource pages',
    assetLabel: 'How to read a peptide COA',
    assetPath: '/guides/how-to-read-a-coa',
    status: 'drafting',
    operators: [
      'site:.edu "certificate of analysis" (resources OR libguides)',
      'site:.edu ("lab safety" OR receiving) peptide OR chemistry intitle:resources',
    ],
    pitchSubject: 'Resource suggestion: independent peptide COA literacy guide',
    pitchBody: `Hi — I maintain Amino Brief, an independent peptide-literacy site (we sell lab accessories only; no peptides).\n\nWe published a cite-friendly checklist on how to read a peptide Certificate of Analysis — lot match, HPLC/MS, lab name, and common PDF theater:\n\nhttps://aminobrief.com/guides/how-to-read-a-coa\n\nIf it’s useful for your lab safety / receiving / chem resources list, you’re welcome to link it. Happy to provide a one-line blurb.\n\nEditorial standards: https://aminobrief.com/editorial\n\nThanks,\nAmino Brief Editorial`,
    nextAction: 'Run operators → 8 LibGuide/dept pages → send 5 personalized pitches this week',
  },
  {
    name: 'Compounding / pharmacy policy reporters',
    type: 'Journalism citation',
    angle: 'RUO label literacy when covering gray-market peptides',
    assetLabel: 'What RUO means',
    assetPath: '/guides/why-ruo-labels-exist',
    status: 'drafting',
    operators: ['"research use only" peptides (FDA OR compounding)'],
    pitchSubject: 'Backgrounder: what “research use only” means (and doesn’t)',
    pitchBody: `Hello — if you’re covering research peptides / compounding gray zones, this plain-language RUO explainer may help readers separate research labels from approved drugs:\n\nhttps://aminobrief.com/guides/why-ruo-labels-exist\n\nRelated: approved vs research compounds — https://aminobrief.com/guides/approved-vs-research-compounds\n\nWe’re an education site (accessories-only shop). Glad to answer process questions on how we grade evidence.\n\nhttps://aminobrief.com/evidence`,
    nextAction: 'Pitch 3 reporters with a recent peptide/compounding piece; personalize lede',
  },
  {
    name: 'Metabolic / obesity desks & newsletters',
    type: 'Journalism / newsletter',
    angle: 'GLP-1 headline literacy + retatrutide evidence snapshot',
    assetLabel: 'GLP-1 headlines vs evidence',
    assetPath: '/guides/glp1-headlines-vs-evidence',
    status: 'drafting',
    pitchSubject: 'GLP-1 media literacy brief (no dosing, evidence grades)',
    pitchBody: `Hi — Amino Brief published a media-literacy brief on reading GLP-1 / Ozempic-class headlines without upgrading blurbs into advice:\n\nhttps://aminobrief.com/guides/glp1-headlines-vs-evidence\n\nRelated retatrutide evidence snapshot (human-evidence badge, no protocols):\nhttps://aminobrief.com/guides/retatrutide-evidence-snapshot\n\nCite freely; education only.`,
    nextAction: 'Pitch 4 health desks / obesity research newsletters',
  },
  {
    name: 'Strength coaches & research-curious creators',
    type: 'Creator citation',
    angle: 'Reconstitution calculator + math guide without protocol porn',
    assetLabel: 'Recon calculator',
    assetPath: '/tools/reconstitution',
    status: 'drafting',
    operators: ['"reconstitution" peptide (coach OR calculator OR "insulin syringe")'],
    pitchSubject: 'Free peptide reconstitution calculator your audience can use',
    pitchBody: `Quick share — free peptide reconstitution calculator (mg / mL / U-100 units) plus a short math explainer. Educational only; no “how I pin” content:\n\nhttps://aminobrief.com/tools/reconstitution\nhttps://aminobrief.com/guides/reconstitution-math-without-the-guru\n\nLink if it saves you from repeating the same unit math in DMs. We sell bac water/syringes accessories — not peptides.`,
    nextAction: 'DM 8 coaches who already disclaim medical advice; offer calculator link',
  },
  {
    name: 'Evidence-focused wellness newsletters',
    type: 'Newsletter swap',
    angle: 'Evidence tiers — animal ≠ human',
    assetLabel: 'Evidence tiers',
    assetPath: '/guides/evidence-tiers-cell-to-human',
    status: 'idea',
    pitchSubject: 'Swap idea: evidence-tier explainer for peptide-curious readers',
    pitchBody: `Hey — Amino Brief’s evidence-tier explainer is built for lists that won’t touch dosing:\n\nhttps://aminobrief.com/guides/evidence-tiers-cell-to-human\n\nOpen to a reciprocal mention if you’re research-literacy aligned (disclose relationships). We don’t sell peptides.`,
    nextAction: 'Shortlist 10 newsletters; personalize first line',
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
    nextAction: 'One follow-up; mark linked/passed',
  },
  {
    name: 'Tool directories / “best calculators” roundups',
    type: 'Resource / tools page',
    angle: 'List free reconstitution calculator as educational utility',
    assetLabel: 'Recon calculator',
    assetPath: '/tools/reconstitution',
    status: 'idea',
    operators: [
      'intitle:tools OR intitle:resources "reconstitution" peptide',
      '"useful tools" peptide calculator OR reconstitution',
    ],
    pitchSubject: 'Educational peptide reconstitution calculator for your tools list',
    pitchBody: `Hello — if you maintain a tools/resources list for research-curious readers, our free reconstitution calculator may fit:\n\nhttps://aminobrief.com/tools/reconstitution\n\nUnit math only (mg/mL/U-100), hard educational disclaimers, no protocol content, no peptide sales.\n\nThanks for considering a link.`,
    nextAction: 'Find 6 tools/resources pages; pitch 3',
  },
  {
    name: 'Broken-link / outdated COA resource replacements',
    type: 'Broken-link building',
    angle: 'Replace dead COA explainers on resource pages with our checklist',
    assetLabel: 'How to read a peptide COA',
    assetPath: '/guides/how-to-read-a-coa',
    status: 'idea',
    operators: ['"how to read" COA peptide (resources OR guide)'],
    pitchSubject: 'Broken/outdated COA guide on your resources page — replacement?',
    pitchBody: `Hi — I was reviewing your resources list and noticed a COA / quality link that looks outdated or dead.\n\nWe keep an independent, cite-friendly peptide COA checklist (lot match, HPLC/MS, red flags):\n\nhttps://aminobrief.com/guides/how-to-read-a-coa\n\nIf helpful as a replacement, feel free to use it. Amino Brief doesn’t sell peptides.\n\nThanks for maintaining the list.`,
    nextAction: 'Audit 10 resource pages for dead COA links; pitch replacements',
  },
  {
    name: 'Science / methods newsletters',
    type: 'Newsletter citation',
    angle: 'Research-lane briefs from Nature-class peptide papers',
    assetLabel: 'Peptide synthesis literacy',
    assetPath: '/guides/peptide-synthesis-literacy',
    status: 'idea',
    pitchSubject: 'Peptide synthesis literacy for non-chemist readers',
    pitchBody: `We turn methods-desk papers into lay literacy (synthesis, cyclic peptides, imaging agents) without protocol cosplay:\n\nhttps://aminobrief.com/guides/peptide-synthesis-literacy\nhttps://aminobrief.com/guides/cyclic-peptides-research-lane\n\nIf you curate “papers worth understanding,” these may fit.`,
    nextAction: 'Pitch 5 chemistry/biology explainer lists',
  },
];
