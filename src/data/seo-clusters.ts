/**
 * Organic intent clusters Amino Brief can actually win.
 * Avoid “buy {peptide}” / dosing SERPs — accessories + literacy only.
 */
export interface SeoCluster {
  id: string;
  name: string;
  /** Short learner-facing label */
  shortLabel: string;
  intent: string;
  hubPath: string;
  whyItWorks: string;
  /** One-line job for Learn / filters */
  job: string;
  pages: { label: string; path: string }[];
}

export type GuideLike = {
  id: string;
  data: { tags: string[]; category: string; evidence: string; title?: string };
};

/** Map a guide into the UX/SEO cluster used for filters + “continue” CTAs */
export function clusterIdForGuide(guide: GuideLike): string {
  const tags = guide.data.tags.map((t) => t.toLowerCase());
  const id = guide.id.toLowerCase();
  const title = (guide.data.title || '').toLowerCase();
  const blob = `${id} ${title} ${tags.join(' ')}`;

  if (
    /bpc|tb-500|cjc|ipa|ghk|mots|retatrutide|tesamorelin/.test(blob) &&
    (id.includes('snapshot') || tags.some((t) => /bpc|tb-500|cjc|ghk|mots|retatrutide|tesamorelin/.test(t)))
  ) {
    return 'compounds';
  }
  if (guide.data.category === 'quality' || /coa|ruo|sourc|storage|cold-chain/.test(blob)) {
    return 'quality';
  }
  if (/glp|incretin|ozempic|wegovy|approved-vs|media/.test(blob)) {
    return 'incretin-media';
  }
  if (/synthesis|cyclic|gpcr|imaging|conotoxin|materials|nano|amp|antimicrobial|hormone-signaling|newsroom|methods/.test(blob)) {
    return 'methods-desk';
  }
  if (/recon|syringe|vial-math|tool/.test(blob)) {
    return 'tools';
  }
  return 'literacy';
}

export function continuePathsForGuide(guide: GuideLike): { label: string; path: string }[] {
  const clusterId = clusterIdForGuide(guide);
  const cluster = seoClusters.find((c) => c.id === clusterId);
  const out: { label: string; path: string }[] = [];
  if (cluster) {
    out.push({ label: `${cluster.shortLabel} hub`, path: cluster.hubPath });
    for (const p of cluster.pages) {
      if (p.path === `/guides/${guide.id}`) continue;
      if (out.length >= 4) break;
      out.push(p);
    }
  }
  out.push({ label: 'Evidence grades', path: '/evidence' });
  out.push({ label: 'Sourcing notes', path: '/resources/sourcing-notes' });
  // de-dupe by path
  const seen = new Set<string>();
  return out.filter((p) => {
    if (seen.has(p.path)) return false;
    seen.add(p.path);
    return true;
  }).slice(0, 5);
}

export const seoClusters: SeoCluster[] = [
  {
    id: 'literacy',
    name: 'Peptide literacy pillar',
    shortLabel: 'Literacy',
    intent: 'Informational — what peptides are, how evidence works',
    hubPath: '/learn',
    job: 'Start here — definitions, evidence tiers, myths.',
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
    shortLabel: 'Sourcing',
    intent: 'Informational — COA / RUO / vendor evaluation',
    hubPath: '/resources/sourcing-notes',
    job: 'Paperwork literacy — COAs, RUO labels, vendor checks.',
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
    shortLabel: 'Compounds',
    intent: 'Name queries — “BPC-157 evidence”, “retatrutide research”',
    hubPath: '/compounds',
    job: 'Name-by-name research notes — not protocols.',
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
    shortLabel: 'Media',
    intent: 'News & comparison — GLP-1 headlines, approved vs research',
    hubPath: '/guides/glp1-headlines-vs-evidence',
    job: 'Read GLP-1 / “approved vs research” headlines without the hype.',
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
    shortLabel: 'Methods',
    intent: 'Long-tail science literacy from Nature-class papers',
    hubPath: '/guides/reading-peptide-papers-without-the-hype',
    job: 'Nature-class papers framed as research lanes — not stacks.',
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
    shortLabel: 'Tools',
    intent: 'Tool + how-to — unit math without guru protocols',
    hubPath: '/tools',
    job: 'mg / mL / units — math without protocol porn.',
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
    shortLabel: 'Shop',
    intent: 'Commercial — bac water, syringes, cases (not peptides)',
    hubPath: '/shop',
    job: 'Bac water, syringes, cases — accessories only.',
    whyItWorks: 'Cleaner commercial SERPs than gray-market peptide queries; matches what we sell.',
    pages: [
      { label: 'Shop', path: '/shop' },
      { label: 'Bac water', path: '/shop/bac-water' },
      { label: 'Insulin syringes', path: '/shop/insulin-syringes' },
      { label: 'Recon starter kit', path: '/shop/recon-starter-kit' },
    ],
  },
];
