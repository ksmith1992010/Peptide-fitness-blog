/**
 * Organic intent clusters Amino Brief can actually win.
 * Avoid “buy {peptide}” / dosing SERPs — accessories + literacy only.
 */
export interface SeoCluster {
  id: string;
  name: string;
  intent: string;
  hubPath: string;
  whyItWorks: string;
  pages: { label: string; path: string }[];
}

export const seoClusters: SeoCluster[] = [
  {
    id: 'literacy',
    name: 'Peptide literacy pillar',
    intent: 'Informational — what peptides are, how evidence works',
    hubPath: '/learn',
    whyItWorks: 'YMYL-safe educational intent; builds topical authority without drug claims.',
    pages: [
      { label: 'What peptides actually are', path: '/guides/what-peptides-actually-are' },
      { label: 'Evidence tiers', path: '/guides/evidence-tiers-cell-to-human' },
      { label: 'Reading papers without hype', path: '/guides/reading-peptide-papers-without-the-hype' },
      { label: 'Common myths', path: '/guides/common-peptide-myths' },
      { label: 'Evidence grades', path: '/evidence' },
    ],
  },
  {
    id: 'quality',
    name: 'Quality & sourcing',
    intent: 'Informational — COA / RUO / vendor evaluation',
    hubPath: '/resources/sourcing-notes',
    whyItWorks: 'Citation-friendly explainers earn .edu and industry links; high trust signals.',
    pages: [
      { label: 'How to read a COA', path: '/guides/how-to-read-a-coa' },
      { label: 'Why RUO labels exist', path: '/guides/why-ruo-labels-exist' },
      { label: 'Evaluate a source', path: '/guides/how-to-evaluate-a-peptide-source' },
      { label: 'Storage literacy', path: '/guides/storage-and-cold-chain-literacy' },
      { label: 'Sourcing notes', path: '/resources/sourcing-notes' },
    ],
  },
  {
    id: 'compounds',
    name: 'Compound hubs',
    intent: 'Name queries — “BPC-157 evidence”, “retatrutide research”',
    hubPath: '/compounds',
    whyItWorks: 'Cluster model: hub + snapshot guide; outrank thin affiliate pages with grades + sources.',
    pages: [
      { label: 'Compounds index', path: '/compounds' },
      { label: 'BPC-157', path: '/compounds/bpc-157' },
      { label: 'Retatrutide', path: '/compounds/retatrutide' },
      { label: 'Tesamorelin', path: '/compounds/tesamorelin' },
      { label: 'MOTS-c', path: '/compounds/mots-c' },
    ],
  },
  {
    id: 'incretin-media',
    name: 'Incretin / media literacy',
    intent: 'News & comparison — GLP-1 headlines, approved vs research',
    hubPath: '/guides/glp1-headlines-vs-evidence',
    whyItWorks: 'Captures media-driven demand without selling prescription drugs or protocols.',
    pages: [
      { label: 'GLP-1 headlines vs evidence', path: '/guides/glp1-headlines-vs-evidence' },
      { label: 'Approved vs research', path: '/guides/approved-vs-research-compounds' },
      { label: 'Retatrutide snapshot', path: '/guides/retatrutide-evidence-snapshot' },
      { label: 'GPCR peptide ligands', path: '/guides/gpcr-peptide-ligands-literacy' },
    ],
  },
  {
    id: 'methods-desk',
    name: 'Methods desk (research lanes)',
    intent: 'Long-tail science literacy from Nature-class papers',
    hubPath: '/guides/reading-peptide-papers-without-the-hype',
    whyItWorks: 'Differentiates from forum SEO; primary-source links; AI-citation friendly definitions.',
    pages: [
      { label: 'Peptide synthesis literacy', path: '/guides/peptide-synthesis-literacy' },
      { label: 'Cyclic peptides', path: '/guides/cyclic-peptides-research-lane' },
      { label: 'Imaging peptides', path: '/guides/imaging-peptides-research-lane' },
      { label: 'Conotoxin research lane', path: '/guides/conotoxin-research-lane' },
      { label: 'Designed peptides vs medicine', path: '/guides/designed-peptides-materials-vs-medicine' },
    ],
  },
  {
    id: 'tools',
    name: 'Reconstitution tools',
    intent: 'Tool + how-to — unit math without guru protocols',
    hubPath: '/tools',
    whyItWorks: 'High engagement utilities; pair each tool with a literacy guide.',
    pages: [
      { label: 'Reconstitution calculator', path: '/tools/reconstitution' },
      { label: 'Recon math guide', path: '/guides/reconstitution-math-without-the-guru' },
      { label: 'Syringe units', path: '/tools/syringe-units' },
      { label: 'Vial math', path: '/tools/vial-math' },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories shop',
    intent: 'Commercial — bac water, syringes, cases (not peptides)',
    hubPath: '/shop',
    whyItWorks: 'Cleaner commercial SERPs than gray-market peptide queries; matches what we sell.',
    pages: [
      { label: 'Shop', path: '/shop' },
      { label: 'Bac water', path: '/shop/bac-water' },
      { label: 'Insulin syringes', path: '/shop/insulin-syringes' },
      { label: 'Recon starter kit', path: '/shop/recon-starter-kit' },
    ],
  },
];
