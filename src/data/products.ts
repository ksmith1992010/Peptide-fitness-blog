export type BuyerTier = 'retail' | 'reseller' | 'wholesale';

export interface Product {
  slug: string;
  name: string;
  price: number;
  /** Minimum order quantity units */
  moq: number;
  /** Optional reseller unit price when MOQ met */
  resellerPrice?: number;
  /** Wholesale carton price (per unit equivalent display) */
  wholesalePrice?: number;
  wholesaleMoq?: number;
  blurb: string;
  details: string[];
  sku: string;
  category: 'consumables' | 'devices' | 'storage' | 'bundles' | 'reseller';
  forResellers?: boolean;
  supplierNote: string;
  /** Catalog image under /public/shop */
  image: string;
  imageAlt: string;
}

export const products: Product[] = [
  {
    slug: 'bac-water',
    name: 'Bacteriostatic Water',
    price: 18,
    moq: 1,
    resellerPrice: 14,
    wholesalePrice: 11,
    wholesaleMoq: 24,
    sku: 'AB-BAC-30',
    category: 'consumables',
    forResellers: true,
    blurb: '30 mL bacteriostatic water for peptide reconstitution workflows — accessories only, no compounds.',
    details: [
      '30 mL vial',
      '0.9% benzyl alcohol preservative',
      'Retail MOQ: 1 · Reseller break: 6+ · Wholesale carton: 24+',
      'Source: USP-grade bac water suppliers (lot-tracked)',
    ],
    supplierNote: 'Primary: Cascade / Hospira-equivalent medical supply distributors. Confirm COA per lot.',
    image: '/shop/bac-water.webp',
    imageAlt: 'Catalog studio photo: clear 30 mL bacteriostatic water vial on a pale surface',
  },
  {
    slug: 'insulin-syringes',
    name: 'U-100 Insulin Syringes',
    price: 22,
    moq: 1,
    resellerPrice: 17,
    wholesalePrice: 13,
    wholesaleMoq: 10,
    sku: 'AB-SYR-U100',
    category: 'devices',
    forResellers: true,
    blurb: 'Box of 100 × 1 mL U-100 syringes for precise unit draws.',
    details: [
      '100 count / box',
      '1 mL U-100 markings',
      'Reseller MOQ: 6 boxes · Wholesale: 10+ boxes',
      'Pairs with Amino Brief syringe tools',
    ],
    supplierNote: 'Primary: BD / EasyTouch authorized medical distributors.',
    image: '/shop/insulin-syringes.webp',
    imageAlt: 'Catalog studio photo: plain U-100 insulin syringe box with one sealed syringe',
  },
  {
    slug: 'vial-carry-case',
    name: 'Vial Carry Case',
    price: 34,
    moq: 1,
    resellerPrice: 26,
    wholesalePrice: 20,
    wholesaleMoq: 12,
    sku: 'AB-CASE-V4',
    category: 'storage',
    forResellers: true,
    blurb: 'Hard-shell travel case with foam inserts for vials and syringes.',
    details: [
      'Holds up to 4 standard vials',
      'Syringe sleeve + ice-pack slot',
      'Reseller break at 4 units',
      'No peptides included',
    ],
    supplierNote: 'OEM hard-case partners (Alibaba/US kitting). QC foam fit against 3mL/10mL vials.',
    image: '/shop/vial-carry-case.webp',
    imageAlt: 'Catalog studio photo: open hard-shell vial carry case with foam and empty vials',
  },
  {
    slug: 'alcohol-prep-pads',
    name: 'Alcohol Prep Pads',
    price: 9,
    moq: 1,
    resellerPrice: 7,
    wholesalePrice: 5,
    wholesaleMoq: 20,
    sku: 'AB-ALC-100',
    category: 'consumables',
    forResellers: true,
    blurb: '100-count sterile isopropyl prep pads for vial stoppers and bench hygiene.',
    details: ['70% IPA', 'Individually wrapped', 'Reseller MOQ: 10 packs'],
    supplierNote: 'Medline / Dynarex class distributors.',
    image: '/shop/alcohol-prep-pads.webp',
    imageAlt: 'Catalog studio photo: stack of individually wrapped alcohol prep pads',
  },
  {
    slug: 'sterile-empty-vials',
    name: 'Sterile Empty Vials (10 mL)',
    price: 16,
    moq: 1,
    resellerPrice: 12,
    wholesalePrice: 9,
    wholesaleMoq: 20,
    sku: 'AB-VIAL-10',
    category: 'consumables',
    forResellers: true,
    blurb: 'Pack of 10 sterile empty vials for aliquoting / lab organization.',
    details: ['10 × 10 mL', 'Rubber stopper + flip cap', 'Not for human drug manufacturing claims'],
    supplierNote: 'Wheaton-style lab vial suppliers; sterility cert required.',
    image: '/shop/sterile-empty-vials.webp',
    imageAlt: 'Catalog studio photo: row of empty sterile glass vials with stoppers',
  },
  {
    slug: 'nitrile-gloves',
    name: 'Nitrile Gloves (Box 100)',
    price: 14,
    moq: 1,
    resellerPrice: 11,
    wholesalePrice: 8,
    wholesaleMoq: 20,
    sku: 'AB-GLV-M',
    category: 'consumables',
    forResellers: true,
    blurb: 'Powder-free nitrile gloves for reconstitution bench work.',
    details: ['Size M standard (S/L on request)', 'Ambidesterous', 'Reseller case pricing available'],
    supplierNote: 'Medical glove wholesalers (Halyard / private label).',
    image: '/shop/nitrile-gloves.webp',
    imageAlt: 'Catalog studio photo: box of blue nitrile gloves with one glove pulled out',
  },
  {
    slug: 'vial-labels-kit',
    name: 'Vial Label + Date Kit',
    price: 12,
    moq: 1,
    resellerPrice: 9,
    wholesalePrice: 7,
    wholesaleMoq: 25,
    sku: 'AB-LBL-KIT',
    category: 'consumables',
    forResellers: true,
    blurb: 'Cryo-capable labels for lot, recon date, and concentration notes.',
    details: ['50 labels + marker', 'Solvent resistant', 'Designed for tool-output notes'],
    supplierNote: 'Lab label printers / Brady-compatible blanks.',
    image: '/shop/vial-labels-kit.webp',
    imageAlt: 'Catalog studio photo: blank vial labels and a laboratory marker',
  },
  {
    slug: 'recon-starter-kit',
    name: 'Recon Starter Kit',
    price: 59,
    moq: 1,
    resellerPrice: 48,
    wholesalePrice: 40,
    wholesaleMoq: 8,
    sku: 'AB-KIT-RECON',
    category: 'bundles',
    forResellers: true,
    blurb: 'Bac water + syringes + prep pads + labels — accessories only.',
    details: [
      '1× bac water 30 mL',
      '1× U-100 syringe box',
      '1× prep pads',
      '1× label kit',
      'No peptides included',
    ],
    supplierNote: 'Kitted in-house from component SKUs above.',
    image: '/shop/recon-starter-kit.webp',
    imageAlt: 'Catalog studio photo: reconstitution accessory kit flat lay',
  },
  {
    slug: 'reseller-sample-pack',
    name: 'Reseller Sample Pack',
    price: 89,
    moq: 1,
    resellerPrice: 89,
    sku: 'AB-RES-SAMP',
    category: 'reseller',
    forResellers: true,
    blurb: 'Assortment for gyms/clinics evaluating Amino Brief accessories for resale.',
    details: [
      '2× bac water',
      '2× syringe boxes',
      '1× carry case',
      '2× prep pads',
      'Sell sheet PDF included after order request',
    ],
    supplierNote: 'Internal kitting. Requires reseller note on order form.',
    image: '/shop/reseller-sample-pack.webp',
    imageAlt: 'Catalog studio photo: reseller sample assortment of accessory SKUs',
  },
  {
    slug: 'wholesale-syringe-case',
    name: 'Wholesale Syringe Case (10 boxes)',
    price: 130,
    moq: 10,
    resellerPrice: 130,
    wholesalePrice: 130,
    wholesaleMoq: 10,
    sku: 'AB-SYR-CASE10',
    category: 'reseller',
    forResellers: true,
    blurb: 'Carton of 10 U-100 syringe boxes for reseller shelves.',
    details: ['MOQ 10 boxes', 'Flat reseller carton rate', 'Ship freight-friendly'],
    supplierNote: 'Direct drop from syringe distributor when carton MOQ met.',
    image: '/shop/wholesale-syringe-case.webp',
    imageAlt: 'Catalog studio photo: wholesale carton stacked with plain syringe boxes',
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** SKUs that can use Stripe when Worker price secrets are set */
export const stripeCheckoutSlugs = [
  'bac-water',
  'insulin-syringes',
  'vial-carry-case',
  'alcohol-prep-pads',
  'sterile-empty-vials',
  'nitrile-gloves',
  'vial-labels-kit',
  'recon-starter-kit',
] as const;

export function priceForTier(product: Product, qty: number): { unit: number; tier: BuyerTier } {
  if (product.wholesaleMoq && product.wholesalePrice && qty >= product.wholesaleMoq) {
    return { unit: product.wholesalePrice, tier: 'wholesale' };
  }
  if (product.resellerPrice && qty >= Math.max(product.moq, 6)) {
    return { unit: product.resellerPrice, tier: 'reseller' };
  }
  return { unit: product.price, tier: 'retail' };
}
