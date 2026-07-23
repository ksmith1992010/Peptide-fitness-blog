export type EvidenceTier = 'fda-approved' | 'human' | 'mixed' | 'animal' | 'anecdotal';

export type DurationKey = 'acute' | 'short' | 'extended';

export interface PeptideProfile {
  id: string;
  name: string;
  aliases?: string[];
  category: string;
  vialMgDefault: number;
  bacWaterMlDefault: number;
  /** Educational research-reference amount in mcg — NOT a prescription */
  referenceAmountMcg: number;
  evidence: EvidenceTier;
  summary: string;
  /** Research-context talking points by duration of discussion/study framing */
  durationNotes: Record<DurationKey, string>;
  cautions: string[];
  sourcesHint: string;
}

export const durationOptions: { id: DurationKey; label: string; blurb: string }[] = [
  {
    id: 'acute',
    label: 'Acute / short window',
    blurb: 'Days to ~2 weeks of discussion in research or community logs',
  },
  {
    id: 'short',
    label: 'Short course',
    blurb: 'Roughly 2–8 weeks — common “cycle” length in forums (not clinical advice)',
  },
  {
    id: 'extended',
    label: 'Extended / ongoing',
    blurb: 'Multi-month or open-ended use discussions — highest caution zone',
  },
];

export const peptides: PeptideProfile[] = [
  {
    id: 'generic',
    name: 'Custom / unknown vial',
    category: 'General',
    vialMgDefault: 5,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 250,
    evidence: 'anecdotal',
    summary: 'Use when your vial isn’t in the list. Math only — no compound-specific guidance.',
    durationNotes: {
      acute: 'Keep logs. Without identity/purity docs, every draw is a bigger unknown.',
      short: 'Re-check lot COA and storage. Mystery powder + weeks of use is a bad combo.',
      extended: 'Strongly reconsider continuing any unlabeled or poorly documented material.',
    },
    cautions: ['No compound-specific research profile selected.', 'Verify label, lot, and COA yourself.'],
    sourcesHint: 'PubMed + your vial COA',
  },
  {
    id: 'bpc-157',
    name: 'BPC-157',
    category: 'Tissue / recovery research',
    vialMgDefault: 5,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 250,
    evidence: 'animal',
    summary:
      'Widely discussed “recovery” peptide online. Literature is heavily preclinical/animal; human RCTs for popular claims remain thin.',
    durationNotes: {
      acute: 'Short research windows dominate animal work. Treat social “instant heal” stories as anecdotes.',
      short: 'Forum “cycles” are not clinical protocols. Watch for quality/lot consistency across reorders.',
      extended: 'Long open-ended self-experimentation lacks solid human safety packages — elevate caution.',
    },
    cautions: [
      'Not an approved recovery drug for sports injuries.',
      'Evidence grade is largely animal/preclinical for common claims.',
    ],
    sourcesHint: 'PubMed: BPC-157; FDA/compounding safety communications when relevant',
  },
  {
    id: 'cjc-ipa',
    name: 'CJC-1295 / Ipamorelin',
    aliases: ['CJC/Ipamorelin'],
    category: 'GH-axis research',
    vialMgDefault: 5,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 100,
    evidence: 'mixed',
    summary:
      'Blend discussed for GH-axis signaling research. Human data quality varies by component and claim — don’t flatten into “GH juice.”',
    durationNotes: {
      acute: 'Early response chatter is noisy. Track sleep/appetite confounders if you log anything.',
      short: 'Repeated research draws raise sterility/reconstitution discipline importance.',
      extended: 'Long GH-axis experimentation talk belongs with a clinician — not a calculator.',
    },
    cautions: ['Blend ratios vary by supplier.', 'Not a substitute for diagnosed hormone care.'],
    sourcesHint: 'PubMed: CJC-1295, ipamorelin; ClinicalTrials.gov',
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'Metabolic / visceral research',
    vialMgDefault: 10,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 1000,
    evidence: 'fda-approved',
    summary:
      'Has an FDA-approved medicine context for specific indications. Research-vial / gray-market copies are a different regulatory story.',
    durationNotes: {
      acute: 'Approved labeling — not TikTok — defines indicated use windows.',
      short: 'Clinical courses follow prescribing information; DIY research vials do not inherit that label.',
      extended: 'Long-term medicine use is a clinician decision with monitoring — not a forum protocol.',
    },
    cautions: [
      'Approved indication ≠ green light for every online “fat loss” use.',
      'Separate approved pharmacy product from RUO catalog material.',
    ],
    sourcesHint: 'FDA label / DailyMed; PubMed clinical literature',
  },
  {
    id: 'mots-c',
    name: 'MOTS-c',
    category: 'Mitochondrial / metabolic research',
    vialMgDefault: 10,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 500,
    evidence: 'mixed',
    summary:
      'Mitochondrial-derived peptide with metabolic research interest. Consumer recomp claims outrun the human evidence base.',
    durationNotes: {
      acute: 'Mechanistic excitement ≠ validated human outcomes.',
      short: 'Short research stacks in culture often ignore confounders (diet, training, other compounds).',
      extended: 'Chronic use narratives need better human safety data than memes provide.',
    },
    cautions: ['Mixed / early human evidence for many wellness claims.'],
    sourcesHint: 'PubMed: MOTS-c mitochondrial peptide',
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide',
    category: 'Metabolic / incretin research',
    vialMgDefault: 10,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 2000,
    evidence: 'human',
    summary:
      'Investigational triple-agonist with notable clinical-trial attention. Access pathways and compounded lookalikes are not the same as trial product.',
    durationNotes: {
      acute: 'Titration talk in trials is protocolized — not DIY “start high.”',
      short: 'GI and other AE signals in incretin class deserve respect; calculator math won’t manage them.',
      extended: 'Long maintenance decisions belong in medical care with legitimate product.',
    },
    cautions: [
      'Clinical-trial context ≠ RUO vial equivalence.',
      'Serious metabolic drugs need clinical oversight.',
    ],
    sourcesHint: 'ClinicalTrials.gov; peer-reviewed trial publications',
  },
  {
    id: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4 fragment talk)',
    aliases: ['TB500'],
    category: 'Tissue research',
    vialMgDefault: 5,
    bacWaterMlDefault: 2,
    referenceAmountMcg: 500,
    evidence: 'animal',
    summary:
      'Community recovery staple. Naming and fragment identity get messy across vendors — verify what you actually have.',
    durationNotes: {
      acute: 'Short “injury blitz” stories are anecdotal.',
      short: 'Reconstitution + cold-chain discipline matter across multi-week logs.',
      extended: 'Extended use without identity confirmation is a documentation failure waiting to happen.',
    },
    cautions: ['Vendor naming may not match literature compound.', 'Mostly preclinical/anecdotal for popular claims.'],
    sourcesHint: 'PubMed: thymosin beta-4; vendor COA identity methods',
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'Skin / copper peptide research',
    vialMgDefault: 50,
    bacWaterMlDefault: 5,
    referenceAmountMcg: 1000,
    evidence: 'mixed',
    summary:
      'Copper peptide studied in skin/cosmetic science contexts. Injectable research chatter is a different lane than topical cosmetics.',
    durationNotes: {
      acute: 'Topical cosmetic literature ≠ injectable protocol.',
      short: 'Clarify route (topical vs research vial) before trusting any “use” guide online.',
      extended: 'Long copper exposure conversations need actual product chemistry, not vibes.',
    },
    cautions: ['Route of administration changes the entire risk picture.'],
    sourcesHint: 'PubMed: GHK-Cu; cosmetic science reviews',
  },
];

export function getPeptide(id: string): PeptideProfile {
  return peptides.find((p) => p.id === id) ?? peptides[0];
}
