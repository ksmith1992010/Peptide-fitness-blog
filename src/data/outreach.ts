export type OutreachStatus = 'idea' | 'drafting' | 'pitched' | 'linked' | 'passed';

export interface OutreachTarget {
  name: string;
  type: string;
  angle: string;
  assetLabel: string;
  assetPath: string;
  status: OutreachStatus;
}

export const outreachTargets: OutreachTarget[] = [
  {
    name: 'University lab safety resource lists',
    type: 'Education / .edu adjacency',
    angle: 'COA literacy + receiving checklist as a citation-friendly explainer',
    assetLabel: 'How to read a COA',
    assetPath: '/guides/how-to-read-a-coa',
    status: 'idea',
  },
  {
    name: 'Evidence-focused wellness newsletters',
    type: 'Newsletter swap',
    angle: 'Evidence tiers explainer — animal ≠ human',
    assetLabel: 'Evidence tiers',
    assetPath: '/guides/evidence-tiers-cell-to-human',
    status: 'idea',
  },
  {
    name: 'Compounding / pharmacy policy reporters',
    type: 'Journalism citation',
    angle: 'RUO label literacy when covering gray-market peptides',
    assetLabel: 'Why RUO labels exist',
    assetPath: '/guides/why-ruo-labels-exist',
    status: 'drafting',
  },
  {
    name: 'Strength coaches with research-curious audiences',
    type: 'Creator citation',
    angle: 'Reconstitution math without protocol porn',
    assetLabel: 'Recon math guide',
    assetPath: '/guides/reconstitution-math-without-the-guru',
    status: 'idea',
  },
  {
    name: 'Sourcing / quality reviewers',
    type: 'Industry literacy',
    angle: 'Vendor evaluation checklist — criteria before catalogs',
    assetLabel: 'Evaluate a source',
    assetPath: '/guides/how-to-evaluate-a-peptide-source',
    status: 'drafting',
  },
];
